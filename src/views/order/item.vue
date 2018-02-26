<template>
  <div class="app-container">
    <h3 class="table-title">訂單資訊詳情</h3>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <el-row class="table-row">
              <el-col :span="4" class="table-label">訂單編號</el-col>
              <el-col :span="20" class="table-content">{{data.id}}</el-col>
            </el-row>
            <el-row class="table-row">
              <el-col :span="4" class="table-label">成立日期</el-col>
              <el-col :span="20" class="table-content">{{data.timestamp | LocalTime}}</el-col>
            </el-row>
            <el-row class="table-row">
              <el-col :span="4" class="table-label">出貨日期</el-col>
              <el-col :span="20" class="table-content">{{data.payment.expire | LocalTime}}</el-col>
            </el-row>
            <el-row class="table-row">
              <el-col :span="4" class="table-label">訂單總額</el-col>
              <el-col :span="20" class="table-content">{{data.price.orderTotal | LocalePrice}}</el-col>
            </el-row>
            <el-row class="table-row">
              <el-col :span="4" class="table-label">付款方式</el-col>
              <el-col :span="20" class="table-content">
              </el-col>
            </el-row>
            <el-row class="table-row">
              <el-col :span="4" class="table-label">收件人資訊</el-col>
              <el-col :span="20" class="table-content">
                <div>{{data.receiver.name}}</div>
                <div>{{data.receiver.phone}}</div>
                <div>{{data.receiver.mail}}</div>
                <div>{{data.receiver.address}}</div>
              </el-col>
            </el-row>
            <el-row class="table-row">
              <el-col :span="4" class="table-label">訂單備註</el-col>
              <el-col :span="20" class="table-content">{{data.comment}}</el-col>
            </el-row>
            <el-row class="table-row">
              <el-col :span="4" class="table-label">訂單狀況</el-col>
              <el-col :span="20" class="table-content">{{filterStatus(data.status)}}</el-col>
            </el-row>
            <el-row class="table-row">
              <el-col :span="4" class="table-label">運單號</el-col>
              <el-col :span="20" class="table-content">{{data.logisticCode}}</el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <el-table :data="stocks" v-if="stocks.length > 0" stripe style="width: 100%" header-row-style="background-color: #ebeef5;">
              <el-table-column align="left" prop="id" label="商品編號" width="220"></el-table-column>
              <el-table-column align="left" prop="name" label="品名"></el-table-column>
              <el-table-column align="center" prop="count" label="數量" width="100"></el-table-column>
            </el-table>
            <el-table :data="tickets" v-if="tickets.length > 0" stripe style="margin-top:1rem;width: 100%" header-row-style="background-color: #ebeef5;">
              <el-table-column align="left" prop="id" label="票券編號" width="220"></el-table-column>
              <el-table-column align="left" prop="name" label="品名"></el-table-column>
              <el-table-column align="center" prop="price" label="金額" width="100"></el-table-column>
              <el-table-column align="center" prop="code" label="代碼" width="100"></el-table-column>
            </el-table>
            
            <div class="actions">
              <el-button v-if="data.status === 0" type="info" disabled>等待付款</el-button>
              <el-button v-if="data.status === 1 && !data.logisticCode" @click="handleSetLogisticCode" type="warning">填寫運單號</el-button>
              <el-button v-if="data.status === 1 && data.logisticCode" @click="handleSetLogisticCode" type="warning">更改運單號</el-button>
              <el-button v-if="data.status === 1 && userInfo.role === 0" @click="handleShipping" type="warning">出貨</el-button>
              <el-button v-if="data.status === 2" type="info" disabled>已出貨</el-button>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchOrder, updateOrder } from '@/api/order'
  import { fetchStock } from '@/api/stock'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Order-Item',
    data() {
      return {
        data: {},
        stocks: [],
        tickets: [],
        coupon: [],
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
      await this.getDate()
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    filters: {
      LocalePrice(price) {
        return price.toLocaleString()
      },
      LocalTime(time) {
        return new Date(time).toISOString().substr(0, 10)
      }
    },
    methods: {
      async getDate() {
        const data = await fetchOrder(this.$route.params.id)
        const coupons = []
        if (data.content.stock && data.content.stock.length > 0) {
          const stocks = []
          data.content.stock.map(async item => {
            const stock = await fetchStock(item.sid)
            stocks.push({ ...stock, count: item.count })
          })
          this.stocks = stocks
        }
        if (data.content.ticket && data.content.ticket.length > 0) {
          const tickets = []
          data.content.ticket.map(async item => {
            const ticket = await fetchStock(item.tid)
            tickets.push({ ...ticket, used: item.used, code: item.code })
          })
          this.tickets = tickets
        }
        this.data = data
        this.coupons = coupons
      },
      async handleSetLogisticCode() {
        try {
          const { value: logisticCode } = await this.$prompt('請輸入運單號', '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            // inputPattern: [0-9],
            inputErrorMessage: '運單格式有誤！'
          })
          await updateOrder(this.data.id, { logisticCode })
          this.data.logisticCode = logisticCode
          this.$notify({ title: '成功', message: '運單編號新增成功', type: 'success', duration: 1000 })
        } catch (error) {
          console.log(error)
        }
      },
      async handleShipping() {
        if (!this.data.logisticCode) {
          this.$message.error('請先輸入運單號後在進行出貨')
          return
        }
        try {
          await this.$confirm('請確認是否已將商品出貨?', '提示', { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' })
          await updateOrder(this.data.id, { status: 2 })
          this.data.status = 2
          this.$notify({ title: '成功', message: '出貨成功', type: 'success', duration: 1000 })
        } catch (err) {
          console.log(err)
        }
      },
      filterStatus(status) {
        return this.statusType.filter(x => status === x.key)[0].label
      }
    }
  }
</script>

<style lang="scss" scoped>
  .table-row{
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    font-size: .9rem;

    &:nth-of-type(1) {
      margin-top: 1rem;
    }
  }

  .table-title{
    font-weight: normal;
    letter-spacing: 2px;
    &:after{
      content: '';
      height: 3px;
      width: 3rem;
      margin-top: .5rem;
      background: #b27536;
      display: block;
    }
  }

  .actions{
    margin-top: 1rem;
    display: flex;
    align-items: right;
    justify-content: flex-end;
    button{
      letter-spacing: 2px;
      padding: 1rem 2rem;
    }
  }
</style>

