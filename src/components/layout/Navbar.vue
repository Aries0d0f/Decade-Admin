<template>
  <div id="nav">
    <div class="profile">
      <div class="photo" :style="{ background: `url(${user.meta ? user.meta.photo : require('../../assets/images/icon/user.svg')})`}"></div>
      <div class="content">
        <h1>{{ user.username }}</h1>
        <p class="tag">{{ role[user.role] }}</p>
      </div>
    </div>
    <div class="menu">
      <ul>
        <li><router-link to="/posts/new">新增文章</router-link></li>
        <li><router-link to="/posts">文章管理</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        role: ['使用者', '編輯', '廠商', '管理員', 'superuser']
      }
    },
    computed: {
      ...mapGetters([ 'user' ])
    }
  }
</script>
