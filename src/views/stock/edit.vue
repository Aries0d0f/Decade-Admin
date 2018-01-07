<template>
  <Detail :is-edit='true'></Detail>
</template>

<script>
import Detail from './components/detail'

export default {
  name: 'StockEdit',
  components: { Detail }
}
</script>

