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
      <el-tab-pane label="生活誌推薦">
        <PostMainTab ref="magazineMainTab" :props-data="magazineMainData"></PostMainTab>
      </el-tab-pane>
      <el-tab-pane label="文章分類">
        <PostTab ref="postTab" :props-data="postData"></PostTab>
      </el-tab-pane>
      <el-tab-pane label="商品分類">
        <StockTab ref="stockTab" :props-data="stockData"></StockTab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import IndexTab from './layout/indexTab'
  import ShopMainTab from './layout/shopMainTab'
  import PostMainTab from './layout/postMainTab'
  import StockTab from './layout/stockTab'
  import PostTab from './layout/postTab'
  import request from '@/utils/request'
  
  export default {
    data() {
      return {
        loading: true,
        adData: {},
        indexData: {},
        shopMainData: {},
        stockData: {},
        postData: {}
      }
    },
    created() {
      this.getAdData()
    },
    methods: {
      async getAdData() {
        const res = await request.get('/ad')
        // 兼容神奇的後端
        res.data.data.main.vendor.map(x => x.delete = false)
        res.data.data.shop.main[0].vendor.map(x => x.delete = false)
        
        this.adData = res.data.data
        this.indexData = { ...res.data.data.main }
        this.shopMainData = { ...res.data.data.shop }
        this.magazineMainData = { ...res.data.data.magazine }
        this.stockData = { ...res.data.data.stock }
        this.postData = { ...res.data.data.post }
        this.loading = false
      },
      async handleUpdate() {
        const data = {
          main: this.$refs.indexTab.adData,
          shop: this.$refs.shopMainTab.adData,
          magazine: this.$refs.magazineMainTab.adData,
          stock: this.$refs.stockTab.adData,
          post: this.$refs.postTab.adData
        }
        // 兼容神奇的後端
        data.main.vendor.map(x => delete x.delete)
        data.shop.main[0].vendor.map(x => delete x.delete)
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
      ShopMainTab,
      StockTab,
      PostTab,
      PostMainTab
    }
  }
</script>

<style lang="scss" scoped>
  .toolbar{
    margin: 1rem;
  }
</style>
