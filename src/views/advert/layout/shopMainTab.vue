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
              <el-input v-model="adData.main[0].banner.btnLink" placeholder="路由"></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="box-card" header="進駐品牌" :body-style="{ display: 'flex', 'flex-wrap': 'wrap'}">
      <div class="brand-item" v-for="(vendor, i) in adData.main[0].vendor" :key="i" v-if="!vendor.delete">
        <div class="delete-btn" @click="removeVendor(i)">X</div>
        <Upload v-model="adData.main[0].vendor[i].logo" :watch-default="true" :defaultImg="vendor.logo"></Upload>
        <div class="brand-detail">
          <el-input v-model="adData.main[0].vendor[i].label" placeholder="名稱"></el-input>
          <el-input v-model="adData.main[0].vendor[i].name" placeholder="搜尋字串"></el-input>
        </div>
      </div>
      <div class="brand-item add-brand" @click="addVendor">+</div>      
    </el-card>

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
          <StockSelect v-for="(item, i) in stockType.item" :key="i" v-model="adData.main[0].classStock[j].item[i]" :prop-data="item" style="margin-bottom:1rem;width:45%"></StockSelect>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import StockSelect from '../components/StockSelect'
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
  methods: {
    removeVendor(i) {
      this.adData.main[0].vendor[i].delete = true
    },
    addVendor() {
      this.adData.main[0].vendor.push({ label: '', name: '', logo: '', delete: false })
    }
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
    .brand-item{
      margin: .5rem;
      width: 178px;
      color: #6b6b6b;
      cursor: pointer;
      .delete-btn{
        width: 20px;
        height: 20px;
        background: #e0e0e0;
        color: #808080;
        border-radius: 50%;
        position: absolute;
        margin-top: .5rem;
        margin-left: .5rem;
        z-index: 1;
        font-size: 13px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background .3s;

        &:hover{
          background: #bdbdbd;
        }
      }
      .brand-detail{
        margin-top: .5rem;
      }
    }
    .add-brand{
      height: 178px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3rem;
      color: #a8a8a8;
      background: #e8e8e8;
    }    
  }
</style>
