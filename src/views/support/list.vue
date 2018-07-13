<template>
  <div class="app-container calendar-list-container">
    <h3 class="form-title">問題列表</h3>
    <!-- <div class="filter-container">
      <el-input style="width: 250px;" class="filter-item" placeholder="文章標題" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜尋</el-button>
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
      <el-table-column label="類型" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          {{scope.row.type | SupportTypeLabel}}
        </template>
      </el-table-column>
      <el-table-column label="姓名" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <div> {{scope.row.name}}</div>
          <div> {{scope.row.phone}}</div>
          <div> {{scope.row.mail}}</div>
        </template>
      </el-table-column>
      <el-table-column label="內容" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div style="font-weight:bold"> {{scope.row.subject}}</div>
          <div style="font-size: .5rem;color: #8e8e8e;"> {{scope.row.content}}</div>
        </template>
      </el-table-column>
      <el-table-column label="狀態" prop="status" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          {{scope.row.status | SupportStatusLabel}}
        </template>
      </el-table-column>
      <el-table-column label="動作" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="openDetail(scope.row)">檢視</el-button>          
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">      
      <el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <TheForm :dialogVisible.sync="dialogVisible" :formData="dialogData"></TheForm>
  </div>
</template>

<script>
import { fetchSupportList } from '@/api/support'
import { mapGetters } from 'vuex'
import TheForm from './components/TheForm'

export default {
  name: 'Support-List',
  components: { TheForm },
  data() {
    return {
      tableKey: 0,
      list: null,
      currentList: [],
      total: null,
      listLoading: true,
      dialogVisible: false,
      dialogData: {},
      multipleSelection: [],
      listQuery: {
        page: 1,
        limit: 30,
        title: '',
        sort: '+id'
      },
      statusType: ['草稿', '已刊登', '審核中']
    }
  },
  async created() {
    await this.getList()
  },
  computed: {
    ...mapGetters(['userInfo', 'PostClass']),
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
      try {
        const tempList = await fetchSupportList(query)
        const list = tempList.data || tempList
        if (list.err) {
          this.list = []
          this.currentList = []
          this.listLoading = false
          return
        }
        this.total = list.length
        if (list.length === 0) {
          this.list = list
          this.currentList = list
          this.listLoading = false
          return
        }
        this.list = list
        this.currentList = list
        this.listLoading = false
      } catch (err) {
        this.$message.error('錯誤：伺服器錯誤！')
        this.listLoading = false
      }
    },
    async handleFilter() {
      if (this.userInfo.role === 0) {
        if (!this.listQuery.title || this.listQuery.title === '') {
          await this.getList()
        } else {
          await this.getList(`title/${this.listQuery.title}`)
        }
      } else {
        if (!this.listQuery.title || this.listQuery.title === '') {
          await this.getList(`?where={"author":["${this.userInfo.id}"]}`)
        } else {
          await this.getList(`title/${this.listQuery.title}?where={"author":["${this.userInfo.id}"]}`)
        }
      }
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
    },
    async handleChangeStatus(status) {
      // if (this.multipleSelection.length === 0) {
      //   return false
      // }
      // const updateList = []
      // this.multipleSelection.forEach(x => {
      //   updateList.push(updatePost(x.id, { status }))
      // })
      // await Promise.all(updateList)
      // if (this.userInfo.role === 0) {
      //   await this.getList()
      // } else {
      //   await this.getList(`?where={"author":["${this.userInfo.id}"]}`)
      // }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openDetail(data) {
      this.dialogData = data
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-title{
    color: #b27536;
    font-weight: normal;
  }
  .toolbar{
    margin-bottom: 1rem;
  }
</style>

