<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" v-loading="loading">
      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <span class="post-status">狀態: {{postForm.status | PostStatusLabel}}</span>
          <el-button v-loading="loading" style="margin-left: 10px;" v-if="userInfo.role === 0" type="success" @click="submitForm(1)">
            審核完成
          </el-button>
          <el-button v-loading="loading" style="margin-left: 10px;" v-else type="success" @click="submitForm(2)">
            送出審核
          </el-button>
          <el-button v-loading="loading" v-if="isEdit" @click="viewDraft" type="warning">預覽草稿</el-button>
          <template v-if="this.isEdit">
            <el-button v-loading="loading" @click="toDraft" type="info">草稿</el-button>
            <el-button v-loading="loading" @click="toRecycle" v-if="postForm.status !== 999" type="danger">回收桶</el-button>
            <el-button v-loading="loading" @click="toDelete" v-else type="danger">刪除</el-button>
            <el-button v-loading="loading" @click="toRecovery" v-if="postForm.status === 999" type="info">復原</el-button>
          </template>
        </template>

        <template v-else>
          <el-tag>獲取失敗，請重新整理頁面</el-tag>
        </template>
      </sticky>
      <div class="createPost-main-container" v-if="!loading">
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput name="name" v-model="postForm.title" required :maxlength="100">
            標題
          </MDinput>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <div style="margin-bottom: 20px;">
              <el-form-item prop="image">
                <Upload style="height: 100%;" v-model="postForm.meta.image" :defaultImg="postForm.meta.image"></Upload>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="18">
            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="分類" prop="category">
              <el-cascader :options="options" :props="props" v-model="categoryTypes" placeholder="請選擇分類" @change="handleSelectCategory"></el-cascader>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="關鍵字" prop="keyword">
              <el-select v-model="postForm.tag" style="width: 100%" multiple filterable :allow-create="postForm.tag && postForm.tag.length < 5" default-first-option placeholder="請輸入關鍵字" no-data-text="請輸入關鍵字" no-match-text="已達 5 組關鍵字">
                <el-option v-for="item in postForm.tag" :key="item.value" :label="item.value" :value="item.value"></el-option>
              </el-select>
              <span>(已輸入 {{postForm.tag.length || 0}} 組，還可以增加 {{ 5 - (postForm.tag.length || 0)}} 組)</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="content">
          <div class="editor-container">
            <tinymce :height=400 ref="editor" v-model="postForm.content"></tinymce>
          </div>
        </el-form-item>

        <hr>

        <el-row :gutter="20" v-if="userInfo.role === 0">
          <el-col :span="12">
            <RelatedStock ref="RelatedStock" :idList="postForm.related"></RelatedStock>
          </el-col>
          <el-col :span="12">
            <RelatedPost ref="RelatedPost" :idList="postForm.related2"></RelatedPost>
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
import RelatedStock from '@/components/RelatedCard/stock'
import RelatedPost from '@/components/RelatedCard/post'
import { fetchPost, createPost, updatePost, deletePost } from '@/api/post'
import { mapGetters } from 'vuex'

const defaultForm = {
  loading: true,
  title: '',
  content: '',
  category: undefined,
  subCategory: undefined,
  author: undefined,
  region: undefined,
  related: [],
  related2: [],
  status: 0,
  tag: [],
  meta: {
    image: '',
    link: undefined
  }
}

export default {
  name: 'PostDetail',
  components: { Tinymce, MDinput, Upload, Sticky, RelatedStock, RelatedPost },
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
      categoryTypes: [],
      relatedItems: [],
      rules: {},
      options: [],
      props: {
        value: 'type',
        children: 'children',
        label: 'title'
      }
    }
  },
  async created() {
    this.options = this.PostClass
    this.loading = true
    if (this.isEdit) {
      await this.fetchData()
      this.categoryTypes = [this.postForm.category, this.postForm.subCategory]
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.loading = false
  },
  computed: {
    ...mapGetters(['userInfo', 'PostClass'])
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        this.postForm = await fetchPost(this.$route.params.id)
      } catch (err) {
        this.fetchSuccess = false
        console.log(err)
      }
      this.loading = false
    },
    async submitForm(status) {
      this.postForm.region = 0
      this.postForm.status = status
      if (this.userInfo.role === 0) {
        this.postForm.related = this.$refs.RelatedStock.relatedItems.map(x => x.key)
        this.postForm.related2 = this.$refs.RelatedPost.relatedItems.map(x => x.key)
      }
      this.loading = true
      try {
        if (this.isEdit) {
          const data = {}
          Object.keys(defaultForm).map(x => {
            data[x] = this.postForm[x]
            return true
          })
          await updatePost(this.postForm.id, data)
        } else {
          this.postForm.author = this.userInfo.id
          await createPost(this.postForm)
        }
        this.$router.push({ name: 'postList' })
        this.$notify({ title: '成功', message: '發布成功', type: 'success', duration: 2000 })
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    viewDraft() {
      window.open(`https://decade.global/magazine/post/${this.$route.params.id}`, '_blank')
    },
    async toDraft() {
      this.loading = true
      this.postForm.status = 0
      await updatePost(this.postForm.id, { status: 0 })
      this.loading = false
    },
    async toRecycle() {
      this.loading = true
      this.postForm.status = 999
      await updatePost(this.postForm.id, { status: 999 })
      this.loading = false
    },
    async toRecovery() {
      this.loading = true
      this.postForm.status = 2
      await updatePost(this.postForm.id, { status: 2 })
      this.loading = false
    },
    async toDelete() {
      const check = await this.$confirm('是否確定要刪除該筆資料?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (check) {
        this.loading = true
        await deletePost(this.postForm.id)
        this.$notify({ title: '成功', message: '刪除成功', type: 'success', duration: 2000 })
        this.$router.push({ name: 'postList' })
        this.loading = false
      }
    },
    handleSelectCategory(type) {
      this.postForm.category = type[0]
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
    margin-bottom: 20vh;
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
  .post-status{
    position: absolute;
    left: 3rem;
    color: #fff;
  }
</style>

