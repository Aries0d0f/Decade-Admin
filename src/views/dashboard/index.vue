<template>
  <div class="dashboard-container" v-if="!loading">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never" class="card" :body-style="{ display: 'flex', 'justify-content': 'space-between' }">
          <div class="icon order">
            <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
          </div>
          <div class="info">
            <span class="label">訂單總數</span>
            <span class="detail">
              <count-to :start-val="0" :end-val="orderList.length" :duration="4000" :decimals="0" :separator="','" :autoplay="true"></count-to>
            </span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="never" class="card" :body-style="{ display: 'flex', 'justify-content': 'space-between' }">
          <div class="icon stock">
            <svg-icon icon-class="star" class-name="card-panel-icon" />
          </div>
          <div class="info">
            <span class="label">商品總數</span>
            <span class="detail">
              <count-to :start-val="0" :end-val="stockList.length" :duration="4000" :decimals="0" :separator="','" :autoplay="true"></count-to>
            </span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="never" class="card" :body-style="{ display: 'flex', 'justify-content': 'space-between' }">
          <div class="icon post">
            <svg-icon icon-class="documentation" class-name="card-panel-icon" />
          </div>
          <div class="info">
            <span class="label">文章總數</span>
            <span class="detail">
              <count-to :start-val="0" :end-val="postList.length" :duration="4000" :decimals="0" :separator="','" :autoplay="true"></count-to>
            </span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="never" class="card" :body-style="{ display: 'flex', 'justify-content': 'space-between' }">
          <div class="icon fav">
            <svg-icon icon-class="people" class-name="card-panel-icon" />
          </div>
          <div class="info">
            <span class="label">訂閱總數</span>
            <span class="detail">
              <count-to :start-val="0" :end-val="userInfo.udata.followedby.length" :duration="4000" :decimals="0" :separator="','" :autoplay="true"></count-to>
            </span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24">
        <h4>訂單狀況</h4>
        <el-card shadow="never" class="card" :body-style="{ display: 'flex', 'justify-content': 'space-between' }">
          <BarChart :data="orderList"></BarChart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchOrderByVendor, fetchOrderList } from '@/api/order'
import { fetchStockBySeller } from '@/api/stock'
import { fetchPostList } from '@/api/post'
import countTo from 'vue-count-to'
import BarChart from './components/BarChart'

export default {
  name: 'dashboard',
  components: { countTo, BarChart },
  data() {
    return {
      loading: true,
      orderList: [],
      stockList: [],
      postList: []
    }
  },
  async created() {
    if (this.userInfo.id) {
      await this.initPage()
    }
  },
  watch: {
    async 'userInfo.id'(val) {
      await this.initPage()
    }
  },
  methods: {
    async initPage() {
      try {
        const [post, stock, order] = await Promise.all([
          fetchPostList(`?where={"author":["5a531f46418f6102cc971035"]}`),
          fetchStockBySeller(this.userInfo.id),
          fetchOrderByVendor(this.userInfo.id)
          // fetchOrderList()
        ])
        this.postList = post
        this.stockList = stock.data
        this.orderList = order
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container{
    margin: 1rem;
  }
  .card{
    .icon{
      font-size: 3rem;
      padding: 3px 5px;
      margin-right: 1.4rem;
      transition: all .3s;
      border-radius: 6px;

      &.order{
        color: #40c9c6;
        &:hover{
          background: #40c9c6;
          color: #fff;
        }
      }

      &.post{
        color: #40c9c6;
        &:hover{
          background: #40c9c6;
          color: #fff;
        }
      }

      &.stock{
        color: #40c9c6;
        &:hover{
          background: #40c9c6;
          color: #fff;
        }
      }

      &.fav{
        color: #40c9c6;
        &:hover{
          background: #40c9c6;
          color: #fff;
        }
      }
    }
    .info{
      display: flex;
      flex-direction: column;
      .label{
        font-size: .9rem;
        color: #888888;
        font-weight: bold;
      }
      .detail{
        font-size: 1.8rem;
        margin-top: .5rem;
      }
    }
  }
</style>
