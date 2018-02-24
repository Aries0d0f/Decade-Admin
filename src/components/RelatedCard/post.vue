<template>
  <el-card class="related-post-card">
    <div slot="header" class="clearfix">
      <span>推薦文章串聯</span>
    </div>
    <el-form-item
      v-for="(i, index) in relatedItems"
      :key="index"
    >
      <el-autocomplete v-model="i.key" class="autocomplete" :fetch-suggestions="queryStock" popper-class="autocomplete-view" @select="handleSelectStock" placeholder="請輸入文章名稱">
        <template slot-scope="props">
          <div class="autocomplete-item">
            <div class="item-img" :style="`background-image:url(${props.item.data.meta.image})`"></div>
            <span>{{ props.item.title }}</span>
          </div>
        </template>
      </el-autocomplete>
      <el-button type="danger" size="mini" round icon="el-icon-delete" @click.prevent="removeDomain(i)"></el-button>
      <div v-if="i.data">
        <div class="autocomplete-item">
          <div class="item-img" :style="`background-image:url(${i.data.meta.image})`"></div>
          <span>{{ i.data.title }}</span>
        </div>        
      </div>
    </el-form-item>

    <el-form-item>
      <el-button @click="addDomain">新增文章</el-button>
      <span>(已輸入 {{relatedItems.length || 0}} 組，還可以增加 {{ 6 - relatedItems.length || 0}} 組)</span>
    </el-form-item>
  </el-card>
</template>

<script>
import { fetchPost } from '@/api/post'
import { querySearch } from '@/api/search'

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
        const data = await fetchPost(x)
        this.relatedItems.push({ key: x, data: { title: data.title, meta: { image: data.meta.image } }})
      })
    }
  },
  methods: {
    async queryStock(queryString, cb) {
      if (!queryString) return cb()
      const items = []
      const list = await querySearch(queryString)
      list.data.post.map(x => {
        items.push({ value: x.id || x._id, title: x.title, data: x })
      })
      cb(items)
    },
    async handleSelectStock(item) {
      const i = this.relatedItems.map(x => x.key).indexOf(item.value)
      this.relatedItems[i].data = item.data
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
  .related-post-card{
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