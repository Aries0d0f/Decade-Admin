<template>
  <div id="home">
    <Navbar></Navbar>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Navbar } from '../components/layout'
  export default {
    components: {
      Navbar
    },
    computed: {
      ...mapGetters([ 'user' ])
    }
  }
</script>