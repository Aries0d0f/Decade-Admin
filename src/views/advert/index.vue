<template>
  <div v-loading="loading">
    <div class="toolbar">
      <el-button type="success" @click="handleUpdate">保存</el-button>
    </div>
    <el-tabs type="border-card" v-if="!loading">
      <el-tab-pane label="首頁">
        <IndexTab ref="indexTab" :props-data="indexData"></IndexTab>
      </el-tab-pane>
      <el-tab-pane label="商店推薦">
        <ShopMainTab ref="shopMainTab" :props-data="shopMainData"></ShopMainTab>
      </el-tab-pane>
      <!-- <el-tab-pane label="文章推薦">文章推薦</el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
  import IndexTab from './components/indexTab'
  import ShopMainTab from './components/shopMainTab'
  import request from '@/utils/request'
  
  export default {
    data() {
      return {
        loading: true,
        adData: {},
        indexData: {},
        shopMainData: {}
      }
    },
    created() {
      this.getAdData()
    },
    methods: {
      async getAdData() {
        const res = await request.get('/ad')
        this.adData = res.data.data
        this.indexData = {
          ...res.data.data.main
        }
        this.shopMainData = { ...res.data.data.shop }
        this.loading = false
      },
      async handleUpdate() {
        const data = {
          main: this.$refs.indexTab.adData,
          shop: this.$refs.shopMainTab.adData,
          post: this.adData.post
        }
        try {
          this.loading = true
          await request.post('/ad', { config: data })
          this.loading = false
        } catch (err) {
          console.log(err)
        }
      }
    },
    components: {
      IndexTab,
      ShopMainTab
    }
  }
</script>

<style lang="scss" scoped>
  .toolbar{
    margin: 1rem;
  }
</style>
