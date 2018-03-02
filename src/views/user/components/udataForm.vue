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
        <div style="margin-bottom: 20px;margin-right: 3vw;">
          <el-form-item prop="image">
            <Upload style="height: 100%;" v-model="postForm.photo" :defaultImg="postForm.photo"></Upload>
          </el-form-item>
        </div>
        <div class="edit-form">
          <el-form-item style="margin-bottom: 20px;" prop="name">
            <MDinput name="name" v-model="postForm.name" required :maxlength="20">姓名</MDinput>
          </el-form-item>
          <el-form-item v-if="userInfo.role === 0 || userInfo.role === 4" style="margin-bottom: 40px;" prop="intro" label="介紹">
            <el-input type="textarea" v-model="postForm.intro" :autosize="{ minRows: 4 }"></el-input>
          </el-form-item>

          <h4>關聯帳號管理</h4>
          <el-table :data="postForm.relatedSeller" :header-row-style="{ background: '#efefef' }" empty-text="尚未新增關聯帳號" style="width: 100%">
            <el-table-column prop="name" label="名稱"></el-table-column>
            <el-table-column prop="mail" label="聯絡信箱"></el-table-column>

            <el-table-column label="" class-name="small-padding fixed-width" width="100">
              <template slot-scope="scope">
                <el-button size="mini" @click="removeVendor(scope.row.key)">刪除</el-button>
              </template>
            </el-table-column>                
          </el-table>

          <div class="new-vendor">
            <el-input class="vendor-input" v-model="newVendor.name" placeholder="請輸入部門/分店名稱"></el-input>
            <el-input class="vendor-input" v-model="newVendor.mail" placeholder="請輸入 mail"></el-input>
            <el-button @click="addVendor" size="mini">新增</el-button>
          </div>
        </div>
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
      rules: {},
      newVendor: {
        name: '',
        mail: '',
        key: new Date().getTime()
      }
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
        // 舊格式兼容
        if (this.postForm.relatedSeller[0] && !this.postForm.relatedSeller[0].name) {
          this.postForm.relatedSeller = []
        }
        this.postForm.relatedSeller.map(x => {
          x = { ...x, key: new Date().getTime() }
        })
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
        this.postForm.relatedSeller.map(x => {
          delete x.key
        })
        await patchUData(this.cid, data)
        this.$notify({ title: '成功', message: '更新完成', type: 'success', duration: 2000 })
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    removeVendor(key) {
      const index = this.postForm.relatedSeller.findIndex(x => x.key === key)
      if (index !== -1) {
        this.postForm.relatedSeller.splice(index, 1)
      }
    },
    addVendor() {
      const re = /\S+@\S+\.\S+/
      if (this.newVendor.name === '') {
        this.$message.error('錯誤：請輸入姓名')
        return
      } else if (!re.test(this.newVendor.mail)) {
        this.$message.error('錯誤：請輸入有效信箱')
        return
      }
      this.postForm.relatedSeller.push(this.newVendor)
      this.newVendor = { name: '', mail: '', key: new Date().getTime() }
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
    .new-vendor{
      display: flex;
      margin: 1rem 0;
      .vendor-input{
        margin-right: 1rem;
      }
    }
    .createPost-main-container {
      display: flex;
      width: 100%;
      max-width: 900px;
      padding: 40px 45px 20px 50px;

      .edit-form{
        width: 100%;
      }
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

