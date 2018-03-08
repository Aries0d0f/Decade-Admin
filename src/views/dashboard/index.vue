<template>
  <div class="dashboard-container">
    <h2>歡迎, {{userInfo.udata.name}}</h2>
    目前的權限為: {{userInfo.role | UserRoleLabel}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container{
    margin: 1rem;
  }
</style>
