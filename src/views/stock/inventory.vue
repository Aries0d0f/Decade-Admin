<template>
  <div class="app-container coupon-list-container">
    <h3 class="form-title">商品列表</h3>
    <!-- <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" class="filter-item filter-search-item" prefix-icon="el-icon-search" v-model="listQuery.name"></el-input>
      <el-button class="filter-item" plain @click="handleFilter">搜尋</el-button>
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
      <el-table-column label="商品編號" width="230">
        <template slot-scope="scope">
          <span>{{scope.row.id || scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名稱" width="400">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分類" width="200">
        <template slot-scope="scope">
          <span>{{categoryLabel(scope.row.catalog, scope.row.subCatalog, scope.row.subSubCatalog)}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="剩餘庫存" width="120">
        <template slot-scope="scope">
          <span>{{allSpacCount(scope.row.spec)}}</span>
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
      <el-table-column label="動作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleOpenEdit(scope.row.id)">編輯</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">      
      <el-pagination background :current-page.sync="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="editItem.name" :visible.sync="isEdit" width="40rem" :before-close="handleCloseEdit">
      <el-row :gutter="20" v-for="(item, i) in editItem.spec" :key="i">
        <el-col :span="7">
          <img :src="item.imageURL || editItem.img[0]" style="max-width:100%" alt="">
        </el-col>
        <el-col :span="16">
          <div class="spec-title">規格</div>
          <div class="spec-item">{{item.name}}</div>
          <div class="spec-title">庫存</div>
          <el-input-number v-model.number="item.count" controls-position="right" :min="0" :max="9999" style="width: 10rem"></el-input-number>
        </el-col>
        <el-col>
          <hr class="spec-hr">
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEdit = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateEdit()" v-loading="editLoading" :disabled="editLoading">送出</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchStockBySeller, updateStock } from '@/api/stock'
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
      isEdit: false,
      editItem: {},
      editLoading: false,
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
      const tempList = await fetchStockBySeller(this.userInfo.id)
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
    allSpacCount (specs) {
      const count = specs.reduce((a, b) => a + b.count, 0)
      return count
    },
    async handleUpdateEdit () {
      this.editLoading = true
      await updateStock(this.editItem.id, { spec: this.editItem.spec })
      this.$message.success('更新成功')
      this.editLoading = false
    },
    handleOpenEdit (id) {
      this.editItem = this.list.find(x => x.id === id)
      this.isEdit = true;
    },
    handleCloseEdit() {
      this.isEdit = false
      this.editItem = {}
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
  .spec-title{
    margin-bottom: .5rem;
    color: #6d6d6d;
  }
  .spec-item{
    padding: 8px 15px;
    background: #f3f3f3;
    color: #353535;
    margin-bottom: .5rem;
  }
  .spec-hr{
    border-color: white;
  }
</style>

