<template>
  <div id="home">
    <Navbar></Navbar>
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