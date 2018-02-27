<template>
  <div class="ad-index-tab">

    <el-card class="box-card" header="Banner 區塊" :body-style="{ padding: '0px' }">
      <el-tabs type="border-card">
        <el-tab-pane label="商店主頁">
          <el-row :gutter="20">
            <el-col :span="8">
              <Upload v-model="adData.main[0].banner.background" :defaultImg="adData.main[0].banner.background"></Upload>
            </el-col>
            <el-col :span="15">
              <el-input v-model="adData.main[0].banner.title" placeholder="標題"></el-input>
              <el-input v-model="adData.main[0].banner.subTitle" placeholder="子標題"></el-input>
              <StockSelect v-model="adData.main[0].banner.item" :prop-data="adData.main[0].banner.item" style="margin-bottom:1rem;"></StockSelect>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- <el-card class="box-card" header="進駐品牌">
      <Upload :defaultImg="''"></Upload>
    </el-card> -->

    <el-card class="box-card" header="主題推薦">
      <el-row :gutter="20">
        <el-col :span="5">
          <Upload v-model="adData.main[0].middleBanner.background" :defaultImg="adData.main[0].middleBanner.background"></Upload>
        </el-col>
        <el-col :span="15">
          <el-input v-model="adData.main[0].middleBanner.title" placeholder="標題"></el-input>
          <el-input v-model="adData.main[0].middleBanner.subTitle" placeholder="子標題"></el-input>
        </el-col>
        <el-col :span="24">

          <el-tabs type="border-card">
            <el-tab-pane v-for="(button, j) in adData.main[0].middleBanner.button" :key="j" :label="button.title || `#${j}`">
              <el-row :gutter="20">
                <el-col :span="8">
                  <Upload v-model="adData.main[0].middleBanner.button[j].img" :defaultImg="adData.main[0].middleBanner.button[j].img"></Upload>
                </el-col>
                <el-col :span="15">
                  <el-input v-model="adData.main[0].middleBanner.button[j].title" placeholder="標題"></el-input>
                  <el-input type="textarea" v-model="adData.main[0].middleBanner.button[j].content" placeholder="子標題"></el-input>
                </el-col>
                <el-col :span="24" class="stock-block">
                  <StockSelect v-for="(item, i) in adData.main[0].middleBanner.button[j].stock" v-model="adData.main[0].middleBanner.button[j].stock[i]" :prop-data="item" :key="i" style="margin-bottom:1rem;width:45%"></StockSelect>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>

        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card" header="推薦獨家商品" :body-style="{ padding: '0px' }">
      <el-tabs type="border-card">
        <el-tab-pane v-for="(stockType, j) in adData.main[0].classStock" :key="j" :label="stockType.title">
          <StockSelect v-for="(item, i) in stockType.item" :key="i" v-model="adData.main[0].classStock[i]" :prop-data="item" style="margin-bottom:1rem;width:45%"></StockSelect>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import StockSelect from './StockSelect'
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
    Upload
  }
}
</script>

<style lang="scss">
  .ad-index-tab{
    input{
      margin-bottom: .5rem;
    }
    .el-tab-pane{
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
    }
    .stock-block{
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
    }
  }
</style>