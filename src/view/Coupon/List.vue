<template>
  <div class="coupon-list">
    <div class="coupon-container">
      <div class="row list-title">
        <div class="col">名稱</div>
        <div class="col">使用總數</div>
        <div class="col">類型</div>
        <div class="col">代碼</div>
        <div class="col">動作</div>
      </div>
      <div v-if="allCoupon.length === 0" class="no-result">查無資料</div>
      <div class="row list-body" v-for="coupon in allCoupon" :key="coupon.id">
        <div class="col">{{coupon.name}}</div>
        <div class="col">{{coupon.count}}</div>
        <div class="col">{{coupon.discount.type === 0 ? '折價' : '折%數'}}</div>
        <div class="col">{{coupon.code}}</div>
        <div class="col">
          <div class="list-btn">
            <router-link :to="{ name: 'Coupon-ID', params: { id: coupon.id } }" tag="p">
              <font-awesome-icon icon="edit" /> 編輯
            </router-link>
            <p @click="handleDelete(coupon.id)"><font-awesome-icon icon="minus-circle" /> 刪除</p>
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
      loading: true
    }
  },
  computed: {
    ...mapGetters([ 'allCoupon' ])
  },
  async created() {
    await this.getAllCoupon()
  },
  methods: {
    ...mapActions(['getAllCoupon', 'destroyCoupon']),
    async handleDelete(id) {
      if (this.loading) return
      this.loading = true
      const check = confirm('確定要刪除？此動作不可回復')
      if (check) {
        await this.destroyCoupon(id)
        await this.getAllCoupon()
      }
      this.loading = false
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


