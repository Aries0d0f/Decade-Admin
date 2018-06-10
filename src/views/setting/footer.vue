<template>
  <div v-loading="loading">
    <div class="toolbar">
      <el-button type="success" @click="handleUpdate">保存</el-button>
    </div>
    <el-tabs type="border-card" v-if="!loading">
      <el-tab-pane v-for="(item, i) in postData" :key="i" :label="item.label">
        <tinymce :height=500 ref="editor" v-model="item.data"></tinymce>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import request from '@/utils/request'
  import Tinymce from '@/components/Tinymce'
  
  export default {
    data() {
      return {
        loading: true,
        adData: {},
        postData: []
      }
    },
    created() {
      this.getAdData()
    },
    methods: {
      async getAdData() {
        const res = await request.get('/ad')
        this.adData = res.data.data.data
        // FAKE
        this.adData.push(...[
          { name: 'footer-about', data: { name: 'about', label: '關於我們', data: '' }},
          { name: 'footer-privacy', data: { name: 'privacy', label: '隱私政策', data: '' }},
          { name: 'footer-servicepolicy', data: { name: 'servicepolicy', label: '會員條款', data: '' }},
          { name: 'footer-job', data: { name: 'job', label: '工作機會', data: '' }},
          { name: 'footer-business', data: { name: 'business', label: '進駐商城', data: '' }},
          { name: 'footer-kol_recruitment', data: { name: 'kol_recruitment', label: '創作平台', data: '' }},
          { name: 'footer-press', data: { name: 'press', label: '廣告媒體', data: '' }},
          { name: 'footer-groups', data: { name: 'groups', label: '公益基金', data: '' }},
          { name: 'footer-service', data: { name: 'service', label: '售後服務', data: '' }},
          { name: 'footer-contact', data: { name: 'contact', label: '意見申訴', data: '' }}
        ])
        this.postData.push(...[
          this.adData.find(x => x.name === 'footer-about').data,
          this.adData.find(x => x.name === 'footer-privacy').data,
          this.adData.find(x => x.name === 'footer-servicepolicy').data,
          this.adData.find(x => x.name === 'footer-job').data,
          this.adData.find(x => x.name === 'footer-business').data,
          this.adData.find(x => x.name === 'footer-kol_recruitment').data,
          this.adData.find(x => x.name === 'footer-press').data,
          this.adData.find(x => x.name === 'footer-groups').data,
          this.adData.find(x => x.name === 'footer-service').data,
          this.adData.find(x => x.name === 'footer-contact').data
        ])
        this.loading = false
      },
      async handleUpdate() {
        try {
          this.loading = true
          console.log(this.adData)
          // await request.post('/ad', { config: data })
          this.loading = false
        } catch (err) {
          console.log(err)
        }
      }
    },
    components: {
      Tinymce
    }
  }
</script>

<style lang="scss" scoped>
  .toolbar{
    margin: 1rem;
  }
</style>
