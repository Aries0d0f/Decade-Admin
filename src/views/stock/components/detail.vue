<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row :gutter="20">
          <el-col :span="15">
            <el-card class="box-card">
              <h3 class="form-title">新增優惠券</h3>
              <el-form-item style="margin-bottom: 20px;" label-width="120px" label="優待券名稱" prop="name">
                <el-input style="width: 40rem" v-model="postForm.name" placeholder=""></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;" label-width="120px" label="優惠券代碼" prop="code">
                <el-input style="width: 10rem" v-model="postForm.code" placeholder=""></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;" label-width="120px" label="使用限制" prop="combine">
                <el-radio-group v-model="postForm.combine">
                  <el-radio :label="true">可合併使用</el-radio>
                  <el-radio :label="false">單獨使用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;" label-width="120px" label="優惠方式" prop="discount">
                <el-radio-group v-model="postForm.discount.type">
                  <el-radio :label="0">單項定額</el-radio>
                  <el-radio :label="1">金額</el-radio>
                  <el-radio :label="2">百分比 %</el-radio>
                </el-radio-group>
                <el-input v-model.number="postForm.discount.amount" size="mini" style="margin-left: 40px;width: 15rem" :placeholder="discountPlaceholder"></el-input>
              </el-form-item>
              
              <el-form-item style="margin-bottom: 20px;" label-width="120px" label="使用條件" prop="require">
                <el-radio-group v-model="postForm.require.type">
                  <el-radio :label="1">任一滿足</el-radio>
                  <el-radio :label="0">均須滿足</el-radio>
                  <el-radio :label="2">不啟用</el-radio>
                </el-radio-group>
                <template v-if="postForm.require.type === 0 || postForm.require.type === 1">
                  <div>
                    <el-checkbox v-model="requireType.limitItem">
                      指定商品
                    </el-checkbox>
                    <span class="require-type-item">
                      <el-select
                        v-model="postForm.require.limitItem"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        style="width: 100%;"
                        placeholder="請輸入商品名稱"
                        :remote-method="queryStock"
                        :loading="loading">
                        <el-option v-for="item in queryList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                      </el-select>
                    </span>
                  </div>
                  <div>
                    <el-checkbox v-model="requireType.limitItemCount">
                      購買總數 
                      <span v-if="requireType.limitItemCount" class="require-type-item">
                        任
                        <el-input v-model="postForm.require.limitItemCount" size="mini" style="margin: 0 5px;width: 5rem" placeholder=""></el-input>
                        件
                      </span>
                    </el-checkbox>
                  </div>
                  <div>
                    <el-checkbox v-model="requireType.limitMinPrice">
                      最低使用價格 
                      <span v-if="requireType.limitMinPrice" class="require-type-item">
                        滿
                        <el-input v-model="postForm.require.limitMinPrice" size="mini" style="margin: 0 5px;width: 5rem" placeholder=""></el-input>
                        ，即可抵用
                      </span>
                    </el-checkbox>
                  </div>
                </template>                
              </el-form-item>

              <el-form-item style="margin-bottom: 20px;" label-width="120px" label="使用期限">
                <el-switch disabled></el-switch>
              </el-form-item>

              <el-form-item style="margin-bottom: 20px;" label-width="120px" label="發放數量" prop="count">
                <el-input v-model.number="postForm.count" size="mini" style="width: 5rem" placeholder=""></el-input>
                 張
              </el-form-item>

              <el-button v-loading="loading" @click="submitForm" class="submit-btn">提交</el-button>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { querySearch } from '@/api/search'
import { fetchCoupon, createCoupon, updateCoupon } from '@/api/coupon'

const defaultForm = {
  name: '',
  combine: undefined,
  discount: {
    type: undefined,
    amount: undefined
  },
  require: {
    type: undefined,
    limitItem: undefined,
    limitItemCount: undefined,
    limitMinPrice: undefined
  },
  code: undefined,
  count: undefined
}

export default {
  name: 'articleDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      queryList: [],
      rules: {
        name: [
          { required: true, message: '請輸入優待券名稱', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '請輸入優待券代碼', trigger: 'blur' }
        ],
        combine: [
          { required: true, message: '請選擇使用限制', trigger: 'change' }
        ],
        count: [
          { type: 'number', required: true, message: '請輸入發放張數', trigger: 'blur' }
        ],
        discount: [
          {
            validator: (rule, value, callback) => {
              if (!value.type && value.type !== 0) {
                callback(new Error('請選擇優惠方式'))
              } else if (!value.amount && value.amount !== 0) {
                callback(new Error('請輸入優惠金額'))
              } else if (value.type === 0 && value.amount < 1) {
                callback(new Error('請輸入有效的金額'))
              } else if (value.type === 1 && value.amount < 1) {
                callback(new Error('請輸入有效的金額'))
              } else if (value.type === 2 && value.amount >= 1 || value.amount <= 0) {
                callback(new Error('請輸入有效的百分比'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        require: [
          {
            validator: (rule, value, callback) => {
              if (!value.type && value.type !== 0) {
                return callback(new Error('請選擇使用條件'))
              }
              let errorMsg = ''
              if (this.requireType.limitItem && !value.limitItem) {
                errorMsg += '請選擇使用商品、'
              }
              if (this.requireType.limitItemCount && !value.limitItemCount) {
                errorMsg += '請輸入購買總數、'
              }
              if (this.requireType.limitMinPrice && !value.limitMinPrice) {
                errorMsg += '請輸入最低使用金額、'
              }
              if (errorMsg.length > 0) {
                callback(new Error(errorMsg))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      requireType: {
        limitItem: false,
        limitItemCount: false,
        limitMinPrice: false
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData()
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  computed: {
    discountPlaceholder() {
      if (!this.postForm.discount.type) return ''
      return this.postForm.discount.type === 2 ? '請輸入百分比(e.g.0.95)' : '請輸入金額'
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        this.postForm = await fetchCoupon(this.$route.params.id)
      } catch (err) {
        this.fetchSuccess = false
      }
      this.loading = false
    },
    async queryStock(queryString, cb) {
      if (!queryString) return cb()
      const items = []
      const list = await querySearch(queryString)
      list.stock.map(x => {
        items.push({ value: x.id, name: x.name, price: x.price, data: x })
      })
      this.queryList = items
    },
    async submitForm() {
      this.$refs.postForm.validate(async valid => {
        if (!valid) return
        this.loading = true
        try {
          if (this.isEdit) {
            const data = {}
            Object.keys(defaultForm).map(x => data[x] = this.postForm[x])
            await updateCoupon(this.postForm.id, data)            
          } else {
            await createCoupon(this.postForm)
          }
          this.$notify({ title: '成功', message: '發布成功', type: 'success', duration: 1000 })
          this.$router.push({ name: 'CouponList' })
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }

  .form-title{
    color: #b27536;
    font-weight: normal;
  }

  .require-type-item{
    color: #6b6b6b;
    font-size: .5rem;
  }

  .submit-btn{
    background: #d4a16a;
    float: right;
    margin-bottom: 2rem;
    letter-spacing: 5px;
    font-size: 1.3rem;
    color: #fff;
  }

  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>

