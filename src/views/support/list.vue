<template>
  <div class="app-container calendar-list-container">
    <h3 class="form-title">問題列表</h3>
    <div class="filter-container">
      <el-input style="width: 250px;" class="filter-item" placeholder="文章標題" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜尋</el-button>
    </div>
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
      <el-table-column label="類型" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          {{scope.row.type | typeLabel}}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" class-name="small-padding fixed-width"></el-table-column>
      <el-table-column label="信箱" prop="mail" class-name="small-padding fixed-width"></el-table-column>
      <el-table-column label="主旨" prop="subject" class-name="small-padding fixed-width"></el-table-column>
      <el-table-column label="狀態" prop="status" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          {{scope.row.status | statusLabel}}
        </template>
      </el-table-column>
      <el-table-column label="動作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="openTo(scope.row.id || scope.row._id)">檢視</el-button>          
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
import { fetchSupportList } from '@/api/support'
import { mapGetters } from 'vuex'

export default {
  name: 'Support-List',
  data() {
    return {
      tableKey: 0,
      list: null,
      currentList: [],
      total: null,
      listLoading: true,
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
  filters: {
    typeLabel: (value) => {
      const label = ['意見申訴', '進駐商城', '創作平台', '廣告媒體', '公益基金', '提交問題']
      return label[value - 1]
    },
    statusLabel: (value) => {
      const label = ['已開啟', '已回答', '客戶已回覆', '處理中', '已關閉']
      return label[value - 1]
    }
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

