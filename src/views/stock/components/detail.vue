<template>
  <div class="createStock-container">
    <el-form class="form-container" :model="postForm">
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

        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="分類">
          <el-cascader :options="options" placeholder="請選擇分類" v-model="categoryClass" @change="handleSelectCategort"></el-cascader>
        </el-form-item>

        <!-- <el-form-item style="margin-bottom: 40px;" label-width="60px" label="關鍵字">
          <el-select v-model="postForm.tag" style="width: 40%" multiple filterable :allow-create="postForm.tag.length < 5" default-first-option placeholder="請輸入關鍵字" no-data-text="請輸入關鍵字" no-match-text="已達 5 組關鍵字">
            <el-option v-for="item in postForm.tag" :key="item.value" :label="item.value" :value="item.value"></el-option>
          </el-select>
          <div>(已輸入 {{postForm.tag.length}} 組，還可以增加 {{ 5 - postForm.tag.length}} 組)</div>
        </el-form-item> -->
        <el-form-item style="margin-bottom: 40px;" label-width="60px" label="照片">
          <el-upload
            :action="`${uploadUrl}/upload`"
            list-type="picture-card"
            :on-success="handleImageScucess"
            :file-list="imgList"
            v-model="postForm.img"
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
              <el-form-item style="width:15rem;margin-bottom:1rem" label-width="60px" label="售價">
                <el-input type="number" v-model.number="postForm.price.common" placeholder="">
                  <span slot="prefix" style="margin: 0 .5rem;"> $</span>
                </el-input>
              </el-form-item>
              <el-form-item style="width:15rem" label-width="60px" label="數量">
                <el-input v-model="postForm.count" placeholder=""></el-input>
              </el-form-item>    
              <el-form-item label-width="60px">
                <el-checkbox v-model="isTicket">服務體驗類若無預設金額請勾選</el-checkbox>
                <el-tooltip class="item" effect="dark" placement="bottom">
                  <div slot="content">服務體驗選項，將於售價顯示"獨家體驗服務無需預繳任何費用，<br>視體驗活動現場與商家線上核銷確認購買該組合套餐。"</div>
                  <span class="tooltip-btn">?</span>
                </el-tooltip>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品簡短說明">
              <span slot="label" class="item-detail-pane">商品簡短說明</span>
              <div>商品簡介</div>
              <el-form-item style="width:100%">
                <el-input type="textarea" v-model="postForm.info.summary" :autosize="{ minRows: 4 }"></el-input>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="可選規格與銷售數量">
              <span slot="label" class="item-detail-pane">可選規格與銷售數量</span>
              <el-form-item
                v-for="(item, index) in postForm.spec"
                :label="'規格' + (index + 1)"
                v-model="postForm.spec"
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
            <el-tab-pane label="票券說明" v-if="categoryClass[0] === 0 || isTicket">
              <span slot="label" class="item-detail-pane">票券說明</span>
              <el-form-item style="width:15rem;margin-bottom:1rem" label-width="60px" label="分店">
                <el-input v-model="postForm.info.teacher" placeholder=""></el-input>
              </el-form-item>
              <el-form-item style="width:15rem" label-width="60px" label="日期">
                <el-date-picker v-model="postForm.info.time" type="datetime" placeholder=""></el-date-picker>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;">
          <h4 class="form-subtitle">商品描述</h4>
          <div class="editor-container">
            <tinymce :height=400 ref="editor" v-model="postForm.info.discription"></tinymce>
          </div>
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;">
          <h4>商品規格及須知</h4>
          <el-tabs tab-position="left">
            <el-tab-pane label="規格">
              <span slot="label" class="item-detail-pane">商品規格</span>
              <el-form-item
                v-for="(item, index) in postForm.info.specInfo"
                v-model="postForm.info.specInfo"
                :label="'規格' + (index + 1)"
                :key="index"
                style="margin-left: 1rem;"
                :prop="'item.' + index"
              >
                <el-input v-model="item.name" placeholder="請輸入選項名稱" style="width: 15rem;margin-bottom: 1rem;"></el-input>
                <el-input v-model.number="item.detail" placeholder="說明" style="width: 8rem;"></el-input>
                <el-button type="danger" icon="el-icon-delete" @click.prevent="removeSpecInfo(index)"></el-button>
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

      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage2'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky'
import { fetchStock, createStock, updateStock } from '@/api/stock'
import { querySearch } from '@/api/search'

