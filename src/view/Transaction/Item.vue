<template>
  <div>
    <div class="form">
      <div class="form-item">
        <p>訂單編號</p>
        <p>{{order.id}}</p>
      </div>
      <div class="form-item">
        <p>訂單日期</p>
        <p>{{new Date(order.createdAt).toISOString().substr(0, 10)}}</p>
      </div>
      <div class="form-item">
        <p>購買人</p>
        <p>{{order.buyer}}</p>
      </div>
      <div class="form-item">
        <p>訂單金額</p>
        <div class="form-item-detail">
          <div>運費<span>{{order.price.trans}}</span></div>
          <div>優惠<span>{{order.price.discount}}</span></div>
          <div>商品總計<span>{{order.price.itemTotal}}</span></div>
          <div>訂單總計<span>{{order.price.orderTotal}}</span></div>
        </div>
      </div>
      <div class="form-item">
        <p>收件人</p>
        <div class="form-item-detail">
          <div>姓名<span>{{order.receiver.name}}</span></div>
          <div>手機<span>{{order.receiver.phone}}</span></div>
          <div>地址<span>{{order.receiver.address}}</span></div>
          <div>電子信箱<span>{{order.receiver.email}}</span></div>
        </div>
      </div>
      <div class="form-item">
        <p>收件人</p>
        <div class="form-item-detail">
          <div>姓名<span>{{order.receiver.name}}</span></div>
          <div>手機<span>{{order.receiver.phone}}</span></div>
          <div>地址<span>{{order.receiver.address}}</span></div>
          <div>電子信箱<span>{{order.receiver.email}}</span></div>
        </div>
      </div>
      <div class="form-item">
        <p>訂購商品</p>
        <div class="form-item-detail">
          <template v-for="stock in order.content.stock">
            <div>商品ID<span>{{stock.sid.substr(0, 15) + '...'}}</span></div>
            <div>數量<span>{{stock.count}}</span></div>
          </template>
        </div>
      </div>
      <div class="form-item">
        <p>訂購票券</p>
        <div class="form-item-detail">
          <template v-for="ticket in order.content.ticket">
            <div>商品ID<span>{{ticket.sid.substr(0, 15) + '...'}}</span></div>
            <div>數量<span>{{ticket.count}}</span></div>
          </template>
        </div>
      </div>
    </div>
    <!-- <input type="submit" class="submit-btn" @click="handleSubmit" value="送出" :disabled="loading" /> -->
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        loading: false,
        order: {}
      }
    },
    async created() {
      this.order = await this.getOrder(this.$route.params.id)
    },
    watch: {
      $route: function () {
        this.getOrder()
      }
    },
    methods: {
      ...mapActions(['getOrder'])
    }
  }
</script>

<style lang="scss" scoped>
  .form{
    padding: 2rem;
    background: #fff;
    border: 1px solid #e0e0e0;
    margin-bottom: 1rem;
  }

  .form-item{
    display: flex;
    align-items: baseline;
    margin-bottom: 1rem;
    font-size: 15px !important;

    p{
      width: 6rem;
      letter-spacing: 0px;
    }

    input, select{
      margin-left: 1rem;
      padding: .5rem 1rem;
      border: 1px solid #ccc;
      letter-spacing: 0px;
      border-radius: 5px;
    }

    .newCode{
      cursor: pointer;
      padding: .5rem;
      margin-left: 1rem;
      border: 0;
      color: #fff;
      background: #b27536;
    }
  }

  .submit-btn{
    cursor: pointer;
    padding: 1rem 2rem;
    border: 0;
    color: #fff;
    background: #b27536;
  }

  .form-item-detail{
    div{
      margin: .5rem;
      display: flex;
      justify-content: space-between;
      width: 20vw;
    }
    span{
      letter-spacing: 0;
    }
  }
</style>

