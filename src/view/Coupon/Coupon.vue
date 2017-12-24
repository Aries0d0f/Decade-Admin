<template>
  <div>
    <div class="form">
      <div class="form-item">
        <p>名稱</p>
        <input type="text" :value="coupon.name">
      </div>
      <div class="form-item">
        <p>是否與其他優惠券併用</p>
        <input type="checkbox" :value="coupon.combine">
      </div>
      <div class="form-item">
        <p>折價類型</p>
        <select v-model="coupon.discount.type">
          <option value="0">折價</option>
          <option value="1">折%數</option>
        </select>
        <input type="text" required :value="coupon.discount.amount">
      </div>
      <div class="form-item">
        <p>代碼</p>
        <input type="text" required="required" :value="coupon.code">
        <button class="newCode" @click="generateCode">產生代碼</button>
      </div>
      <div class="form-item">
        <p>條件規則</p>
        <select v-model="coupon.require.type">
          <option value="0">AND</option>
          <option value="1">OR</option>
          <option value="2">無</option>
        </select>
      </div>
      <template v-if="coupon.require.type != 2">
        <div class="form-item">
          <p>每產品使用數量</p>
          <input type="text" :value="coupon.require.limitItemsCount" >
        </div>
        <div class="form-item">
          <p>低消</p>
          <input type="text" :value="coupon.require.limitMinPrice" >
        </div>
        <div class="form-item">
          <p>每人使用數量</p>
          <input type="text" :value="coupon.require.limitPerUser" >
        </div>
      </template>
      <div class="form-item">
        <p>使用總數</p>
        <input type="text" :value="coupon.count">
      </div>
    </div>
    <input type="submit" class="submit-btn" value="送出" />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        coupon: {
          name: '',
          code: '',
          combine: false,
          count: 0,
          require: {
            type: 2,
            limitItems: [],
            limitItemsCount: -1,
            limitMinPrice: -1,
            limitPerUser: -1
          },
          discount: {
            type: 0,
            amout: 0
          }
        }
      }
    },
    async created() {
      if (this.$route.name === 'Coupon-ID') {
        const coupon = await this.getCoupon(this.$route.params.id)
        this.coupon = coupon
      }
    },
    methods: {
      ...mapActions(['getCoupon']),
      generateCode() {
        this.coupon.code = Math.random().toString(36).substring(7)
      }
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
    align-items: center;
    margin-bottom: 1rem;
    font-size: 14px !important;

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
</style>

