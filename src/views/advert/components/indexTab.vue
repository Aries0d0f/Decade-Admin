<template>
  <div class="ad-index-tab">
    <el-card class="box-card" header="首頁標語">
      <el-input v-model="adData.banner.title" placeholder="請輸入內容"></el-input>
      <el-input v-model="adData.banner.subtitle" placeholder="請輸入內容"></el-input>
    </el-card>

    <el-card class="box-card" header="經典推薦" :body-style="{ padding: '0px' }">
      <el-tabs type="border-card">
        <el-tab-pane v-for="i in 3" :key="i" :label="`分頁 ${i}`">
          <PostSelect v-for="j in 5" v-model="adData.topPost[(i - 1) * 5 + j]" :prop-data="adData.topPost[((i - 1) * 5 + j) - 1]" :key="j" class="post-select"></PostSelect>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="box-card" header="文章分類推薦" :body-style="{ padding: '0' }">
      <el-tabs type="border-card">
        <el-tab-pane v-for="(classItem, j) in adData.classPost" :key="j" :label="classItem.title">
          <PostSelect v-for="(item, i) in classItem.item" v-model="classItem.item[i]" :prop-data="item" :key="i" class="post-select"></PostSelect>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- <el-card class="box-card" header="進駐品牌">
      <Upload :defaultImg="''"></Upload>
    </el-card> -->

    <el-card class="box-card" header="Banner 區塊">
      <el-row :gutter="20">
        <el-col :span="5">
          <Upload v-model="adData.middleBanner.background" :defaultImg="adData.middleBanner.background"></Upload>
        </el-col>
        <el-col :span="18">
          <el-input v-model="adData.middleBanner.title" placeholder="標題"></el-input>
          <el-input v-model="adData.middleBanner.btnTitle" placeholder="按鈕文字"></el-input>
          <el-input v-model="adData.middleBanner.btnLink" placeholder="連結"></el-input>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card" header="推薦獨家商品" :body-style="{ padding: '0px' }">
      <el-tabs type="border-card">
        <el-tab-pane v-for="(stockType, j) in adData.classStock" :key="j" :label="stockType.title">
          <StockSelect v-for="(item, i) in stockType.item" v-model="adData.classStock[i]" :prop-data="item" :key="i" style="margin-bottom:1rem;width:45%"></StockSelect>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import StockSelect from './StockSelect'
import PostSelect from './PostSelect'
import Upload from '@/components/Upload/singleImage2'

export default {
  props: ['propsData'],
  data() {
    return {
      adData: {}
    }
  },
  created() {
    this.adData = Object.assign({}, this.propsData)
  },
  components: {
    StockSelect,
    PostSelect,
    Upload
  }
}
</script>

<style lang="scss">
  .ad-index-tab{
    input{
      margin-bottom: .5rem;
    }

    .box-card{
      margin-bottom: 1rem;
    }
    
    .post-select{
      margin-bottom: 1rem;
      width: 45%;
    }

    .el-tab-pane{
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
    }
  }
</style>