<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
  // import { mapActions } from 'vuex'
  export default {
    name: 'APP',
    async created() {
      // await this.checkUser()
    },
    watch: {
      $route: async function() {
        // await this.checkUser()
      }
    },
    methods: {
      // ...mapActions(['checkAuth']),
      // async checkUser() {
      //   if (this.$route.meta.auth === false) return
      //   const isLogin = await this.checkAuth()
      //   if (!isLogin) {
      //     this.$router.push({ name: 'login' })
      //   }
      // }
    }
  }
</script>
