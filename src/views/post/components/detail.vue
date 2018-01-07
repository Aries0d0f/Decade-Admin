<template>
  <div class="createPost-container">
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
      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput name="name" v-model="postForm.title" required :maxlength="100">
            標題
          </MDinput>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <div style="margin-bottom: 20px;">
              <Upload style="height: 100%;" v-model="postForm.meta.image"></Upload>
            </div>
          </el-col>
          <el-col :span="18">
            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="分類">
              <el-cascader :options="options" v-model="postForm.categoryT"></el-cascader>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="關鍵字">
              <el-select v-model="postForm.tag" style="width: 100%" multiple filterable :allow-create="postForm.tag.length < 5" default-first-option placeholder="請輸入關鍵字" no-data-text="請輸入關鍵字" no-match-text="已達 5 組關鍵字">
                <el-option v-for="item in postForm.tag" :key="item.value" :label="item.value" :value="item.value"></el-option>
              </el-select>
              <span>(已輸入 {{postForm.tag.length}} 組，還可以增加 {{ 5 - postForm.tag.length}} 組)</span>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="editor-container">
          <tinymce :height=400 ref="editor" v-model="postForm.content"></tinymce>
        </div>

        <hr>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>推薦商品串聯</span>
              </div>
              <el-form-item
                v-for="(i, index) in relatedItems"
                :label="'商品 ' + (index + 1)"
                :key="index"
                :prop="'item.' + index"
              >
                <el-autocomplete v-model="i.key" style="width:15rem" :fetch-suggestions="queryStock" @select="handleSelectStock" placeholder="請輸入商品名稱">
                  <template slot-scope="props">
                    <span>{{ props.item.name }}</span>
                    <br>
                    <span>$ {{ props.item.price }}</span>
                  </template>
                </el-autocomplete>
                <el-button type="danger" icon="el-icon-delete" @click.prevent="removeDomain(i)"></el-button>
                <div v-if="i.data">{{i.data.name}} - ${{i.data.price}}</div>
              </el-form-item>

              <el-form-item>
                <el-button @click="addDomain">新增商品</el-button>
                <span>(已輸入 {{relatedItems.length}} 組，還可以增加 {{ 6 - relatedItems.length}} 組)</span>
              </el-form-item>
            </el-card>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
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
  title: '',
  content: '',
  id: undefined,
  category: undefined,
  author: undefined,
  region: undefined,
  related: [],
  tag: [],
  meta: {
    image: '',
    link: undefined
  }
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
      relatedItems: [
        { key: '' },
        { key: '' },
        { key: '' },
        { key: '' }
      ],
      rules: {},
      options: [
        {
          value: 'classic',
          label: '經典',
          children: [
            { value: '3', label: '音樂' },
            { value: '46', label: '藝術' }
          ]
        },
        {
          value: 'beauty',
          label: '色蘊',
          children: [
            { value: '444', label: '美妝' },
            { value: '416', label: '美肌' },
            { value: '43', label: '美體' }
          ]
        },
        {
          value: 'lifestyle',
          label: '生活',
          children: [
            { value: '444', label: '旅行' },
            { value: '416', label: '居家' },
            { value: '43', label: '味蕾' },
            { value: '43', label: '纖體' }
          ]
        },
        {
          value: 'fashion',
          label: '時尚',
          children: [
            { value: '444', label: '設計師' },
            { value: '416', label: '品牌' }
          ]
        },
        {
          value: 'feature',
          label: '主題'
        },
        {
          value: 'talk',
          label: '人物'
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
      this.postForm.author = '59f34d33b806294fe794041a'
      this.postForm.category = 0
      this.postForm.region = 0
      delete this.postForm.categoryT
      this.postForm.related = this.relatedItems.map(x => x.key)
      this.loading = true
      try {
        await createPost(this.postForm)
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
    removeDomain(item) {
      var index = this.relatedItems.indexOf(item)
      if (index !== -1) {
        this.relatedItems.splice(index, 1)
      }
    },
    addDomain() {
      if (this.relatedItems.length > 5) {
        return
      }
      this.relatedItems.push({ key: '' })
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

