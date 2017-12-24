<template>
  <div class="order-list">
    <div class="order-container">
      <div class="row list-title">
        <div class="col">名稱</div>
        <div class="col">使用總數</div>
        <div class="col">類型</div>
        <div class="col">代碼</div>
        <div class="col">動作</div>
      </div>
      <div v-if="allOrder.length === 0" class="no-result">查無資料</div>
      <!-- <div class="row list-body" v-for="coupon in allOrder" :key="coupon.id">
        <div class="col">{{coupon.name}}</div>
        <div class="col">{{coupon.count}}</div>
        <div class="col">{{coupon.discount.type === 0 ? '折價' : '折%數'}}</div>
        <div class="col">{{coupon.code}}</div>
        <div class="col">
          <div class="list-btn">
            <router-link :to="{ name: 'Order-ID', params: { id: order.id } }" tag="p">
              <font-awesome-icon icon="edit" /> 查看
            </router-link>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters([ 'allOrder' ])
  },
  async created() {
    await this.getAllOrder()
  },
  methods: {
    ...mapActions(['getAllOrder'])
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


