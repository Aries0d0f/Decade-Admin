<template>
  <div class="ad-index-tab">
    <el-card class="box-card" :header="item.title" v-for="(item, i) in adData.main" :key="i">
      <div class="stock-block">
        <PostSelect v-for="(post, j) in adData.main[i].item" :key="j" v-model="adData.main[i].item[j]" :prop-data="post" style="margin-bottom:1rem;width:45%"></PostSelect>
      </div>
    </el-card>
  </div>
</template>

<script>
import PostSelect from '../components/PostSelect'

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
    PostSelect
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