<template>
  <el-dialog
    class="support-dialog"
    v-loading="loading"
    :visible.sync="isOpen"
    width="80%"
    :before-close="handleClose">
    <el-form ref="form" :model="formData" label-width="80px">
      <el-row :gutter="20" style="margin-bottom:1rem">
        <el-col :span="24" style="display: flex;align-items: center;margin-bottom:1rem">
          <el-tag>{{formData.type | SupportTypeLabel}}</el-tag>
          <div style="margin-left:.5rem;font-size: 1rem;">{{formData.subject}}</div>
        </el-col>
        <el-col :span="8" class="form-col">
          <el-form-item label="姓名">{{formData.name}}</el-form-item>
          <el-form-item label="信箱">{{formData.mail}}</el-form-item>
          <el-form-item label="電話">{{formData.phone}}</el-form-item>
        </el-col>
        <el-col :span="8" class="form-col">
          <el-form-item label="額外訊息">{{formData.company}}</el-form-item>
        </el-col>
        <el-col :span="8" class="form-col">
          <el-form-item label="備註">{{formData.comment}}</el-form-item>
        </el-col>
      </el-row>

      <div class="reply-block">
        <h6 style="margin: 0 0 .5rem 0;">問題內容</h6>
        <div>{{formData.content}}</div>
        <span class="reply-block-date">{{new Date(formData.createdAt).toLocaleString()}}</span>
      </div>

      <div v-for="(reply, i) in formData.reply" :key="i" class="reply-block">
        <h6 style="margin: 0 0 .5rem 0;">回覆內容</h6>
        <div>{{reply.msg}}</div>
        <span class="reply-block-date">{{new Date(reply.timestamp).toLocaleString()}}</span>
      </div>

      <el-input
        v-if="formData.reply.length === 0"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6 }"
        style="margin-top:1rem"
        v-model="formData.msg">
      </el-input>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="putSupport">確定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ReplySupport } from '@/api/support'
import { mapGetters } from 'vuex'

export default {
  props: ['dialogVisible', 'formData'],
  data() {
    return {
      loading: false,
      isOpen: this.dialogVisible
    }
  },
  watch: {
    dialogVisible(val) {
      this.isOpen = val
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async putSupport() {
      if (!this.formData.msg || this.formData.msg === '' || this.formData.msg.length === 0) {
        this.handleClose()
        return
      }
      this.loading = true
      try {
        await ReplySupport(this.formData.id, this.userInfo.id, this.formData.msg)
        this.formData.msg = ''
      } catch (err) {
        this.$message.error('錯誤: 回覆失敗')
      }
      this.loading = false
    },
    handleClose() {
      this.isOpen = false
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style lang="scss">
  .support-dialog{
    .el-dialog__body{
      padding: 0 20px;
    }
  }
</style>


<style lang="scss" scoped>
.reply-block{
  background: #f3f3f3;
  padding: .8rem 1.5rem;
  margin-bottom: .5rem;

  .reply-block-date{
    font-size: .5rem;
    color: #8e8e8e;
    float: right;
  }
}
.form-col{
  div{
    margin-bottom: .5rem;
    font-size: 1rem;
  }
}
</style>
