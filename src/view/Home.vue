<template>
  <div id="home">
    <div class="profile">
      <div class="photo" v-if="user.meta"><img :src="user.meta.photo" alt=""></div>
      <div class="content">
        <p>{{ user.username }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters([ 'user' ])
    }
  }
</script>