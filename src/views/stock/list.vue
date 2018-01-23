<template>
  <div class="app-container coupon-list-container">
    <h3 class="form-title">商品列表</h3>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-search-item" prefix-icon="el-icon-search" v-model="listQuery.name"></el-input>
      <el-button class="filter-item" plain @click="handleFilter">搜尋</el-button>
    </div>
    <el-table :key='tableKey' :data="currentList.slice(pager.start, pager.end)" v-loading="listLoading" :header-row-style="{ 'background-color': '#ebeef5' }" empty-text="查無資料" element-loading-text="載入中..." fit style="width: 100%">
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
          <span>{{scope.row.seller[0].username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分類" width="200">
        <template slot-scope="scope">
          <span>{{categoryLabel(scope.row.info.type, scope.row.catalog)}}</span>
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
          <el-button size="mini" @click="openTo(scope.row.id)">檢視</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">      
      <el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchStockList, deleteStock } from '@/api/stock'
import { fetchUserQuery } from '@/api/user'

export default {
  name: 'Order-List',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      currentList: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 30,
        name: '',
        sort: '+id'
      },
      stockClass: [
        {
          value: 0,
          name: 'theme',
          label: '服務體驗',
          children: [
            { label: '課程活動', name: 'lecture', value: 0 },
            { label: '精選商店', name: 'special_shop', value: 1 },
            { label: '旅遊', name: 'traveling', value: 2 }
          ]
        },
        {
          value: 1,
          name: 'life',
          label: '居家空間',
          children: [
            { label: '家飾', name: 'furnishings', value: 0 },
            { label: '家具', name: 'furniture', value: 1 },
            { label: '家電', name: 'appliances', value: 2 }
          ]
        },
        {
          value: 2,
          name: 'brands',
          label: '生活質感',
          children: [
            { label: '3C周邊', name: 'eletronics', value: 0 },
            { label: '個人用品', name: 'personal', value: 1 },
            { label: '肌膚保養', name: 'skin_care', value: 2 },
            { label: '時尚配飾', name: 'fashion', value: 3 }
          ]
        },
        {
          value: 3,
          name: 'food',
          label: '美食品味',
          children: [
            { label: '美食', name: 'ingredinents', value: 0 },
            { label: '餐具', name: 'tableware', value: 1 },
            { label: '廚具', name: 'kitchenware', value: 2 },
            { label: '茶具酒器', name: 'tea_set', value: 3 }
          ]
        }
      ]
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
    handleCurrentChange() {
    },
    categoryLabel(cate, subCate = -1) {
      try {
        const labelClass = this.stockClass.filter(x => cate === x.value)
        const label = labelClass[0].label
        if (labelClass[0].children) {
          const subLabel = labelClass[0].children.filter(x => subCate === x.value)
          if (subLabel.length > 0) {
            return label + '/' + subLabel[0].label
          } else {
            return label
          }
        }
        return label
      } catch (error) {
        return 'unknow'
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
</style>

