<template>
  <div class="createStock-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <el-button v-loading="loading" style="margin-left: 10px;" type="info">草稿</el-button>
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">發布</el-button>
          <el-button v-loading="loading" type="warning">瀏覽</el-button>
        </template>
        <template v-else>
          <el-tag>獲取失敗，請重新整理頁面</el-tag>
        </template>
      </sticky>
      <div class="createStock-main-container">
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput name="name" v-model="postForm.title" required :maxlength="100">
            商品名稱
          </MDinput>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="title" label-width="60px" label="分類">
          <el-cascader :options="options" placeholder="請選擇分類" v-model="categoryClass" @change="handleSelectCategort"></el-cascader>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="關鍵字">
          <el-select v-model="postForm.tag" style="width: 40%" multiple filterable :allow-create="postForm.tag.length < 5" default-first-option placeholder="請輸入關鍵字" no-data-text="請輸入關鍵字" no-match-text="已達 5 組關鍵字">
            <el-option v-for="item in postForm.tag" :key="item.value" :label="item.value" :value="item.value"></el-option>
          </el-select>
          <div>(已輸入 {{postForm.tag.length}} 組，還可以增加 {{ 5 - postForm.tag.length}} 組)</div>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="照片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;">
          <h4 class="form-subtitle">商品資訊</h4>
          <el-tabs tab-position="left">
            <el-tab-pane label="價格">
              <span slot="label" class="item-detail-pane">價格</span>
              <el-form-item style="width:15rem" label-width="60px" label="售價">
                <el-input v-model="postForm.price.orig" placeholder="">
                  <span slot="prefix" style="margin: 0 .5rem;"> $</span>
                </el-input>
              </el-form-item>              
              <el-form-item label-width="60px">
                <el-checkbox v-model="checked">服務體驗類若無預設金額請勾選</el-checkbox>
                <el-tooltip class="item" effect="dark" placement="bottom">
                  <div slot="content">服務體驗選項，將於售價顯示"獨家體驗服務無需預繳任何費用，<br>視體驗活動現場與商家線上核銷確認購買該組合套餐。"</div>
                  <span class="tooltip-btn">?</span>
                </el-tooltip>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品簡短說明">
              <span slot="label" class="item-detail-pane">商品簡短說明</span>
              <div>商品簡介</div>
              <el-form-item style="width:40%">
                <el-input type="textarea" :autosize="{ minRows: 4 }"></el-input>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="可選規格與銷售數量">
              <span slot="label" class="item-detail-pane">可選規格與銷售數量</span>
              <el-form-item
                v-for="(item, index) in postForm.spec"
                :label="'規格' + (index + 1)"
                :key="index"
                style="margin-left: 1rem;"
                :prop="'item.' + index"
              >
                <el-input v-model="item.name" placeholder="請輸入選項名稱" style="width: 15rem;margin-bottom: 1rem;"></el-input>
                <el-input v-model.number="item.count" placeholder="數量" style="width: 8rem;"></el-input>
                <el-button type="danger" icon="el-icon-delete" @click.prevent="removeSpec(index)"></el-button>
              </el-form-item>
              <el-button @click="addSpec">新增規格</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;">
          <h4 class="form-subtitle">商品描述</h4>
          <div class="editor-container">
            <tinymce :height=400 ref="editor" v-model="postForm.info.content"></tinymce>
          </div>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;">
          <h4>商品規格及須知</h4>
          <el-tabs tab-position="left">
            <el-tab-pane label="規格">
              <span slot="label" class="item-detail-pane">商品規格</span>
              <el-form-item
                v-for="(item, index) in postForm.spec"
                :label="'規格' + (index + 1)"
                :key="index"
                style="margin-left: 1rem;"
                :prop="'item.' + index"
              >
                <el-input v-model="item.name" placeholder="請輸入選項名稱" style="width: 15rem;margin-bottom: 1rem;"></el-input>
                <el-input v-model.number="item.count" placeholder="數量" style="width: 8rem;"></el-input>
                <el-button type="danger" icon="el-icon-delete" @click.prevent="removeSpec(index)"></el-button>
              </el-form-item>
              <el-button @click="addSpec">新增規格</el-button>
            </el-tab-pane>
            
            <el-tab-pane label="購買須知">
              <span slot="label" class="item-detail-pane">購買須知</span>
              <div>購買須知</div>
              <el-form-item>
                <div class="editor-container">
                  <tinymce :height=400 ref="editor" v-model="postForm.info.content"></tinymce>
                </div>
              </el-form-item>
            </el-tab-pane>
            
            <el-tab-pane label="注意事項">
              <span slot="label" class="item-detail-pane">注意事項</span>
              <div>注意事項</div>
              <el-form-item>
                <div class="editor-container">
                  <tinymce :height=400 ref="editor" v-model="postForm.info.content"></tinymce>
                </div>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>        

      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage2'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky'
import { fetchPost, createPost } from '@/api/post'
import { querySearch } from '@/api/search'

const defaultForm = {
  type: undefined,
  catalog: undefined,
  subCatalog: undefined,
  comboList: [],
  tag: [],
  img: [],
  name: undefined,
  info: {
    type: '',
    content: ''
  },
  count: undefined,
  available: false,
  price: {
    orig: undefined,
    onsale: undefined
  },
  spec: [],
  related: [],
  seller: []
}

export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Upload, Sticky },
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
      itemContent: '',
      categoryClass: [],
      rules: {},
      options: [
        {
          value: 0,
          label: '服務體驗'
        },
        {
          value: 1,
          label: '居家空間',
          children: [
            { value: 0, label: '家具' },
            { value: 1, label: '家飾' },
            { value: 2, label: '家電' }
          ]
        },
        {
          value: 2,
          label: '生活品味',
          children: [
            { value: 0, label: '個人用品' },
            { value: 1, label: '旅行周邊' },
            { value: 2, label: '時尚配飾' }
          ]
        },
        {
          value: 3,
          label: '味蕾饗宴',
          children: [
            { value: 0, label: '美食' },
            { value: 1, label: '廚具' },
            { value: 2, label: '餐皿' },
            { value: 3, label: '茶具酒品' }
          ]
        }
      ]
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData()
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    async fetchData() {
      try {
        this.postForm = await fetchPost(this.$route.params.id)
      } catch (err) {
        this.fetchSuccess = false
        console.log(err)
      }
    },
    async submitForm() {
      try {
        // await createPost(this.postForm)
        this.$notify({ title: '成功', message: '發布成功', type: 'success', duration: 2000 })
      } catch (err) {
        console.log(err)
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
      cb(items)
    },
    async handleSelectStock(item) {
      const i = this.relatedItems.map(x => x.key).indexOf(item.value)
      this.relatedItems[i].data = item.data
    },
    handleSelectCategort(category) {
      console.log('category: ', category[0], ', subCategory', category[1])
    },
    removeSpec(index) {
      this.postForm.spec.splice(index, 1)
    },
    addSpec() {
      this.postForm.spec.push({ key: '' })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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

  .tooltip-btn{
    cursor: pointer;
    border: 1px solid #ccc;
    color: #ccc;
    border-radius: 50%;
    padding: 1px 5px;
  }

  .createStock-container {
    position: relative;
    .createStock-main-container {
      padding: 40px 45px 20px 50px;
    }
  }
</style>

