<template>
  <div class="app-container coupon-list-container">
    <h3 class="form-title">商品列表</h3>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-search-item" prefix-icon="el-icon-search" v-model="listQuery.name"></el-input>
      <el-button class="filter-item" plain @click="handleFilter">搜尋</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" header-row-style="background-color: #f3f3f3;color: #424242" empty-text="查無資料" element-loading-text="載入中..." fit style="width: 100%">
      <el-table-column label="商品編號" width="230">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="廠商貨號" width="120">
        <template slot-scope="scope">
          <span>?</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名稱" width="400">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="廠商" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.seller}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分類" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.catalog}}</span>
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.available | stockStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="發布日期" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.createdAt | LocalTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="動作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini">分享</el-button>
          <el-button size="mini" @click="$router.push({ name: 'StockEdit', params: { id: scope.row.id } })">編輯</el-button>
          <el-button size="mini">檢視</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="30" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchStockList, deleteStock } from '@/api/stock'
import { fetchUser } from '@/api/user'

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
  filters: {
    stockStatus: (status) => {
      return status ? '販售中' : '待審核'
    }
  },
  methods: {
    async getList() {
      this.listLoading = true
      const list = await fetchStockList()
      this.total = list.length
      list.map(async(item, i) => {
        const uid = item.seller[0]
        try {
          const user = await fetchUser(uid)
          list[i].seller[0] = user.username
        } catch (err) {
          list[i].seller[0] = { username: 'unknow' }
        }
      })
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
        await deleteStock(id)
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