const defaultForm = {
  type: undefined,
  catalog: undefined,
  // subCatalog: undefined,
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
  count: undefined,
  available: false,
  status: 0,
  // price: undefined,
  price: {
    common: undefined
    // onsale: undefined
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
      isDraft: true,
      fetchSuccess: true,
      loading: false,
      dialogImageUrl: '',
      isTicket: false,
      dialogVisible: false,
      uploadUrl: 'https://decade.global/admin',
      // uploadUrl: 'http://localhost:3002',
      itemContent: '',
      imgList: [],
      categoryClass: [],
      specInfo: [],
      rules: {},
      options: [
        {
          value: 0,
          name: 'theme',
          label: '服務體驗',
          children: [
            { label: '課程活動', name: 'lecture', value: 0 },
            { label: '精選商店', name: 'special_shop', value: 1 },
            { label: '旅遊', name: 'traveling', value: 2 }
          ]
        },
        {
          value: 1,
          name: 'life',
          label: '居家空間',
          children: [
            { label: '家飾', name: 'furnishings', value: 0 },
            { label: '家具', name: 'furniture', value: 1 },
            { label: '家電', name: 'appliances', value: 2 }
          ]
        },
        {
          value: 2,
          name: 'brands',
          label: '生活質感',
          children: [
            { label: '3C周邊', name: 'eletronics', value: 0 },
            { label: '個人用品', name: 'personal', value: 1 },
            { label: '肌膚保養', name: 'skin_care', value: 2 },
            { label: '時尚配飾', name: 'fashion', value: 3 }
          ]
        },
        {
          value: 3,
          name: 'food',
          label: '美食品味',
          children: [
            { label: '美食', name: 'ingredinents', value: 0 },
            { label: '餐具', name: 'tableware', value: 1 },
            { label: '廚具', name: 'kitchenware', value: 2 },
            { label: '茶具酒器', name: 'tea_set', value: 3 }
          ]
        }
      ]
    }
  },
  async created() {
    if (this.isEdit) {
      await this.fetchData()
      this.categoryClass = [parseInt(this.postForm.info.type, 10), this.postForm.catalog]
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async fetchData() {
      try {
        const stock = await fetchStock(this.$route.params.id)
        this.postForm = stock
        this.postForm.info = JSON.parse(stock.info)
        this.isDraft = this.postForm.status === 1 ? false : true
        this.isTicket = this.postForm.info.type === 0 ? true : this.postForm.type === 3 ? true : false
        this.postForm.img.map((img, i) => {
          this.imgList.push({ name: i, url: img })
        })
      } catch (err) {
        this.fetchSuccess = false
        console.log(err)
      }
    },
    async submitForm() {
      this.postForm.seller = [this.userInfo.id]
      this.postForm.catalog = this.categoryClass[1] !== -1 ? this.categoryClass[1] : -1
      this.postForm.status = this.isDraft ? 0 : 1
      this.postForm.info.type = this.categoryClass[0]
      this.postForm.info = JSON.stringify(this.postForm.info)
      this.postForm.type = this.categoryClass[0] === 0 ? 3 : this.isTicket ? 3 : 1
      this.postForm.img = []
      this.imgList.map(x => this.postForm.img.push(x.url))
      try {
        if (this.isEdit) {
          await updateStock(this.$route.params.id, this.postForm)
        } else {
          await createStock(this.postForm)
        }
        this.$notify({ title: '成功', message: '發布成功', type: 'success', duration: 2000 })
        this.$router.push({ name: 'StockList' })
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
    viewDraft() {
      window.open(`https://decade.global/shop/stock/${this.$route.params.id}`, '_blank')
    },
    async handleSelectStock(item) {
      const i = this.relatedItems.map(x => x.key).indexOf(item.value)
      this.relatedItems[i].data = item.data
    },
    handleSelectCategort(category) {
      this.postForm.info.type = category[0]
      this.postForm.catalog = category[1]
    },
    addSpec() {
      this.postForm.spec.push({ name: undefined, count: undefined })
    },
    removeSpec(index) {
      this.postForm.spec.splice(index, 1)
    },
    addSpecInfo() {
      this.postForm.info.specInfo.push({ name: undefined, detail: undefined })
    },
    removeSpecInfo(index) {
      this.postForm.info.specInfo.splice(index, 1)
    },
    handleRemove(file, fileList) {
      this.imgList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImageScucess(res) {
      this.imgList.push({ name: this.imgList.length, url: `${this.uploadUrl}${res.path}` })
      this.postForm.img.push(`${this.uploadUrl}${res.path}`)
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

