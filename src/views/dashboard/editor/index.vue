<template>
  <el-row :gutter="20" v-if="!loading">
    <el-col :span="22">
      <h3 class="title">系統通知</h3>
      <el-card class="box-card">
        即將上線
      </el-card>            
    </el-col>
    <el-col :span="8">
      <h3 class="title">文章動態</h3>
      <BlockCard :pre-span="8" :label="['文章總數', '最新留言', '文章分享次數']" :data="[postList.length, 0, 0]" :itemLabel="['篇','篇','篇']"></BlockCard> 
    </el-col>
    <el-col :span="10" :offset="3">
      <h3 class="title">我的人氣</h3>
      <BlockCard :pre-span="8" :label="['追蹤人數', '點閱率', '喜好數']" :data="[0, postTotalView, 0]" :itemLabel="['篇','篇','篇']"></BlockCard> 
    </el-col>
    <el-col :span="22">
      <h3 class="title">讀者動態分系</h3>
      <el-card class="box-card">
        即將上線
      </el-card>  
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchPostList } from '@/api/post'
import BlockCard from '../components/BlockCard'

export default {
  name: 'editor-dashboard',
  components: { BlockCard },
  data() {
    return {
      loading: true,
      postList: []
    }
  },
  async created() {
    await this.initPage()
  },
  computed: {
    ...mapGetters(['userInfo']),
    postTotalView() {
      return this.postList.reduce((a, b) => a + b.pageview, 0)
    }
  },
  methods: {
    async initPage() {
      try {
        const post = await fetchPostList(`?where={"author":["${this.userInfo.id}"]}`)
        this.postList = post
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .title{
    font-weight: normal;
    font-size: 1rem;
    margin-top: 1.5rem;

    &:after{
      content: '';
      height: 3px;
      display: block;
      width: 2.5rem;
      background: #b27536;
      margin-top: 1rem;
    }
  }
</style>
