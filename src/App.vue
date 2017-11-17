<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([ 'user' ])
  },
  mounted () {
    if (this.$cookie.get('token')) {
      this.$http.get(`/api/user/${this.$cookie.get('token')}`)
      .then(
        res => {
          let data = res.data
          if (data.result === 0) {
            this.$store.commit('SET_USER', data)
            this.$router.push({ name: 'Home' })
          } else {
            this.$router.push({ name: 'Login' })
          }
        }
      )
    }
    if (Object.keys(this.user).length === 0 || !(this.user.result === 0)) {
      this.$router.push({ name: 'Login' })
    } else {
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style lang="scss">
  @import "./assets/scss/main.scss";
</style>