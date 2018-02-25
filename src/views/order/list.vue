<template>
  <div class="app-container calendar-list-container">
    <h3 class="form-title">訂單管理</h3>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 250px;" class="filter-item" placeholder="訂單編號" v-model="listQuery.id"></el-input>
      <el-select clearable style="width: 120px" class="filter-item" v-model="listQuery.status" placeholder="訂單狀況">
        <el-option v-for="item in statusType" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        type="daterange"
        class="filter-item"
        style="width: 250px;"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        :default-value="new Date().toISOString().substr(0, 10)"
      >
      </el-date-picker>
      <el-button class="filter-item filter-search" type="info" icon="el-icon-search" @click="handleFilter">查詢</el-button>
    </div>
    <el-table :key='tableKey' :data="currentList.slice(pager.start, pager.end)" v-loading="listLoading" :header-row-style="{ 'background-color': '#ebeef5' }" empty-text="查無資料" element-loading-text="載入中..." fit style="width: 100%">
      <el-table-column align="center" label="訂單編號" width="220">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="日期" width="200">
        <template slot-scope="scope">
          <div>{{scope.row.timestamp | LocalTime}} 起</div>
          <div>{{scope.row.payment.expire | LocalTime}} 止</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="狀態" width="85">
        <template slot-scope="scope">
          <span>{{testFilter(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品" width="400">
        <template slot-scope="scope">
          <div v-for="item in scope.row.content.stock" :key="item.id">
            {{item.name}} x {{item.count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金額" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.price.orderTotal | LocalePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="狀態" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.status | OrderStatusLabel}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收件人" width="200">
        <template slot-scope="scope">
          <div>{{scope.row.receiver.name}}</div>
          <div>{{scope.row.receiver.phone}}</div>
          <div>{{scope.row.receiver.mail}}</div>
          <div>{{scope.row.receiver.address}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="備註" width="250">
        <template slot-scope="scope">
          <span>{{scope.row.comment}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="動作" width="240" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.status === 1" size="mini" @click="handleShipping(scope.row.id)">出貨</el-button>
          <el-button type="primary" size="mini" @click="$router.push({ name: 'orderItem', params: { id: scope.row.id } })">查看</el-button>
        </template>
      </el-table-column>
      
      <!-- <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{$t('table.draft')}}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="pagination-container">      
      <el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchOrderList, updateOrder } from '@/api/order'
import { fetchStockQuery } from '@/api/stock'

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
        sort: '+id'
      }
    }
  },
  filters: {
    LocalePrice(price) {
      return price.toLocaleString()
    },
    LocalTime(time) {
      return new Date(time).toISOString().substr(0, 10)
    },
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
    async getList() {
      this.listLoading = true
      this.currentList = []
      const list = await fetchOrderList()
      this.total = list.length
      if (list.length === 0) {
        this.currentList = []
        this.list = list
        this.listLoading = false
        return
      }
      const sidList = []
      list.map(async(item, i) => sidList.push(item.content.stock))
      const stockList = await this.queryStockIdList(sidList)
      list.map(async(item, i) => {
        item.content.stock.map((x, j) => {
          const stock = stockList.find(y => list[i].content.stock[j].sid === y.id)
          if (!stock) {
            list[i].content.stock[j].name = 'Unknown'
          }
          list[i].content.stock[j].name = stock.name
        })
      })
      this.currentList = list
      this.list = list
      this.listLoading = false
    },
    testFilter(status) {
      return this.statusType.filter(x => status === x.key)[0].label
    },
    async handleShipping(id) {
      try {
        await this.$confirm('請確認是否已將商品出貨?', '提示', { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' })
        await updateOrder(id, { status: 2 })
        this.$notify({ title: '成功', message: '出貨成功', type: 'success', duration: 1000 })
        await this.getList()
      } catch (err) {
        console.log(err)
      }
    },
    async queryStockIdList(list) {
      if (list.length === 0) return false
      const idList = [...(new Set(list))]
      let idArrStr = ''
      idList.map(x => {
        if (x.length > 0) {
          x.map(item => {
            idArrStr += `"${item.sid}",`
            return true
          })
        } else {
          idArrStr += `"${x[0].sid}",`
        }
        return
      })
      const res = await fetchStockQuery(`where={"id":[${idArrStr}""]}`)
      return res
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

  .filter-search{
    background: #ca8e4e;
    letter-spacing: 3px;
    opacity: 1;
    border: 0;
  }
</style>

