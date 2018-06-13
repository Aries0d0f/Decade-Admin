<template>
  <div v-loading="loading">
    <div class="toolbar">
      <el-button type="success" @click="handleUpdate">保存</el-button>
    </div>
    <el-tabs type="border-card" v-if="!loading">
      <el-tab-pane v-for="(item, i) in postData" :key="i" :label="item.label">
        <p>上方Banner圖</p>
        <Upload style="height: 100%;margin-bottom:1rem" v-model="item.background" :defaultImg="item.background"></Upload>
        <tinymce :height=500 ref="editor" v-model="item.data"></tinymce>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import request from '@/utils/request'
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage2'
  
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
        this.adData = res.data.data
        this.postData.push(...[
          this.adData.data.find(x => x.name === 'footer-about').data,
          this.adData.data.find(x => x.name === 'footer-privacy').data,
          this.adData.data.find(x => x.name === 'footer-servicepolicy').data,
          this.adData.data.find(x => x.name === 'footer-job').data,
          this.adData.data.find(x => x.name === 'footer-business').data,
          this.adData.data.find(x => x.name === 'footer-kol_recruitment').data,
          this.adData.data.find(x => x.name === 'footer-press').data,
          this.adData.data.find(x => x.name === 'footer-groups').data,
          this.adData.data.find(x => x.name === 'footer-service').data,
          this.adData.data.find(x => x.name === 'footer-contact').data
        ])
        this.loading = false
      },
      async handleUpdate() {
        try {
          this.loading = true
          await request.put('/ad', { config: this.adData })
          this.loading = false
        } catch (err) {
          console.log(err)
        }
      }
    },
    components: {
      Tinymce,
      Upload
    }
  }
</script>

<style lang="scss" scoped>
  .toolbar{
    margin: 1rem;
  }
</style>
