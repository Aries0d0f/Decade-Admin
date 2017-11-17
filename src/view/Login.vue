<template>
  <div id="login">
    <div class="container">
      <div id="logo"><img src="../assets/images/Decade_logo_toggle.png" alt=""></div>
      <h2>後台管理系統 - 登入</h2>
      <div class="content">
        <div class="msg" v-if="msg"><span>{{ msg }}</span></div>
        <div class="action">
          <input type="text" placeholder="Username" v-model="user.username">
          <input type="password" placeholder="Password" v-model="user.pwd">
          <div class="button" @click="login()"><span>Go</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const md5 = require('js-md5')
  export default {
    data() {
      return {
        user: {
          username: '',
          pwd: ''
        },
        msg: ''
      }
    },
    methods: {
      login() {
        if (this.username !== '' && this.pwd !== '') {
          this.$http.post(`/api/user`, {
            username: this.user.username,
            pwd: md5(this.user.pwd)
          })
          .then(
            (res) => {
              let data = res.data
              switch (true) {
                case data.result === -1:
                  this.msg = 'Username or pwd was incorrect.'
                  break
                case data.result === 0:
                  this.$http.put(`/api/user/${data.uid}`, { token: md5(`TOKEN=${new Date().toString()}${data.uid}`) })
                  this.$store.commit('SET_USER', data)
                  this.$cookie.set('token', md5(`TOKEN=${new Date().toString()}${data.uid}`), { domain: window.location.hostname, expires: '10m' })
                  this.$router.push({ name: 'Home' })
              }
            }
          )
        } else {
          this.msg = 'Username and password shoud not be blank.'
        }
      }
    }
  }
</script>