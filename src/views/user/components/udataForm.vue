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
            <el-form-item style="margin-bottom: 40px;" label-width="80px" label="相關帳號" v-if="userInfo.role === 0 || userInfo.role === 3">
              <el-select v-model="postForm.relatedSeller" style="width: 100%" @change="remoteUser" v-loading="loadingUser" loading-text="檢查會員中..." :loading="loadingUser" multiple filterable :allow-create="!loadingUser" default-first-option placeholder="請輸入廠商編號" no-data-text="請輸入廠商編號" no-match-text="查無廠商">
                <el-option v-for="item in postForm.relatedSeller" :key="item.value" :label="item.value" :value="item.value"></el-option>
              </el-select>
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
import { fetchUser } from '@/api/user'

const defaultForm = {
  name: undefined,
  photo: undefined,
  intro: undefined,
  relatedSeller: undefined
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
      loadingUser: false,
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
    },
    async remoteUser(list) {
      this.loadingUser = true
      const uid = list[list.length - 1]
      if (!uid || list.length === 0) {
        this.loadingUser = false
        return
      }
      try {
        await fetchUser(uid)
      } catch (error) {
        this.postForm.relatedSeller.splice(-1, 1)
        this.$message.error('錯誤：查無該會員！')
      }
      this.loadingUser = false
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

