<template>
  <Detail :is-edit='false'></Detail>
</template>

<script>
import Detail from './components/detail'

export default {
  name: 'createPost',
  components: { Detail }
}
</script>

