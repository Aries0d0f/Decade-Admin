<template>
  <div>
    <div class="editor-container">
      <tinymce :height=500 ref="editor" v-model="propsData"></tinymce>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  props: ['propsData'],
  components: { Tinymce }
}
</script>
