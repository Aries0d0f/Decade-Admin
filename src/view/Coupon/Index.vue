<template>
  <div class="page-view">
    <h2>{{ $route.meta.title }}</h2>
    <router-view class="container"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'Coupon-Page'
  }
</script>

<style lang="scss" scoped>
  .page-view{
    min-height: 100vh;
    margin-left: 20rem;
    width: 100vw;
  }
  h2{
    margin: 30px 0 15px 30px;
    font-weight: 700;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  .container{
    margin: 30px;
  }
</style>
