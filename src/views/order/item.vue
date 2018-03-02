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
              <el-col :span="20" class="table-content">
                <div v-for="(item, i) in data.logisticCode" :key="i" style="margin-bottom:.5rem;">
                  {{item.name}} - {{item.code}}
                  <div>{{item.comment}}</div>
                </div>
              </el-col>
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
              <el-button v-if="data.status === 1 && !data.logisticCode" @click="dialogVisible = true" type="warning">填寫運單號</el-button>
              <el-button v-if="data.status === 1 && data.logisticCode" @click="dialogVisible = true" type="warning">更改運單號</el-button>
              <el-button v-if="data.status === 1 && userInfo.role === 0" @click="handleShipping" type="warning">出貨</el-button>
              <el-button v-if="data.status === 2" type="info" disabled>已出貨</el-button>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-collapse class="spec-collapse">
        <el-form :model="logisticCode" ref="logisticCode">
          <el-form-item
            v-for="(item, index) in logisticCode"
            v-model="logisticCode"
            :key="index"
            style="margin-left: 1rem;"
          >
            <el-collapse-item :title="`出貨單號 #${index + 1}`" :name="index">
                
              <el-select
                v-model="item.name"
                filterable
                allow-create
                default-first-option
                placeholder="請輸入運送方式"
                style="margin-bottom:.5rem;">
                <el-option v-for="item in defalutLogistic" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-input v-model="item.code" style="margin-bottom:.5rem;" placeholder="請輸入運單號"></el-input>
              <el-input type="textarea" v-model="item.comment" style="margin-bottom:.5rem;" placeholder="請輸入備註"></el-input>

              <el-button type="danger" class="delete-btn" icon="el-icon-delete" @click.prevent="removeSpec(index)"></el-button>
            </el-collapse-item>
          </el-form-item>
        </el-form>
      </el-collapse>
      <el-button @click="addSpec">新增其他</el-button>     

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetLogisticCode">確 定</el-button>
      </span>
    </el-dialog>
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
        dialogVisible: false,
        defalutLogistic: [
          { value: '黑貓', label: '黑貓' },
          { value: '新竹貨運', label: '新竹貨運' },
          { value: '宅配通', label: '宅配通' },
          { value: '嘉里大榮', label: '嘉里大榮' }
        ],
        logisticCode: [{
          name: '',
          code: '',
          comment: ''
        }],
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
      await this.getData()
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
      async getData() {
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
        this.logisticCode = data.logisticCode
        this.coupons = coupons
      },
      async handleSetLogisticCode() {
        try {
          // if (!this.logisticCode.code || !this.logisticCode.name) {
          //   this.$message.error('請輸入正確資料')
          //   return
          // }
          await updateOrder(this.data.id, { logisticCode: this.logisticCode })
          this.$notify({ title: '成功', message: '運單編號新增成功', type: 'success', duration: 1000 })
          this.dialogVisible = false
          await this.getData()
        } catch (error) {
          console.log(error)
        }
      },
      addSpec() {
        if (!this.logisticCode) {
          this.logisticCode = []
        }
        this.logisticCode.push({
          name: '',
          code: '',
          comment: ''
        })
      },
      removeSpec(index) {
        this.logisticCode.splice(index, 1)
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

