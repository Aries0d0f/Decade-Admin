<template>
  <el-card class="related-stock-card">
    <div slot="header" class="clearfix">
      <span>推薦商品串聯</span>
    </div>
    <el-form-item
      v-for="(i, index) in relatedItems"
      :key="index"
    >
      <el-autocomplete v-model="i.key" class="autocomplete" :fetch-suggestions="queryStock" @select="handleSelectStock" popper-class="autocomplete-view" placeholder="請輸入商品名稱">
        <template slot-scope="props">
          <div class="autocomplete-item">
            <div class="item-img" :style="`background-image:url(${props.item.data.img[0]})`"></div>
            <span>{{ props.item.name }}</span>
          </div>
        </template>
      </el-autocomplete>
      <el-button type="danger" size="mini" round icon="el-icon-delete" @click.prevent="removeDomain(i)"></el-button>
      <div v-if="i.data">
        <div class="autocomplete-item">
          <div class="item-img" :style="`background-image:url(${i.data.img[0]})`"></div>
          <span>{{ i.data.name }}</span>
        </div>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button @click="addDomain">新增商品</el-button>
      <span>(已輸入 {{relatedItems.length || 0}} 組，還可以增加 {{ 6 - relatedItems.length || 0}} 組)</span>
    </el-form-item>
  </el-card>
</template>

<script>
import { querySearch } from '@/api/search'
import { fetchStock } from '@/api/stock'

export default {
  props: ['idList'],
  data() {
    return {
      relatedItems: []
    }
  },
  async created() {
    if (this.idList) {
      this.idList.forEach(async x => {
        const data = await fetchStock(x)
        this.relatedItems.push({ key: x, data: { name: data.name, price: data.price, img: data.img }})
      })
    }
  },
  methods: {
    async handleSelectStock(item) {
      const i = this.relatedItems.map(x => x.key).indexOf(item.value)
      this.relatedItems[i].data = item.data
    },
    async queryStock(queryString, cb) {
      if (!queryString) return cb()
      const items = []
      const list = await querySearch(queryString)
      list.data.stock.map(x => {
        items.push({ value: x.id || x._id, name: x.name, price: x.price, data: x })
      })
      cb(items)
    },
    removeDomain(item) {
      var index = this.relatedItems.indexOf(item)
      if (index !== -1) {
        this.relatedItems.splice(index, 1)
      }
    },
    addDomain() {
      if (this.relatedItems.length > 5) {
        return
      }
      this.relatedItems.push({ key: '' })
    }
  }
}
</script>

<style lang="scss">
  .related-stock-card{
    .autocomplete{
      width: calc(100% - 8rem);
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
  }
</style>