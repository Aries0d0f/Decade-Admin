<template>
  <div class="posts">
    <div class="list">
      <h1>文章管理</h1>
      <div class="list-container">
        <div class="table">
          <div class="column title">
            <div><p>文章標題</p></div>
            <div><p>作者</p></div>
            <div><p>內容概覽</p></div>
            <div><p>動作</p></div>
          </div>
          <div class="column" v-for="post in allpost">
            <div><p>{{ `${post.title.slice(0,17)}${post.title.split('').length > 18 ? '...' : '' }` }}</p></div>
            <!-- <p>{{ post.author }}</p> -->
            <div><p>decade</p></div>
            <div><p>{{ `${post.content.split('>')[1].slice(0,17).split('<')[0]}...` }}</p></div>
            <div><p @click="openLink(`http://60.249.179.125/magazine/${post._id}`)"><font-awesome-icon icon="eye" /><span>檢視</span></p><p @click="$router.push(`/posts/edit/${post._id}`)"><font-awesome-icon icon="edit" /><span>編輯</span></p><p @click="deletePost(post._id)"><font-awesome-icon icon="minus-circle" /><span>刪除</span></p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([ 'user' ]),
    ...mapGetters([ 'allpost' ])
  },
  methods: {
    openLink (link) {
      window.open(link)
    },
    deletePost (pid) {
      var ans = confirm('確定要刪除這篇文章？此動作不可回復')
      if (ans) {
        this.$http.delete(`/api/post/${pid}`)
          .then(
            res => {
              if (res.data.result) {
                console.log(res)
              } else {
                window.location = '/posts'
              }
            }
          )
      }
    }
  }
}
</script>

