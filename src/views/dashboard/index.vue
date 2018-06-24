<template>
  <div class="dashboard-container">
    <h2>歡迎, {{userInfo.udata.name}}</h2>
    <p>目前的權限為: {{userInfo.role | UserRoleLabel}}</p>
    <div class="views" v-if="!loading">
      <Vendor v-if="userInfo.role === 3 || userInfo.role === 0"></Vendor>
      <Editor v-if="userInfo.role === 4 || userInfo.role === 0"></Editor>
    </div>
  </div>
</template>
 
<script>
import { mapGetters } from 'vuex'
import Vendor from './vendor/index'
import Editor from './editor/index'

export default {
  name: 'dashboard',
  components: { Vendor, Editor },
  data() {
    return {
      loading: true
    }
  },
  async created() {
    if (this.userInfo.id) {
      this.loading = false
    }
  },
  watch: {
    async 'userInfo.id'(val) {
      this.loading = false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>
 
<style lang="scss" scoped>
  .dashboard-container{
    margin: 1rem;

    .views{
      margin: 1rem 1.5rem;
    }
  }
</style>
 