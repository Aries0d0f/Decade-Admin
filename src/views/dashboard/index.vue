<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole"></component> -->
    <h2>歡迎, {{userInfo.username}}</h2>
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
