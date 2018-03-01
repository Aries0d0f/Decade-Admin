<template>
  <div class="ad-index-tab">
    <el-card class="box-card" header="Banner 區塊" :body-style="{ padding: '0px' }">
      <el-tabs type="border-card">
        <el-tab-pane label="文章主頁">
          <el-row :gutter="20">
            <el-col :span="8">
              <Upload v-model="adData.main.banner.background" :defaultImg="adData.main.banner.background"></Upload>
            </el-col>
            <el-col :span="15">
              <el-input v-model="adData.main.banner.title" placeholder="標題"></el-input>
              <el-input v-model="adData.main.banner.btnTitle" placeholder="按鈕名稱"></el-input>
              <el-input v-model="adData.main.banner.btnLink" placeholder="路由"></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="box-card" :header="item.title" v-for="(item, i) in adData.main.middleCard" :key="i">
      <div class="stock-block">
        <PostSelect v-for="(post, j) in adData.main.middleCard[i].item" :key="j" v-model="adData.main.middleCard[i].item[j]" :prop-data="post" style="margin-bottom:1rem;width:45%"></PostSelect>
      </div>
    </el-card>
  </div>
</template>

<script>
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
  components: {
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
