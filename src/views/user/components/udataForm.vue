<template>
  <div class="createPost-container" v-loading="loading">
    <el-form class="form-container" :model="postForm" v-if="!loading">
      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">更新</el-button>
        </template>
        <template v-else>
          <el-tag>獲取失敗，請重新整理頁面</el-tag>
        </template>
      </sticky>
      <div class="createPost-main-container" v-loading="loading">
        <el-row :gutter="10">
          <el-col :span="6">
            <div style="margin-bottom: 20px;">
              <el-form-item prop="image">
                <Upload style="height: 100%;" v-model="postForm.photo" :defaultImg="postForm.photo"></Upload>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="18">
            <el-form-item style="margin-bottom: 20px;" prop="name">
              <MDinput name="name" v-model="postForm.name" required :maxlength="20">姓名</MDinput>
            </el-form-item>
            <el-form-item v-if="userInfo.role === 0 || userInfo.role === 4" style="margin-bottom: 40px;" prop="intro" label="介紹">
              <el-input type="textarea" v-model="postForm.intro" :autosize="{ minRows: 4 }"></el-input>
            </el-form-item>
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
import { fetchUData, patchUData } from '@/api/udata'
import { mapGetters } from 'vuex'

const defaultForm = {
  name: undefined,
  photo: undefined,
  intro: undefined
}

export default {
  name: 'UDataForm',
  components: { Tinymce, MDinput, Upload, Sticky },
  props: {
    cid: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      rules: {}
    }
  },
  async created() {
    if (this.cid) {
      await this.fetchData(this.cid)
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async fetchData(cid) {
      this.loading = true
      try {
        this.postForm = await fetchUData(cid)
      } catch (err) {
        this.fetchSuccess = false
        console.log(err)
      }
      this.loading = false
    },
    async submitForm() {
      this.loading = true
      try {
        const data = {}
        Object.keys(defaultForm).forEach(x => {
          data[x] = this.postForm[x]
        })
        await patchUData(this.cid, data)
        this.$notify({ title: '成功', message: '更新完成', type: 'success', duration: 2000 })
        // this.$router.push({ name: 'postList' })
      } catch (err) {
        console.log(err)
      }
      this.loading = false
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

