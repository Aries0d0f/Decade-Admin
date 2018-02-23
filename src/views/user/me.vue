<template>
  <UserForm v-if="userInfo.cid" :cid="userInfo.cid"></UserForm>
</template>

<script>
import { mapGetters } from 'vuex'
import UserForm from './components/udataForm'

export default {
  name: 'EditPost',
  computed: {
    ...mapGetters(['userInfo'])
  },
  components: { UserForm }
}
</script>

