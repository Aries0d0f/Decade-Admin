<template>
  <div id="nav">
    <div class="profile">
      <div class="photo" v-if="user.meta"><img :src="user.meta.photo" alt=""></div>
      <div class="content">
        <p>{{ role[user.role] }} {{ user.username }}</p>
      </div>
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
