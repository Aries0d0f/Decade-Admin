<template>
  <div class="upload-container">
    <el-button icon='upload' :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上傳圖片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload 
        class="editor-slide-upload" 
        :action="`${uploadUrl}/upload`" 
        name="image" 
        :multiple="false" 
        :file-list="fileList" 
        :show-file-list="true"
        list-type="picture-card" 
        :on-remove="handleRemove" 
        :on-success="handleSuccess" 
         v-loading="loading"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary">點擊上傳</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false" :disabled="loading">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="loading">確 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#20a0ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      uploadUrl: 'https://decade.global/img',
      listObj: {},
      fileList: [],
      loading: false,
      imgUploading: false
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      console.log(arr)
      if (!this.checkAllSuccess()) {
        this.$message('請等待所有圖片上傳成功！')
        return
      }
      this.loading = true
      setTimeout(() => {
        this.$emit('successCBK', arr)
        this.listObj = {}
        this.fileList = []
        this.dialogVisible = false
        this.loading = false
      }, 5000)
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data.url
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        this.$message.error('錯誤：請檢查檔案格式是否為 jpeg 或 png！')
        return false
      } else if (file.size / 1024 / 1024 > 10) {
        this.$message.error('錯誤：圖片大小限制為 10MB！')
        return false
      } else if (this.imgUploading) {
        this.$message.error('錯誤：請等待其他圖片上傳完成！')
        return false
      }
      this.listObj[file.uid] = { hasSuccess: false, uid: file.uid }
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .upload-container {
    .editor-slide-upload {
      margin-bottom: 20px;
    }
  }
</style>
