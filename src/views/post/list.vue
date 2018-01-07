<template>
  <div class="app-container calendar-list-container">
    <h3 class="form-title">文章列表</h3>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 250px;" class="filter-item" placeholder="文章標題" v-model="listQuery.id"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜尋</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" header-row-style="background-color: #ebeef5;" empty-text="查無資料" element-loading-text="載入中..." fit style="width: 100%">
      <el-table-column label="文章標題">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.author.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分類" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.category}}</span>
        </template>
      </el-table-column>
      <!-- TODO 文章狀態
      <el-table-column label="狀態" width="80">
        <template slot-scope="scope">
          <span>?</span>
        </template>
      </el-table-column> -->
      <el-table-column label="發布日期" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.createdAt | LocalTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="人氣" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.pageview || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="動作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini">分享</el-button>
          <el-button size="mini" @click="$router.push({ name: 'postEdit', params: { id: scope.row.id } })">編輯</el-button>
          <el-button size="mini">檢視</el-button>
          <el-button size="mini" type="danger">刪除</el-button>
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
import { fetchPostList } from '@/api/post'
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
        title: '',
        sort: '+id'
      },
      statusType: [
        { key: 0, label: '已產生' },
        { key: 1, label: '已付款' },
        { key: 2, label: '已發貨' },
        { key: 3, label: '完成' },
        { key: 4, label: '失敗' }
      ]
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const list = await fetchPostList()
      this.total = list.length
      list.map(async(item, i) => {
        const authorId = item.author
        list[i].author = await fetchUser(authorId)
      })
      this.list = list
      this.listLoading = false
    },
    testFilter(status) {
      return this.statusType.filter(x => status === x.key)[0].label
    },
    handleFilter() {
    },
    handleCurrentChange() {
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-title{
    color: #b27536;
    font-weight: normal;
  }
</style>

