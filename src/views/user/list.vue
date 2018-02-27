<template>
  <div class="app-container coupon-list-container">
    <h3 class="form-title">會員列表</h3>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-search-item" prefix-icon="el-icon-search" v-model="listQuery.name"></el-input>
      <el-button class="filter-item" plain @click="handleFilter">搜尋</el-button>
    </div>
    <div class="toolbar">
      <el-button type="warning" @click="createUser">新增會員</el-button>
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
      <el-table-column label="商品編號" width="230">
        <template slot-scope="scope">
          <span>{{scope.row.id || scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="帳號">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="權限" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.role | UserRoleLabel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="動作" class-name="small-padding fixed-width" width="320">
        <template slot-scope="scope">
          <el-button size="mini" @click="beforeEdit(scope.row.id || scope.row._id, scope.row.role)">編輯</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id || scope.row._id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">      
      <el-pagination background :current-page.sync="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <template v-if="selectUser.type === 'edit'">
        <span>會員權限：</span>
        <el-select v-model="selectUser.role" placeholder="請選擇">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template v-else>
        <span>帳號：</span>
        <el-input v-model="selectUser.username" placeholder="帳號" style="margin-bottom: .5rem"></el-input>
        <span>密碼：</span>
        <el-input v-model="selectUser.password" type="password" placeholder="密碼" style="margin-bottom: .5rem"></el-input>
        <span>會員權限：</span>
        <el-select v-model="selectUser.role" placeholder="請選擇">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="selectUser.type === 'edit'" @click="handleUpdate()">確 定</el-button>
        <el-button type="primary" v-else @click="handleCreate()">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserQuery, deleteUser, patchUser, createUser } from '@/api/user'
import md5 from 'js-md5'

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
    await this.getList()
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
      this.list = list
      this.currentList = list
      this.listLoading = false
    },
    async handleFilter() {
      if (!this.listQuery.name || this.listQuery.name === '') {
        await this.getList()
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
    async handleCreate() {
      if (!this.selectUser.username || !this.selectUser.password || typeof this.selectUser.role === 'undefined') {
        this.$message.error('錯誤:請先輸入資料');
        return
      }
      try {
        const data = {
          username: this.selectUser.username,
          pwd: md5(this.selectUser.password),
          role: this.selectUser.role,
          state: 0
        }
        await createUser(data)
        this.$notify({ title: '成功', message: '新增成功', type: 'success', duration: 1000 })
        this.dialogVisible = false
        await this.getList()
        this.selectUser.id = undefined
        this.selectUser.username = undefined
        this.selectUser.password = undefined
        this.selectUser.role = 999
      } catch (err) {
        this.$notify.error({ title: '失敗', message: '新增失敗，請檢查帳號是否重複', duration: 1000 })
        console.log(err)
      }
    },
    async handleUpdate() {
      try {
        await patchUser(this.selectUser.id, { role: this.selectUser.role })
        this.$notify({ title: '成功', message: '更新成功', type: 'success', duration: 1000 })
        this.dialogVisible = false
        await this.getList()
        this.selectUser.id = undefined
        this.selectUser.username = undefined
        this.selectUser.password = undefined
        this.selectUser.role = 999
      } catch (err) {
        this.$notify({ title: '失敗', message: '更新失敗', type: 'warn', duration: 1000 })
        console.log(err)
      }
    },
    async handleDelete(id) {
      try {
        await this.$confirm('確定要刪除?', '提示', { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' })
        await deleteUser(id)
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
  .toolbar{
    margin-bottom: 1rem;
  }
</style>

