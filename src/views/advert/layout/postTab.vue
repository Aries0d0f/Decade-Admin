<template>
  <div class="ad-index-tab">
    <el-card class="box-card" header="文章分類" :body-style="{ padding: '0px' }">
      <el-tabs type="border-card">
        <el-tab-pane :label="classType.title" v-for="(classType, i) in adData.main" :key="i">
          <el-row :gutter="20">
            <el-col :span="8">
              <Upload v-model="adData.main[i].ad.banner.background" :defaultImg="classType.ad.banner.background"></Upload>
            </el-col>
            <el-col :span="15">
              <el-input v-model="adData.main[i].ad.banner.title" placeholder="標題"></el-input>
              <el-input v-model="adData.main[i].ad.banner.subTitle" placeholder="子標題"></el-input>
              <el-input v-model="adData.main[i].ad.banner.btnTitle" placeholder="按鈕名稱"></el-input>
              <el-input v-model="adData.main[i].ad.banner.btnLink" placeholder="路由"></el-input>
            </el-col>

            <el-col :span="24" style="margin-top: 1rem;">
              <el-card class="box-card" header="分類 Banner" :body-style="{ padding: '0px' }">    
                <el-tabs type="border-card">
                  <el-tab-pane :label="subClassType.title" v-for="(subClassType, j) in classType.children" :key="j">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <Upload v-model="adData.main[i].children[j].ad.banner.background" :defaultImg="subClassType.ad.banner.background"></Upload>
                      </el-col>
                      <el-col :span="15">
                        <el-input v-model="adData.main[i].children[j].ad.banner.title" placeholder="標題"></el-input>
                        <el-input v-model="adData.main[i].children[j].ad.banner.subTitle" placeholder="子標題"></el-input>
                        <el-input v-model="adData.main[i].children[j].ad.banner.btnTitle" placeholder="按鈕名稱"></el-input>
                        <el-input v-model="adData.main[i].children[j].ad.banner.btnLink" placeholder="路由"></el-input>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </el-card>
            </el-col>
            
            <el-col :span="24" style="margin-top: 1rem;">
              <el-card class="box-card" header="分類推薦" :body-style="{ padding: '0px' }">    
                <el-tabs type="border-card">
                  <el-tab-pane :label="subClassType.title" v-for="(subClassType, j) in classType.children" :key="j">
                    <PostSelect v-for="(item, k) in classType.ad.selectedPost" :key="k" v-model="adData.main[i].children[j].ad.selectedPost[k]" :prop-data="item" style="margin-bottom:1rem;width:45%"></PostSelect>
                  </el-tab-pane>
                </el-tabs>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
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