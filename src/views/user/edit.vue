<template>
  <Detail :is-edit="true" :cid="$route.params.id"></Detail>
</template>

<script>
import Detail from './components/udataForm'

export default {
  name: 'EditUserData',
  components: { Detail }
}
</script>

