<template>
  <div>
    <el-upload
      :action="`${uploadUrl}/upload`"
      name="image"
			class="avatar-uploader"
			v-loading="imgUploading"
			:show-file-list="false"
      :before-upload="beforeUploadImg"
      :on-success="handleImageScucess"
      :on-error="handleImageError"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
			<img v-if="localUrl" :src="localUrl" class="avatar">
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['defaultImg'],
  data() {
    return {
      uploadUrl: 'https://decade.global/img',
      imgUrl: '',
      localUrl: '',
      imgUploading: false,
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created() {
    this.imgUrl = this.defaultImg || undefined
    this.localUrl = this.defaultImg || undefined
  },
  methods: {
    handleRemove() {
      this.imgUrl = undefined
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImageScucess(res, file, fileList) {
      if (res.success === false) {
        this.$message.error(`錯誤：${res.msg}`)
        this.imgUrl = undefined
        this.imgUploading = false
      } else {
        setTimeout(() => {
          this.localUrl = file.url
          this.imgUrl = res.data.url
          this.$emit('input', res.data.url)
          this.imgUploading = false
        }, 5000)
      }
    },
    handleImageError() {
      this.$message.error('錯誤：圖片上傳失敗，請重試！')
      this.imgUploading = false
    },
    beforeUploadImg(file) {
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
      this.imgUploading = true
      return true
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
		object-fit: cover;
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
