<template>
  <div class="app-container calendar-list-container">
    <h3 class="form-title">文章列表</h3>
    <div class="filter-container">
      <el-input style="width: 250px;" class="filter-item" placeholder="文章標題" v-model="listQuery.title"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜尋</el-button>
    </div>
    <el-table :key='tableKey' :data="currentList.slice(pager.start, pager.end)" v-loading="listLoading" :header-row-style="{ 'background-color': '#ebeef5' }" empty-text="查無資料" element-loading-text="載入中..." fit style="width: 100%">
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
          <span>{{categoryLabel(scope.row.category, scope.row.subCategory)}}</span>
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
          <el-button size="mini" @click="openTo(scope.row.id)">檢視</el-button>
          <el-button size="mini" type="danger">刪除</el-button>
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
import { fetchPostList } from '@/api/post'
import { fetchUserQuery } from '@/api/user'

export default {
  name: 'Order-List',
  data() {
    return {
      tableKey: 0,
      list: null,
      currentList: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 30,
        title: '',
        sort: '+id'
      },
      postClass: [
        {
          value: 0,
          name: 'news',
          label: '新訊',
          children: [
            { value: 0, label: '經典人物', name: 'character' },
            { value: 1, label: '特別企劃', name: 'special' }
          ]
        },
        {
          value: 1,
          name: 'beauty',
          label: '保養',
          children: [
            { value: 0, name: 'body', label: '美體' },
            { value: 1, name: 'fragrance', label: '香氛' }
          ]
        },
        { value: 2,
          name: 'life',
          label: '生活',
          children: [
            { value: 0, name: 'art_tech', label: '藝術科技' },
            { value: 1, name: 'home', label: '家居' }
          ]
        },
        {
          value: 3,
          name: 'feature',
          label: '品味',
          children: [
            { value: 0, name: 'gourmet', label: '美食' },
            { value: 1, name: 'vintage', label: '佳釀' },
            { value: 2, name: 'coffee', label: '品茗咖啡' },
            { value: 3, name: 'ingredinents', label: '食材' }
          ]
        },
        {
          value: 4,
          name: 'classic',
          label: '經典',
          children: [
            { value: 0, name: 'art', label: '藝術' },
            { value: 1, name: 'exhibition', label: '展覽' },
            { value: 2, name: 'livehouse', label: '空間' },
            { value: 3, name: 'brands', label: '品牌' }
          ]
        },
        {
          value: 5,
          name: 'music',
          label: '音樂',
          children: [
            { value: 0, name: 'vinyl', label: '黑膠' },
            { value: 1, name: 'melody', label: '音律' },
            { value: 2, name: 'activity', label: '活動' }
          ]
        }
      ],
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
      try {
        const tempList = await fetchPostList(query)
        const list = tempList.data || tempList
        this.total = list.length
        if (list.length === 0) return
        const uidList = []
        list.map(async(item, i) => uidList.push(item.author))
        const userList = await this.queryUid(uidList)
        list.map(async(item, i) => {
          const user = userList.filter(x => x.id === userList[0].id)
          list[i].author = user[0] || { username: 'unknow' }
        })
        this.list = list
        this.currentList = list
        this.listLoading = false
      } catch (err) {
        this.$message.error('錯誤：伺服器錯誤！')
        this.listLoading = false
      }
    },
    categoryLabel(cate, subCate = -1) {
      try {
        const labelClass = this.postClass.filter(x => cate === x.value)
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
    async handleFilter() {
      if (!this.listQuery.title || this.listQuery.title === '') {
        await this.getList()
      } else {
        await this.getList(`title/${this.listQuery.title}`)
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
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    },
    openTo(id) {
      location.replace(`https://decade.global/magazine/post/${id}`)
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

