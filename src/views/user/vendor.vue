<template>
  <div class="app-container coupon-list-container">
    <h3 class="form-title">廠商列表</h3>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-search-item" prefix-icon="el-icon-search" v-model="listQuery.name"></el-input>
      <el-button class="filter-item" plain @click="handleFilter">搜尋</el-button>
    </div>
    <el-table
      :key='tableKey'
      :data="currentList.slice(pager.start, pager.end)"
      v-loading="listLoading"
      :header-row-style="{ 'background-color': '#ebeef5' }"
      empty-text="查無資料"
      element-loading-text="載入中..."
      fit
      style="width: 100%">
      <el-table-column label="廠商編號" width="230">
        <template slot-scope="scope">
          <span>{{scope.row.id || scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="廠商名稱">
        <template slot-scope="scope">
          <span>{{scope.row.udata.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="動作" class-name="small-padding fixed-width" width="320">
        <template slot-scope="scope">
          <el-button size="mini" @click="$router.push({ name: 'userItem', params: { id: scope.row.cid }})">編輯</el-button>
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
import { fetchUserQuery, patchUser } from '@/api/user'
import { fetchUData } from '@/api/udata'

export default {
  name: 'User-List',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      currentList: [],
      dialogVisible: false,
      listLoading: true,
      selectUser: {
        username: undefined,
        password: undefined,
        type: undefined,
        role: undefined,
        id: undefined
      },
      options: [
        { value: 0, label: '管理員' },
        { value: 3, label: '簽約廠商' },
        { value: 4, label: '簽約編輯' },
        { value: 999, label: '一般會員' }
      ],
      listQuery: {
        page: 1,
        limit: 30,
        name: '',
        sort: '+id'
      }
    }
  },
  async created() {
    await this.getList(`where={"role":["3"]}`)
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
      const tempList = await fetchUserQuery(query)
      const list = tempList.data || tempList
      if (list.err) {
        this.list = []
        this.currentList = []
        this.listLoading = false
        return
      }
      this.total = list.length
      if (list.length === 0) return
      const dataList = []
      list.map(x => dataList.push(fetchUData(x.cid)))
      const res = await Promise.all(dataList)
      res.forEach((x, i) => { list[i].udata = x })
      this.list = list
      this.currentList = list
      this.listLoading = false
    },
    async handleFilter() {
      if (!this.listQuery.name || this.listQuery.name === '') {
        await this.getList(`where={"role":["3"]}`)
      } else {
        await this.getList(`where={"id":["${this.listQuery.name}"]}`)
      }
    },
    createUser() {
      this.selectUser.type = 'create'
      this.selectUser.role = 999
      this.dialogVisible = true
    },
    beforeEdit(id, role) {
      this.selectUser.type = 'edit'
      this.selectUser.id = id
      this.selectUser.role = role
      this.dialogVisible = true
    },
    handleClose() {
      this.selectUser.id = undefined
      this.selectUser.role = undefined
      this.dialogVisible = false
    },
    async handleUpdate() {
      try {
        await patchUser(this.selectUser.id, { role: this.selectUser.role })
        this.$notify({ title: '成功', message: '更新成功', type: 'success', duration: 1000 })
        this.dialogVisible = false
        await this.getList(`where={"role":["3"]}`)
        this.selectUser.id = undefined
        this.selectUser.username = undefined
        this.selectUser.password = undefined
        this.selectUser.role = 999
      } catch (err) {
        this.$notify({ title: '失敗', message: '更新失敗', type: 'warn', duration: 1000 })
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
  .toolbar{
    margin-bottom: 1rem;
  }
</style>

