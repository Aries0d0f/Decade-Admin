<template>
  <div class="stock-select">
    <span class="item-id" v-if="!edit" @click="edit = true">編號: {{postData.value}}</span>
    <el-autocomplete v-else v-model="postData.value" class="autocomplete" :fetch-suggestions="queryStock" @select="handleSelectStock" popper-class="autocomplete-view" placeholder="請輸入商品名稱">
      <template slot-scope="props">
        <div class="autocomplete-item">
          <span><svg-icon icon-class="people"></svg-icon> {{ props.item.username }} - {{ props.item.role | UserRoleLabel }}</span>
        </div>
      </template>
    </el-autocomplete>

    <div>
      <div class="autocomplete-item">
        <span v-if="userCard.username">{{ userCard.role | UserRoleLabel }} - {{ userCard.username }}</span>
        <div v-else class="hold"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUserQuery, fetchUser } from '@/api/user'

export default {
  props: ['propData'],
  data() {
    return {
      postData: {
        value: undefined,
        role: undefined,
        username: undefined,
        data: {}
      },
      userCard: {
        username: '',
        role: ''
      },
      edit: false
    }
  },
  async created() {
    if (this.propData) {
      try {
        const res = await fetchUser(this.propData)
        this.userCard = res
        this.postData.value = res.id
      } catch (error) {
        this.userCard = { username: '', role: '' }
        this.postData.value = undefined
        this.edit = true
      }
    }
  },
  methods: {
    async handleSelectStock(item) {
      this.userCard = item.data
      this.edit = false
      this.$emit('input', item.value)
    },
    async queryStock(queryString, cb) {
      if (!queryString) return cb()
      const items = []
      const list = await fetchUserQuery(`where={"username":["${queryString}"]}`)
      list.map(x => {
        items.push({ value: x.id || x._id, username: x.username, role: x.role, data: x })
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
      margin-bottom: .5rem;
    }
    .autocomplete{
      width: 100%;
      .el-input > input {
        color: #606266;
        border: 0;
        border-bottom: 1px solid #ccc;
        border-radius: 0;
        line-height: 1rem !important;
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
