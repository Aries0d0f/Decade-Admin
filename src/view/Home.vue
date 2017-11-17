<template>
  <div id="home">
    <div class="profile">
      <div class="photo"><img :src="user.meta.photo" alt=""></div>
      <div class="content">
        <h1>{{ user.meta.fullname.firstname}} {{ user.meta.fullname.lastname}}</h1>
        <p>@{{ user.username }}</p>
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