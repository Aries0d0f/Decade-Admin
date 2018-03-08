<template>
  <div class="createStock-container" v-loading="loading">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" v-if="!loading">
      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <span style="color: #fff;">
            草稿
            <el-switch v-model="isDraft"></el-switch>
          </span>
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">發布</el-button>
          <el-button v-loading="loading" v-if="isEdit" @click="viewDraft" type="warning">預覽草稿</el-button>
        </template>
        <template v-else>
          <el-tag>獲取失敗，請重新整理頁面</el-tag>
        </template>
      </sticky>
      <div class="createStock-main-container">
        <el-form-item style="margin-bottom: 40px;" prop="name">
          <MDinput name="name" v-model="postForm.name" required :maxlength="100">
            商品名稱
          </MDinput>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="分類" prop="category">
          <el-cascader :options="options" :props="props" placeholder="請選擇分類" v-model="categoryClass" @change="handleSelectCategort"></el-cascader>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="照片" prop="img">
          <MultipleUpload v-model="postForm.img" :defaultImg="postForm.img"></MultipleUpload>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="關鍵字">
          <el-select v-model="postForm.tag" style="width: 100%" multiple filterable :allow-create="postForm.tag && postForm.tag.length < 5" default-first-option placeholder="請輸入關鍵字" no-data-text="請輸入關鍵字" no-match-text="已達 5 組關鍵字">
            <el-option v-for="item in postForm.tag" :key="item.value" :label="item.value" :value="item.value"></el-option>
          </el-select>
          <span>(已輸入 {{postForm.tag.length || 0}} 組，還可以增加 {{ 5 - (postForm.tag.length || 0)}} 組)</span>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;">
          <h4 class="form-subtitle">商品規格</h4>
          <el-collapse class="spec-collapse">
            <el-form-item
              v-for="(item, index) in postForm.spec"
              v-model="postForm.spec"
              :key="index"
              style="margin-left: 1rem;"
            >
              <el-collapse-item :title="`#${index + 1}. ${item.name}` || `規格 ${index + 1}`" :name="index">
                <div class="spec-container">
                  <el-form-item>
                    <Upload style="height: 100%;margin: 1rem 1rem 0 0" v-model="item.imageURL" :defaultImg="item.imageURL"></Upload>
                  </el-form-item> 
                  
                  <div class="spec-form">
                    <el-form-item label="名稱" prop="specName" style="margin-bottom:.8rem;">
                      <el-input v-model="item.name" placeholder=""></el-input>
                    </el-form-item> 
                    
                    <el-form-item label="數量" prop="specCount">
                      <el-input-number v-model.number="item.count" controls-position="right" :min="1" :max="9999" style="width: 100%"></el-input-number>
                    </el-form-item> 
                    
                    <el-form-item label="金額" prop="specPriceDefault">
                      <el-input-number v-model.number="item.priceDefault" :controls="false" :min="0" style="width: 100%"></el-input-number>
                    </el-form-item>
                  </div>
                  <el-button type="danger" class="delete-btn" icon="el-icon-delete" @click.prevent="removeSpec(index)"></el-button>
                </div>
              </el-collapse-item>
            </el-form-item>
          </el-collapse>
          <el-button @click="addSpec">新增規格</el-button>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" v-if="categoryClass[0] === 0 || isTicket">
          <h4 class="form-subtitle">票券說明</h4>
          <el-form-item style="width:15rem;margin-bottom:1rem" label-width="60px" label="分店">
            <el-input v-model="postForm.info.teacher" placeholder=""></el-input>
          </el-form-item>
          <el-form-item style="width:15rem" label-width="60px" label="日期">
            <el-date-picker v-model="postForm.info.time" type="datetime" placeholder=""></el-date-picker>
          </el-form-item>
        </el-form-item>


        <el-form-item style="margin-bottom: 40px;">
          <h4 class="form-subtitle">商品簡介</h4>
          <el-form-item style="width:100%" prop="summary">
            <el-input type="textarea" v-model="postForm.info.summary" :autosize="{ minRows: 4 }"></el-input>
          </el-form-item>          
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;">
          <h4 class="form-subtitle">商品描述</h4>
          <el-form-item class="editor-container" prop="discription">
            <tinymce :height=400 ref="editor" v-model="postForm.info.discription"></tinymce>
          </el-form-item>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;">
          <h4 class="form-subtitle">商品規格及須知</h4>
          
          <el-tabs tab-position="left">
            <el-tab-pane label="規格">
              <span slot="label" class="item-detail-pane">商品規格</span>
              <el-form-item
                v-for="(item, index) in postForm.info.specInfo"
                v-model="postForm.info.specInfo"
                :label="'規格' + (index + 1)"
                :key="index"
                style="margin-left: 1rem;"
              >
                <el-input v-model="item.name" placeholder="請輸入選項名稱" style="width: 15rem;margin-bottom: 1rem;"></el-input>
                <el-button type="danger" icon="el-icon-delete" @click.prevent="removeSpecInfo(index)"></el-button>
                <div>
                  <el-input v-model="item.detail" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="說明" style="width: 20rem;margin-bottom: .5rem;"></el-input>
                </div>
              </el-form-item>
              <el-button @click="addSpecInfo">新增規格</el-button>
            </el-tab-pane>
            
            <el-tab-pane label="購買須知">
              <span slot="label" class="item-detail-pane">購買須知</span>
              <div>購買須知</div>
              <el-form-item>
                <div class="editor-container">
                  <tinymce :height=400 ref="editor" v-model="postForm.info.note"></tinymce>
                </div>
              </el-form-item>
            </el-tab-pane>
            
            <el-tab-pane label="注意事項">
              <span slot="label" class="item-detail-pane">注意事項</span>
              <div>注意事項</div>
              <el-form-item>
                <div class="editor-container">
                  <tinymce :height=400 ref="editor" v-model="postForm.info.warn"></tinymce>
                </div>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <h4 class="form-subtitle">出貨廠商</h4>
        <el-table :data="postForm.seller" :header-row-style="{ background: '#efefef' }" empty-text="尚未新增關聯帳號" style="width: 100%;max-width: 40rem">
          <el-table-column prop="id" label="編號"></el-table-column>
          <el-table-column label="帳號">
            <template slot-scope="scope">
              {{scope.row.data.username}}
            </template>
          </el-table-column>

          <el-table-column label="" class-name="small-padding fixed-width" width="100">
            <template slot-scope="scope">
              <el-button size="mini" @click="removeVendor(scope.row.id)">刪除</el-button>
            </template>
          </el-table-column>                
        </el-table>
        <div class="new-vendor" style="max-width: 20rem">
          <el-input class="vendor-input" v-model="newVendor.username" placeholder="請輸入帳號"></el-input>
          <el-button @click="addVendor" size="mini">新增</el-button>
        </div>

        <h4 class="form-subtitle">推薦商品 & 文章</h4>
        <el-row :gutter="20" v-if="userInfo.role === 0">
          <el-col :span="12">
            <RelatedStock ref="RelatedStock" :idList="postForm.related2"></RelatedStock>
          </el-col>
          <el-col :span="12">
            <RelatedPost ref="RelatedPost" :idList="postForm.related"></RelatedPost>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import MultipleUpload from '@/components/Upload/multipleImage'
