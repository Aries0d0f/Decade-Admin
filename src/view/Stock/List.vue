<template>
  <div class="posts">
    <div class="list">
      <h1>商品管理</h1>
      <div class="list-container">
        <div class="table">
          <div class="column title">
            <div><p>商品</p></div>
            <div><p>廠商</p></div>
            <div><p>內容概覽</p></div>
            <div><p>動作</p></div>
          </div>
          <div class="column" v-for="post in stock">
            <div><p>{{ `${post.name.slice(0,17)}${post.name.split('').length > 18 ? '...' : '' }` }}</p></div>
            <!-- <p>{{ post.author }}</p> -->
            <div><p>decade</p></div>
            <div><p>{{ `${JSON.parse(post.info).discription.split('>')[1].slice(0,17).split('<')[0]}...` }}</p></div>
            <div><p @click="openLink(`http://60.249.179.125/shop/${post.id}`)"><font-awesome-icon icon="eye" /><span>檢視</span></p><p><font-awesome-icon icon="edit" /><span>編輯</span></p><p @click="deletePost(post.id)"><font-awesome-icon icon="minus-circle" /><span>刪除</span></p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      stock: []
    }
  },
  computed: {
    ...mapGetters([ 'user' ])
  },
  created () {
    this.getStock()
  },
  methods: {
    getStock () {
      this.$http.get(`http://60.249.179.125:1337/stock`)
      .then(res => {
        this.stock = res.data
      })
    },
    openLink (link) {
      window.open(link)
    },
    deletePost (pid) {
      var ans = confirm('確定要刪除這項商品？此動作不可回復')
      if (ans) {
        this.$http.delete(`http://60.249.179.125:1337/stock/${pid}`)
          .then(
            res => {
              if (res.data.result) {
                console.log(res)
              } else {
                window.location = '/stock'
              }
            }
          )
      }
    }
  }
}
</script>

