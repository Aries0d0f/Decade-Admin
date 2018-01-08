<template>
  <div class="app-container coupon-list-container">
    <h3 class="form-title">優惠券列表</h3>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-search-item" prefix-icon="el-icon-search" v-model="listQuery.name"></el-input>
      <el-button class="filter-item" plain @click="handleFilter">搜尋</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" header-row-style="background-color: #f3f3f3;color: #424242" empty-text="查無資料" element-loading-text="載入中..." fit style="width: 100%">
      <el-table-column label="優惠券編號">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="優惠券名稱">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣碼">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用期限">
        <template slot-scope="scope">
          <span>?</span>
        </template>
      </el-table-column>
      <el-table-column label="發放數">
        <template slot-scope="scope">
          <span>{{scope.row.count}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活動狀態">
        <template slot-scope="scope">
          <span>?</span>
        </template>
      </el-table-column>
      <el-table-column label="動作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="$router.push({ name: 'CouponEdit', params: { id: scope.row.id } })">編輯</el-button>
          <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="30" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
import { fetchCouponList, deleteCoupon } from '@/api/coupon'

export default {
  name: 'Order-List',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 30,
        name: '',
        sort: '+id'
      }
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const list = await fetchCouponList()
      this.total = list.length
      this.list = list
      this.listLoading = false
    },
    handleFilter() {
    },
    handleCurrentChange() {
    },
    async handleDelete(id) {
      try {
        await this.$confirm('確定要刪除?', '提示', { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' })
        await deleteCoupon(id)
        this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 1000 })
        await this.getList()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .coupon-list-container{
    .form-title{
      color: #b27536;
      font-weight: normal;
    }
      
    .el-input__inner {
      background: #f7f7f7; 
      border: 0; 
      border-radius: 10px;
    }

    .filter-search-item{
      width: 250px;
    }
  }
</style>

