<template>
  <div class="app-container coupon-list-container">
    <h3 class="form-title">商品列表</h3>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-search-item" prefix-icon="el-icon-search" v-model="listQuery.name"></el-input>
      <el-button class="filter-item" plain @click="handleFilter">搜尋</el-button>
    </div>
    <!-- <div class="toolbar">
      <el-button type="warning" @click="handleChangeStatus(999)">回收桶</el-button>
      <el-button type="success" @click="handleChangeStatus(1)" v-if="userInfo.role === 0">審核完成</el-button>
      <el-button type="success" @click="handleChangeStatus(2)" v-else>送出審核</el-button>
    </div> -->
    <el-table
      :key='tableKey'
      :data="currentList.slice(pager.start, pager.end)"
      v-loading="listLoading"
      :header-row-style="{ 'background-color': '#ebeef5' }"
      empty-text="查無資料"
      element-loading-text="載入中..."
      fit
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <!-- <el-table-column
        type="selection"
        width="55">
      </el-table-column> -->
      <el-table-column label="商品編號" width="230">
        <template slot-scope="scope">
          <span>{{scope.row.id || scope.row._id}}</span>
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
      <!-- <el-table-column label="廠商" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.seller[0].username}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="分類" width="200">
        <template slot-scope="scope">
          <span>{{categoryLabel(scope.row.catalog, scope.row.subCatalog, scope.row.subSubCatalog)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.status === 1 ? '已發佈': '草稿'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="發布日期" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.createdAt | LocalTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="動作" class-name="small-padding fixed-width" width="320">
        <template slot-scope="scope">
          <el-button size="mini">分享</el-button>
          <el-button size="mini" @click="$router.push({ name: 'StockEdit', params: { id: scope.row.id || scope.row._id } })">編輯</el-button>
          <el-button size="mini" @click="openTo(scope.row.id || scope.row._id)">檢視</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id || scope.row._id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">      
      <el-pagination background :current-page.sync="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchStockList, deleteStock } from '@/api/stock'
import { fetchUserQuery } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'Order-List',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      currentList: [],
      multipleSelection: [],
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
  computed: {
    ...mapGetters(['userInfo', 'StockClass']),
    pager: function() {
      const page = this.listQuery.page
      const limit = this.listQuery.limit
      return {
        start: (page - 1) * limit,
        end: page * limit
      }
    }
  },
  methods: {
    async getList(query = '') {
      this.listLoading = true
      this.currentList = []
      this.list = []
      const tempList = await fetchStockList(query)
      const list = tempList.data || tempList
      if (list.err) {
        this.list = []
        this.currentList = []
        this.listLoading = false
        return
      }
      this.total = list.length
      if (list.length === 0) return
      const uidList = []
      list.map(async(item, i) => uidList.push(item.seller[0]))
      const userList = await this.queryUid(uidList)
      list.map(async(item, i) => {
        const user = userList.filter(x => x.id === userList[0].id)
        list[i].seller[0] = user[0] || { username: 'unknow' }
        list[i].info = JSON.parse(list[i].info)
      })
      this.list = list
      this.currentList = list
      this.listLoading = false
    },
    async handleFilter() {
      if (!this.listQuery.name || this.listQuery.name === '') {
        await this.getList()
      } else {
        await this.getList(`name/${this.listQuery.name}`)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async handleChangeStatus(status) {
      if (this.multipleSelection.length === 0) {
        return false
      }
      // const updateList = []
      // this.multipleSelection.forEach(x => {
      //   updateList.push(updateStock(x.id, { status }))
      // })
      // await Promise.all(updateList)
      // if (this.userInfo.role === 0) {
      //   await this.getList()
      // } else {
      //   await this.getList(`?where={"author":["${this.userInfo.id}"]}`)
      // }
    },
    categoryLabel(cate, cate2 = undefined, cate3 = undefined) {
      try {
        const catelog = this.StockClass.find(x => x.type === cate)
        const subCatalog = catelog.children.find(x => x.type === cate2)
        const subCubCatalog = subCatalog.children.find(x => x.type === cate3)
        return `${catelog.title}/${subCatalog.title}/${subCubCatalog.title}`
      } catch (error) {
        return 'unknown'
      }
    },
    async queryUid(uidList) {
      if (uidList.length === 0) return false
      const idList = [...(new Set(uidList))]
      let idArrStr = ''
      idList.map(x => {
        idArrStr += `"${x}",`
        return
      })
      const res = await fetchUserQuery(`where={"id":[${idArrStr}""]}`)
      return res
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
    },
    openTo(id) {
      location.replace(`https://decade.global/shop/stock/${id}`)
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
  .toolbar{
    margin-bottom: 1rem;
  }
</style>

