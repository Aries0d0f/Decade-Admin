<template>
  <div v-if="!loading">
    <el-row :gutter="20">
      <el-col :span="3">
        <BlockCard :pre-span="24" :label="['訂單筆數']" :data="[orderList.length]" :itemLabel="['筆']"></BlockCard> 
      </el-col>
      <el-col :span="6">
        <BlockCard :pre-span="12" :label="['文章總數', '商品總數']" :data="[postList.length, stockList.length]" :itemLabel="['篇', '個']"></BlockCard> 
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <h3 class="title">訂單狀態</h3>
        <el-card class="box-card">
          <el-table :data="orderList" stripe style="width: 100%">
            <el-table-column prop="id" label="編號"></el-table-column>
            <el-table-column prop="price.orderTotal" label="金額" width="120"></el-table-column>
            <el-table-column label="狀態" width="80">
              <template slot-scope="scope">
                <el-tag type="success">{{scope.row.status | OrderStatusLabel}}</el-tag>
              </template>
            </el-table-column>
          </el-table>        
        </el-card>   
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchOrderByVendor } from '@/api/order'
import { fetchStockBySeller } from '@/api/stock'
import { fetchPostList } from '@/api/post'
import BlockCard from '../components/BlockCard'

export default {
  name: 'vendor-dashboard',
  components: { BlockCard },
  data() {
    return {
      loading: true,
      postList: [],
      orderList: [],
      stockList: []
    }
  },
  async created() {
    await this.initPage()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async initPage() {
      try {
        const [post, stock, order] = await Promise.all([
          fetchPostList(`?where={"author":["${this.userInfo.id}"]}`),
          fetchStockBySeller(this.userInfo.id),
          fetchOrderByVendor(this.userInfo.id)
          // fetchOrderList()
        ])
        this.postList = post
        this.stockList = stock.data
        this.orderList = order.splice(0, 7)
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
