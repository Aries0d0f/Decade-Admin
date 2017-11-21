<template>
  <div id="home">
    <Navbar></Navbar>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Navbar } from '../components/layout'
  export default {
    components: {
      Navbar
    },
    computed: {
      ...mapGetters([ 'user' ]),
      ...mapGetters([ 'allpost' ])
    },
    created: function () {
      this.getPosts()
    },
    mounted: function () {
      this.getPosts()
    },
    methods: {
      ...mapActions([ 'allPost' ]),
      getPosts () {
        this.$http.get(`/api/post`)
        .then(
          res => {
            let index = res.data.data.length - 1
            let data = res.data.data
            data.forEach(e => {
              this.allpost[index--] = e
            })
          }
        )
      }
    }
  }
</script>