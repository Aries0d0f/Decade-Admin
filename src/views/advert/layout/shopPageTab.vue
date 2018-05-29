<template>
  <div class="ad-index-tab">

    <el-card class="box-card" header="Banner 區塊">
      <el-row :gutter="20">
        <el-col :span="6">
          <Upload v-model="adData.banner.background" :defaultImg="adData.banner.background"></Upload>
        </el-col>
        <el-col :span="15">
          <el-input v-model="adData.banner.title" placeholder="標題"></el-input>
          <el-input v-model="adData.banner.subTitle" placeholder="子標題"></el-input>
          <el-input v-model="adData.banner.btnLink" placeholder="路由"></el-input>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card" header="商店說明">
      <el-row :gutter="20">
        <el-col :span="6">
          <Upload v-model="adData.intro.image" :defaultImg="adData.intro.image"></Upload>
        </el-col>
        <el-col :span="15">
          <el-input v-model="adData.intro.title" placeholder="標題"></el-input>
          <el-input v-model="adData.intro.subTitle" placeholder="子標題"></el-input>
          <el-input v-model="adData.intro.content" placeholder="內文"></el-input>
        </el-col>
      </el-row>
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

    <el-card class="box-card" header="特殊商品" :body-style="{ padding: '0px' }">
      <el-button type="success" @click="addStockCard" style="margin:10px 20px">新增</el-button>
      <el-tabs type="border-card" closable @tab-remove="removeStockCard">
        <el-tab-pane v-for="(block, i) in adData.stockCard" :key="i" :label="`特殊商品 #${i+1}`" :name="`${i}`">
          <el-row :gutter="20">
            <el-col :span="5">
              <Upload v-model="adData.stockCard[i].img" :defaultImg="adData.stockCard[i].img"></Upload>
            </el-col>
            <el-col :span="15">
              <el-input v-model="adData.stockCard[i].title" placeholder="標題"></el-input>
              <el-input v-model="adData.stockCard[i].btnTitle" placeholder="按鈕標題"></el-input>
              <el-input v-model="adData.stockCard[i].brnLink" placeholder="按鈕連結"></el-input>
              <el-input v-model="adData.stockCard[i].content" type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="內文"></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="box-card" header="主題推薦" :body-style="{ padding: '0px' }">
      <el-button type="success" @click="addBlockArea" style="margin:10px 20px">新增</el-button>
      <el-tabs type="border-card" closable @tab-remove="removeBlockArea">
        <el-tab-pane v-for="(block, i) in adData.blockArea" :key="i" :label="`主題推薦 #${i+1}`" :name="`${i}`">
          <el-row :gutter="20">
            <el-col :span="5">
              <Upload v-model="adData.blockArea[i].background" :defaultImg="adData.blockArea[i].background"></Upload>
            </el-col>
            <el-col :span="15">
              <el-input v-model="adData.blockArea[i].title" placeholder="標題"></el-input>
              <el-input v-model="adData.blockArea[i].subTitle" placeholder="子標題"></el-input>
            </el-col>
            <el-col :span="24">
              <el-tabs type="border-card">
                <el-tab-pane v-for="(button, j) in adData.blockArea[i].button" :key="j" :label="button.title || `#${j+1}`">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <Upload v-model="adData.blockArea[i].button[j].img" :defaultImg="adData.blockArea[i].button[j].img"></Upload>
                    </el-col>
                    <el-col :span="15">
                      <el-input v-model="adData.blockArea[i].button[j].title" placeholder="標題"></el-input>
                      <el-input type="textarea" v-model="adData.blockArea[i].button[j].content" placeholder="子標題"></el-input>
                    </el-col>
                    <el-col :span="24" class="stock-block">
                      <StockSelect v-for="(item, k) in adData.blockArea[i].button[j].stock" v-model="adData.blockArea[i].button[j].stock[k]" :prop-data="item" :key="k" style="margin-bottom:1rem;width:45%"></StockSelect>
                    </el-col>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="box-card" header="推薦獨家商品" :body-style="{ padding: '0px' }">    
      <el-tabs type="border-card">
        <el-tab-pane v-for="(stockType, j) in adData.classStock" :key="j" :label="stockType.title">
          <div style="width:100%;margin-bottom:.5rem;">
            <el-input v-model="adData.classStock[j].title" placeholder="欄位名稱"></el-input>
          </div>
          <StockSelect v-for="(item, i) in stockType.item" :key="i" v-model="adData.classStock[j].item[i]" :prop-data="item" style="margin-bottom:1rem;width:45%"></StockSelect>
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
    this.adData = Object.assign({}, this.propsData.data)
  },
  methods: {
    removeVendor(i) {
      this.adData.vendor[i].delete = true
    },
    addVendor() {
      this.adData.vendor.push({ label: '', name: '', logo: '', delete: false })
    },
    addStockCard() {
      this.adData.stockCard.push({
        img: '',
        title: '',
        content: '',
        btnTitle: '',
        btnLink: ''
      })
    },
    removeStockCard(i) {
      this.adData.stockCard.splice(i, 1)
    },
    addBlockArea() {
      this.adData.blockArea.push({
        background: '',
        title: '',
        subTitle: '',
        button: [
          { title: '', link: '', img: '', content: '', stock: ['', '', '', '', '', '', '', ''] },
          { title: '', link: '', img: '', content: '', stock: ['', '', '', '', '', '', '', ''] },
          { title: '', link: '', img: '', content: '', stock: ['', '', '', '', '', '', '', ''] },
          { title: '', link: '', img: '', content: '', stock: ['', '', '', '', '', '', '', ''] }
        ]
      })
    },
    removeBlockArea(i) {
      this.adData.blockArea.splice(i, 1)
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
