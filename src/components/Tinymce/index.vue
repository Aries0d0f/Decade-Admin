<template>
  <div class="tinymce-container editor-container">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container">
     <editorImage  color="#20a0ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
      </div>
  </div>
</template>

<script>
import editorImage from './components/editorImage'

export default {
  name: 'tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return ['removeformat undo redo |  bullist numlist | outdent indent | forecolor | fullscreen code', 'formatselect bold italic blockquote | h2 p  media link | alignleft aligncenter alignright table']
      }
    },
    menubar: {
      default: ''
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date()
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
      }
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  methods: {
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar,
        menubar: this.menubar,
        plugins: 'advlist,autolink,code,paste,textcolor, colorpicker,fullscreen,link,lists,media,wordcount,imagetools,table',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['wpimg.wallstcn.com', 'wallstreetcn.com'],
        imagetools_toolbar: 'watermark',
        default_link_target: '_blank',
        block_formats: '段落=p;標題=h3',
        link_title: false,
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent({ format: 'raw' }))
          })
        }
      })
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    }
  },
  destroyed() {
    this.destroyTinymce()
  }
}
</script>

<style lang="scss">
  // .panel-body h1, .panel-body h2, .panel-body h3, .panel-body h4, .panel-body h5, .panel-body h6 {
  //   font-size: 18px;
  //   font-weight: 700;
  //   color: #e8e8e8;
  //   border-left: 5px solid #1478f0;
  //   padding-left: 10px;
  //   margin: 30px 0;
  // }

  .panel-body h3{
    border-left: 3px solid #b17536;
    padding-left: 1rem;
    font-size: 1.2rem;
    margin: 1rem 0;
    margin-right: auto;
  }

  .panel-body p{
    display: flex;
    width: 100%;
    margin: 1rem 0;
    line-height: 32px;
    text-align: justify;
    letter-spacing: 2px;
    text-justify: inter-ideograph;
    margin-right: auto;
    color: #6b6b6a;
  }
</style>


<style scoped lang="scss">
  .tinymce-container {
    position: relative
  }
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container {
    position: absolute;
    right: 15px;
    /*z-index: 2005;*/
    top: 18px;
  }
  .editor-upload-btn {
    display: inline-block;
  }
</style>
