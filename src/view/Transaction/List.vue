<template>
  <div class="order-list">
    <div class="order-container">
      <div class="row list-title">
        <div class="col">日期</div>
        <div class="col">狀態</div>
        <div class="col">金額</div>
        <div class="col">動作</div>
      </div>
      
      <div v-if="allOrder.length === 0" class="no-result">查無資料</div>
      <div class="row list-body" v-for="order in allOrder" :key="order.id">
        <div class="col">{{formatDate(order.createdAt)}}</div>
        <div class="col">{{status[order.status]}}</div>
        <div class="col">{{order.price.orderTotal}}</div>
        <div class="col">
          <div class="list-btn">
            <router-link :to="{ name: 'TransactionItem', params: { id: order.id } }" tag="p">
              <font-awesome-icon icon="edit" /> 查看
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: true,
      status: ['已產生', '已付款', '已發貨', '訂單完成', '訂單失敗']
    }
  },
  computed: {
    ...mapGetters([ 'allOrder' ])
  },
  async created() {
    await this.getAllOrder()
  },
  methods: {
    ...mapActions(['getAllOrder']),
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
  .row{
    display: flex;
    justify-content: space-around;
  }

  .list-title{
    font-size: .9rem;
    color: #5d5d5d;
    background: #f5f7fa;
    font-weight: bold;
    border: 1px solid #f1f1f1;
  }

  .list-body{
    &:hover{
      background: #f5f7fa !important;
    }
    &:nth-of-type(odd){
      background: #fafafa;
    }
  }

  .no-result{
    padding: 1rem;
    border: 1px solid #f1f1f1;
    border-top: 0;
  }

  .col{
    width: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    // border-bottom: 1px solid #ccc;
  }

  .list-btn{
    display: flex;
    cursor: pointer;
    p{
      letter-spacing: 0;
      padding: 5px;
      font-size: .8rem;
      margin-right: 5px;
    }
  }
</style>


