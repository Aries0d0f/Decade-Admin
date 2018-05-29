<template>
  <div class="ad-index-tab">
    <el-card class="box-card" header="首頁標語">
      <el-input v-model="adData.banner.title" placeholder="請輸入內容"></el-input>
      <el-input v-model="adData.banner.subtitle" placeholder="請輸入內容"></el-input>
      <el-input v-model="adData.banner.video" placeholder="桌機版影片"></el-input>
      <el-row :gutter="20">
        <el-col :span="10">
          <p>手機版圖片</p>
          <Upload v-model="adData.banner.image" :defaultImg="adData.banner.image"></Upload>
        </el-col>
        <!-- <el-col :span="10">
          <p>桌機版影片</p>
          <Upload v-model="adData.banner.video" :defaultImg="adData.banner.video"></Upload>
        </el-col> -->
      </el-row>

    </el-card>
    <el-card class="box-card" header="頁尾標語">
      <el-input v-model="adData.copyright" placeholder="請輸入內容"></el-input>
    </el-card>

    <el-card class="box-card" header="文章推薦" :body-style="{ padding: '0px' }">
      <div style="padding:20px">
        <el-input v-model="adData.spotlight.label" placeholder="欄位名稱"></el-input>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane v-for="i in 3" :key="i" :label="`分頁 ${i}`">
          <PostSelect v-for="j in 5" v-model="adData.spotlight.list[((i - 1) * 5 + j) - 1]" :prop-data="adData.spotlight.list[((i - 1) * 5 + j) - 1]" :key="j" class="post-select"></PostSelect>
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

    <el-card class="box-card" header="進駐品牌" :body-style="{ display: 'flex', 'flex-wrap': 'wrap'}">
      <div class="brand-item" v-for="(vendor, i) in adData.vendor" :key="i" v-if="!vendor.delete">
        <div class="delete-btn" @click="removeVendor(i)">X</div>
        <Upload v-model="adData.vendor[i].logo" :watch-default="true" :defaultImg="vendor.logo"></Upload>
        <div class="brand-detail">
          <el-input v-model="adData.vendor[i].label" placeholder="名稱"></el-input>
          <el-input v-model="adData.vendor[i].name" placeholder="搜尋字串"></el-input>
        </div>
      </div>
      <div class="brand-item add-brand" @click="addVendor">+</div>      
    </el-card>

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
          <StockSelect v-for="(item, i) in stockType.item" v-model="adData.classStock[j].item[i]" :prop-data="item" :key="i" style="margin-bottom:1rem;width:45%"></StockSelect>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import StockSelect from '../components/StockSelect'
import PostSelect from '../components/PostSelect'
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
      this.adData.vendor[i].delete = true
    },
    addVendor() {
      this.adData.vendor.push({ label: '', name: '', logo: '', delete: false })
    }
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
