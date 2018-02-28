<template>
  <div class="stock-select">
    <span class="item-id" v-if="!edit" @click="edit = true">編號: {{stockData.value}}</span>
    <el-autocomplete v-else v-model="stockData.value" class="autocomplete" :fetch-suggestions="queryStock" @select="handleSelectStock" popper-class="autocomplete-view" placeholder="請輸入商品名稱">
      <template slot-scope="props">
        <div class="autocomplete-item">
          <div class="item-img" :style="`background-image:url(${props.item.data.img[0]})`"></div>
          <span>{{ props.item.name }}</span>
        </div>
      </template>
    </el-autocomplete>

    <div>
      <div class="autocomplete-item">
        <div class="item-img" :style="`background-image:url(${stockCard.img[0]})`"></div>
        <span v-if="stockCard.name">{{ stockCard.name }}</span>
        <div v-else class="hold"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { querySearch } from '@/api/search'
import { fetchStock } from '@/api/stock'

export default {
  props: ['propData'],
  data() {
    return {
      stockData: {
        value: undefined,
        name: undefined,
        data: {}
      },
      stockCard: {
        img: [''],
        name: ''
      },
      edit: false
    }
  },
  async created() {
    if (this.propData) {
      try {
        const res = await fetchStock(this.propData)
        this.stockCard = res
        this.stockData.value = res.id
      } catch (error) {
        this.stockCard = { img: [''], name: '' }
        this.stockData.value = undefined
        this.edit = true
        console.log(error)
      }
    }
  },
  methods: {
    async handleSelectStock(item) {
      this.stockCard = item.data
      this.$emit('input', item.value)
    },
    async queryStock(queryString, cb) {
      if (!queryString) return cb()
      const items = []
      const list = await querySearch(queryString)
      list.data.stock.map(x => {
        items.push({ value: x.id || x._id, name: x.name, data: x })
      })
      cb(items)
    }
  }
}
</script>


<style lang="scss">
  .stock-select{
    .item-id{
      display: block;
      color: #606266;
    }
    .autocomplete{
      width: 100%;
      .el-input > input {
        border: 0;
        border-bottom: 1px solid #ccc;
        border-radius: 0;
        padding: .8rem 0;
        height: 1rem !important;
      }
    }
  }
  
  .autocomplete-view{
    min-width: 15rem;
    width: 30vw !important;

    .el-scrollbar > .el-scrollbar__wrap{
      max-height: 50vh !important;
    }
  }
  
  .autocomplete-item{
    display: flex;
    align-items: center;
    margin: .5rem 0;

    span{
      white-space: pre-line;
      line-height: 1rem;
      font-size: .8rem;
      flex: 1;
    }

    .item-img{
      width: 4rem;
      height: 4rem;
      margin-right: .5rem;
      background-color: #e8e8e8;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .hold{
      width: 50%;
      height: 4rem;
      background-color: #e8e8e8;
    }
  }
</style>