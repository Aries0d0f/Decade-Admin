<template>
  <div class="app-container calendar-list-container">
    <h3 class="form-title">文章列表</h3>
    <div class="filter-container">
      <el-input style="width: 250px;" class="filter-item" placeholder="文章標題" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜尋</el-button>
    </div>
    <div class="toolbar">
      <el-button type="warning" @click="handleChangeStatus(999)">回收桶</el-button>
      <el-button type="success" @click="handleChangeStatus(1)" v-if="userInfo.role === 0">審核完成</el-button>
      <el-button type="success" @click="handleChangeStatus(2)" v-else>送出審核</el-button>
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
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
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
      <el-table-column label="分類" width="150">
        <template slot-scope="scope">
          <span>{{categoryLabel(scope.row.category)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.status | PostStatusLabel}}</span>
        </template>
      </el-table-column>
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
          <el-button size="mini" @click="$router.push({ name: 'postEdit', params: { id: scope.row.id || scope.row._id } })">編輯</el-button>
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
import { fetchPostList, updatePost } from '@/api/post'
import { fetchUserQuery } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'Post-List',
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
    if (this.userInfo.role === 0) {
      await this.getList()
    } else {
      await this.getList(`?where={"author":["${this.userInfo.id}"]}`)
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
        const tempList = await fetchPostList(query)
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
        const uidList = []
        list.map(async(item, i) => uidList.push(item.author))
        const userList = await this.queryUid(uidList)
        list.map(async(item, i) => {
          const user = userList.filter(x => x.id === userList[0].id)
          list[i].author = user[0] || { username: 'unknown' }
        })
        this.list = list
        this.currentList = list
        this.listLoading = false
      } catch (err) {
        this.$message.error('錯誤：伺服器錯誤！')
        this.listLoading = false
      }
    },
    categoryLabel(cate) {
      try {
        const label = this.PostClass.find(x => x.type === cate)
        return label.title || 'unknown'
      } catch (error) {
        return 'unknown'
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
    async handleChangeStatus(status) {
      if (this.multipleSelection.length === 0) {
        return false
      }
      const updateList = []
      this.multipleSelection.forEach(x => {
        updateList.push(updatePost(x.id, { status }))
      })
      await Promise.all(updateList)
      if (this.userInfo.role === 0) {
        await this.getList()
      } else {
        await this.getList(`?where={"author":["${this.userInfo.id}"]}`)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openTo(id) {
      window.open(`https://decade.global/magazine/post/${id}`, '_blank')
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

