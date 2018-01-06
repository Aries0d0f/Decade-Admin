<template>
  <div class="app-container calendar-list-container">
    <h3 class="form-title">最新訂單</h3>
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" header-row-style="background-color: #ebeef5;" empty-text="查無資料" element-loading-text="載入中..." fit style="width: 100%">
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
            {{item.sid}} x {{item.count}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金額" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.price.orderTotal | LocalePrice}}</span>
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
          <el-button type="success" size="mini">出貨</el-button>
          <el-button type="primary" size="mini">查看</el-button>
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
        :page-sizes="30" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchOrderList } from '@/api/order'
// import { fetchStock } from '@/api/stock'

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
        limit: 20,
        status: undefined,
        date: '',
        id: undefined,
        type: undefined,
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
  filters: {
    LocalePrice(price) {
      return price.toLocaleString()
    },
    LocalTime(time) {
      return new Date(time).toISOString().substr(0, 10)
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const list = await fetchOrderList()
      this.total = list.length
      // list.map((item, i) => {
      //   item.content.stock.map(async(stock, j) => {
      //     list[i].content.stock[j].data = await fetchStock(stock.sid)
      //   })
      // })
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