import Upload from '@/components/Upload/singleImage2'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky'
import RelatedStock from '@/components/RelatedCard/stock'
import RelatedPost from '@/components/RelatedCard/post'
import { fetchStock, createStock, updateStock } from '@/api/stock'
import { fetchUserQuery, fetchUser } from '@/api/user'

const defaultForm = {
  type: undefined,
  catalog: undefined,
  comboList: [],
  tag: [],
  img: [],
  name: undefined,
  info: {
    type: undefined,
    summary: undefined,
    discription: undefined,
    teacher: undefined,
    time: undefined,
    specInfo: [],
    note: undefined,
    warn: undefined
  },
  available: false,
  status: 0,
  spec: [
    {
      name: '',
      priceDefault: undefined,
      priceOnsale: undefined,
      count: undefined,
      imageURL: undefined
    }
  ],
  related: [],
  related2: [],
  seller: []
}

export default {
  name: 'StockDetail',
  components: { Tinymce, MDinput, Upload, Sticky, RelatedStock, RelatedPost, MultipleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      isDraft: true,
      fetchSuccess: true,
      loading: true,
      imgUploading: false,
      dialogImageUrl: '',
      isTicket: false,
      dialogVisible: false,
      loadingUser: false,
      uploadUrl: 'https://decade.global/img',
      itemContent: '',
      imgList: [],
      relatedItems: [],
      categoryClass: [],
      specInfo: [],
      newVendor: {
        username: ''
      },
      rules: {
        name: [
          { required: true, message: '請輸入商品名稱', trigger: 'blur' }
        ],
        specName: [
          {
            validator: (rule, value, callback) => {
              this.postForm.spec.map(item => {
                if (item.name.length === 0) {
                  callback('請輸入名稱')
                }
              })
              callback()
            },
            trigger: 'blur'
          }
        ],
        imageUrl: [
          {
            validator: (rule, value, callback) => {
              this.postForm.spec.map(item => {
                if (item.imageURL.length === 0) {
                  callback('請上傳圖片')
                }
              })
              callback()
            },
            trigger: 'change'
          }
        ],
        category: [
          {
            validator: (rule, value, callback) => {
              if (this.categoryClass.length !== 2) {
                return callback('請選擇分類')
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        discription: [
          {
            validator: (rule, value, callback) => {
              if (!this.postForm.info.discription || this.postForm.info.discription.length === 0) {
                return callback('請輸入商品描述')
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        summary: [
          {
            validator: (rule, value, callback) => {
              if (!this.postForm.info.summary || this.postForm.info.summary.length === 0) {
                return callback('請輸入商品簡介')
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      specRules: {
        validator: (rule, value, callback) => {
          if (this.categoryClass.length !== 2) {
            return callback('請選擇分類')
          }
          callback()
        },
        trigger: 'change'
      },
      options: [],
      props: {
        value: 'type',
        children: 'children',
        label: 'title'
      }
    }
  },
  async created() {
    this.options = this.StockClass
    if (this.isEdit) {
      await this.fetchData()
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.postForm.seller.map(async x => {
      x.data = await fetchUser(x.id)
    })
    this.loading = false
  },
  computed: {
    ...mapGetters(['userInfo', 'StockClass'])
  },
  watch: {
    'postForm.spec': {
      handler: function(val) {
        val.map(item => {
          const imgUrl = item.imageURL || undefined
          if (imgUrl && !this.postForm.img.some(x => x === imgUrl)) {
            this.postForm.img.push(imgUrl)
            this.imgList.push({ name: new Date().getTime(), url: imgUrl })
          }
        })
      },
      deep: true
    }
  },
  methods: {
    async fetchData() {
      try {
        const stock = await fetchStock(this.$route.params.id)
        Object.assign(this.postForm, stock)
        // this.postForm = stock
        this.postForm.info = JSON.parse(stock.info)
        // eslint-disable-next-line
        this.isDraft = this.postForm.status === 1 ? false : true
        this.isTicket = this.postForm.info.type === 0 ? true : this.postForm.type === 3 ? 1 : 0
        this.postForm.img.map((img, i) => {
          this.imgList.push({ name: i, url: img })
        })
        this.categoryClass = [parseInt(this.postForm.info.type, 10), this.postForm.catalog]
        this.postForm.seller = this.postForm.seller.map(x => {
          return { id: x, data: {}}
        })
        // 舊版商品格式處理
        if (this.postForm.spec === 0 || !this.postForm.spec[0].priceDefault) {
          this.postForm.spec.forEach((spec, i) => {
            this.postForm.spec[i] = { name: spec.name, count: spec.count, priceDefault: undefined, priceOnsale: undefined, imageURL: spec.imageURL || undefined }
          })
        }
      } catch (err) {
        this.fetchSuccess = false
        console.log(err)
      }
    },
    async submitForm() {
      if (!await this.validateForm()) return
      const postData = JSON.parse(JSON.stringify(this.postForm))
      postData.related = this.$refs.RelatedPost.relatedItems.map(x => x.key)
      postData.related2 = this.$refs.RelatedStock.relatedItems.map(x => x.key)
      postData.catalog = this.categoryClass[1] !== -1 ? this.categoryClass[1] : -1
      postData.status = this.isDraft ? 0 : 1
      postData.info.type = this.categoryClass[0]
      postData.info = JSON.stringify(postData.info)
      postData.type = this.categoryClass[0] === 0 ? 3 : this.isTicket ? 3 : 1
      postData.img = []
      postData.seller = this.postForm.seller.map(x => x.id)
      this.imgList.map(x => postData.img.push(x.url))
      try {
        if (this.isEdit) {
          await updateStock(this.$route.params.id, postData)
        } else {
          await createStock(postData)
        }
        this.$notify({ title: '成功', message: '發布成功', type: 'success', duration: 2000 })
        this.$router.push({ name: 'StockList' })
      } catch (err) {
        this.$notify({ title: '失敗', message: '發布失敗，伺服器錯誤！', type: 'error', duration: 2000 })
        console.log(err)
      }
      this.loading = false
    },
    async viewDraft() {
      if (!await this.validateForm()) return
      const postData = Object.assign({}, this.postForm)
      this.isDraft = true
      postData.related = this.$refs.RelatedPost.relatedItems.map(x => x.key)
      postData.catalog = this.categoryClass[1] !== -1 ? this.categoryClass[1] : -1
      postData.status = 0
      postData.info.type = this.categoryClass[0]
      postData.info = JSON.stringify(this.postForm.info)
      postData.type = this.categoryClass[0] === 0 ? 3 : this.isTicket ? 3 : 1
      postData.img = []
      postData.seller = this.postForm.seller.forEach(x => x.id)
      this.imgList.map(x => postData.img.push(x.url))
      try {
        await updateStock(this.$route.params.id, postData)
        this.$notify({ title: '成功', message: '發布成功', type: 'success', duration: 2000 })
        window.open(`https://decade.global/shop/stock/${this.$route.params.id}`, '_blank')
      } catch (err) {
        this.$notify({ title: '失敗', message: '發布失敗，請檢查欄位', type: 'error', duration: 2000 })
        console.log(err)
      }
      this.loading = false
    },
    validateForm() {
      return new Promise((resolve) => {
        this.$refs.postForm.validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            this.$message.error('上傳失敗，請先將表單內容填寫完畢！')
            resolve(false)
          }
        })
      })
    },
    handleSelectCategort(category) {
      this.postForm.info.type = category[0]
      this.postForm.catalog = category[1]
    },
    addSpec() {
      this.postForm.spec.push({
        name: '',
        priceDefault: undefined,
        priceOnsale: undefined,
        count: undefined,
        imageURL: ''
      })
    },
    removeSpec(index) {
      if (this.postForm.spec.length === 1) {
        return this.$message.error('失敗：商品至少需要有一種分類！')
      }
      const imgUrl = this.postForm.spec[index].imageURL
      const inImgIndex = this.postForm.img.findIndex(x => x === imgUrl)
      const inImgListIndex = this.imgList.findIndex(x => x.url === imgUrl)
      if (inImgIndex !== -1) {
        this.postForm.img.splice(inImgIndex, 1)
      }
      if (inImgListIndex !== -1) {
        this.imgList.splice(inImgListIndex, 1)
      }
      this.postForm.spec.splice(index, 1)
    },
    addSpecInfo() {
      this.postForm.info.specInfo.push({ name: undefined, detail: undefined })
    },
    removeSpecInfo(index) {
      this.postForm.info.specInfo.splice(index, 1)
    },
    handleImageError() {
      this.$message.error('錯誤：圖片上傳失敗，請重試！')
      this.imgUploading = false
    },
    async addVendor() {
      if (this.postForm.seller.some(x => x.data.username === this.newVendor.username)) {
        this.$message.error('錯誤：該廠商已在列表中！')
        this.newVendor.username = ''
        return
      }
      try {
        const [user] = await fetchUserQuery(`where={"username":["${this.newVendor.username}"]}`)
        if (user.role !== 3) {
          this.$message.error('錯誤：該會員不是 Decade 簽約廠商！')
          this.newVendor.username = ''
          return
        }
        this.postForm.seller.push({ id: user.id, data: user })
      } catch (error) {
        this.$message.error('錯誤：查無該廠商！')
      } finally {
        this.newVendor.username = ''
      }
    },
    removeVendor(key) {
      const index = this.postForm.seller.findIndex(x => x.id === key)
      if (index !== -1) {
        this.postForm.seller.splice(index, 1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .item-detail-pane{
    width: 100%;
    display: block;
    text-align: left;
  }

  .form-subtitle{
    font-weight: normal;
    font-size: 1.2rem;
    letter-spacing: 3px;
  }
  .new-vendor{
    display: flex;
    margin: 1rem 0;
    .vendor-input{
      margin-right: 1rem;
    }
  }
  .tooltip-btn{
    cursor: pointer;
    border: 1px solid #ccc;
    color: #ccc;
    border-radius: 50%;
    padding: 1px 5px;
  }

  .createStock-container {
    position: relative;
    margin-bottom: 20vh;
    
    .createStock-main-container {
      padding: 40px 45px 20px 50px;
    }
  }
  .spec-collapse{
    margin-bottom: 1rem;
  }
  .spec-container{
    display: flex;
    width: 100%;
    margin-bottom: .5rem;

    .spec-form{
      width: 100%;
      max-width: 30rem;
    }

    .delete-btn{
      margin: 0 .5rem;
      height: 2rem;
    }
  }
</style>

