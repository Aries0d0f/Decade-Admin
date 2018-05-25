<template>
  <div>
    <el-upload
      :action="`${uploadUrl}/upload`"
      list-type="picture-card"
      name="image"
      :on-success="handleImageScucess"
      :file-list="localImgList"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeUploadImg"
      :on-remove="handleRemove"
      :on-error="handleImageError">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
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
      dialogVisible: false,
      dialogImageUrl: '',
      imgList: [],
      localImgList: []
    }
  },
  created() {
    if (this.defaultImg && this.defaultImg.length > 0) {
      this.localImgList = this.defaultImg.filter(img => {
        return img.length > 0
      }).map(img => {
        return {
          name: new Date().getTime(),
          status: 'success',
          uid: new Date().getTime(),
          url: img,
          remoteUrl: img
        }
      })
      this.imgList = this.localImgList.map(x => x.remoteUrl)
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this.localImgList = fileList
      const delIndex = this.imgList.findIndex(x => x === file.remoteUrl)
      if (delIndex !== -1) {
        this.imgList.splice(delIndex, 1)
      }
      this.$emit('input', this.imgList)
    },
    handleImageError() {
      this.$message.error('錯誤：圖片上傳失敗，請重試！')
      this.imgUploading = false
    },
    handleImageScucess(res, file) {
      this.imgUploading = false
      this.localImgList.push({ name: this.localImgList.length, url: file.url, remoteUrl: res.data.url })
      this.imgList.push(res.data.url)
      this.$emit('input', this.imgList)
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
