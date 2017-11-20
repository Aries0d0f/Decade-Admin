<template>
  <div class="posts">
    <div class="editor">
      <h1>新增文章</h1>
      <div class="editor-container">
        <input id="title" type="text" placeholder="標題" v-model="post.title">
        <div class="classBar">
          <ul>
            <li v-for="(types, i) in classType" @click="classSelect(types, i)"><span class="uppercase soli">{{ types }}</span></li>
          </ul>
        </div>
        <textarea name="" id="first" rows='10' placeholder="文章段落"></textarea>
        <div v-for="(html, i) in addHTML" class="blocks">
          <span class="icon" @click="addHTML.splice(i, 1)" v-if="onRemove"><font-awesome-icon icon="minus-circle" /></span><span class="block" :id="`block-${i}`" v-html="html"></span>
        </div>
      </div>
    </div>
    <div class="imgUpload" v-if="uploadFile">
      <div class="upload-container">
        <input type="file" name="upload" id="upload" accept="image/*" style="display:none" @change="handleFiles">
        <img class="preview" :src="image">
        <div class="button" v-if="!image" @click="img()">Select Image</div>
        <div class="button" v-if="image" @click="imgUpload()">Upload Image</div>
      </div>
    </div>
    <div class="toolbox">
      <ul>
        <li @click="addHTML.push(tools.subtitle)"><div>h2</div><div>副標題</div></li>
        <li @click="addHTML.push(tools.microtitle)"><div>h3</div><div>小標題</div></li>
        <li @click="addHTML.push(tools.paragraph)"><div><font-awesome-icon icon="paragraph" /></div><div>文章段落</div></li>
        <li @click="uploadFile = true"><div><font-awesome-icon icon="image" /></div><div>圖片</div></li>
        <li @click="addHTML.push(tools.subtitle)"><div><font-awesome-icon :icon="['fab', 'youtube']" /></div><div>影片嵌入</div></li>
        <li @click="addHTML.push(tools.subtitle)"><div><font-awesome-icon icon="list-ul" /></div><div>清單</div></li>
        <li @click="onRemove = !onRemove"><div><font-awesome-icon icon="times" /></div><div>刪除區塊</div></li>
        <li @click="preview"><div><font-awesome-icon icon="eye" /></div><div>預覽</div></li>
        <li @click="onRemove = !onRemove"><div><font-awesome-icon icon="paper-plane" /></div><div>發佈</div></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      classType: ['classic', 'beauty', 'lifestyle', 'fasion', 'theme', 'talk', 'shop'],
      post: {
        title: '',
        category: -1,
        author: '',
        content: ''
      },
      tools: {
        subtitle: `<input id="subtitle" type="text" placeholder="副標題">`,
        microtitle: `<input id="microtitle" type="text" placeholder="小標題">`,
        paragraph: `<textarea id="paragraph" name="" rows='10' placeholder="文章段落"></textarea>`
      },
      addHTML: [],
      uploadFile: false,
      image: '',
      onRemove: false
    }
  },
  computed: {
    ...mapGetters([ 'user' ])
  },
  mounted () {
    this.post.author = this.user.uid
    document.querySelectorAll('textarea').forEach(e => {
      e.addEventListener('keyup', this.autosize)
    })
  },
  methods: {
    autosize (el) {
      el.srcElement.style.cssText = 'height:auto'
      el.srcElement.style.cssText = 'height:' + el.srcElement.scrollHeight + 'px'
    },
    classSelect (types, i) {
      this.post.category = i
      document.querySelectorAll('.classBar>ul>li').forEach(e => {
        e.className = ''
      })
      document.querySelectorAll('.classBar>ul>li')[this.post.category].className = 'active'
      return this.post.category
    },
    img () {
      document.querySelector('#upload').click()
    },
    handleFiles (e) {
      var files = e.target.files || e.dataTransfer.files
      this.createImage(files[0])
    },
    createImage(file) {
      // var image = new Image()
      var reader = new FileReader()
      reader.onload = (e) => {
        this.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    imgUpload () {
      var data = new FormData()
      data.append('file', document.querySelector('#upload').files[0])
      this.$http.put('/upload', data, { 'Content-Type': 'multipart/form-data' })
        .then(
          res => {
            if (res.data.result === 0) {
              this.addHTML.push(`<img id="image" src="${res.data.path}">`)
              this.image = ''
              this.uploadFile = false
            }
          }
        )
    },
    preview () {
      this.post.content = `<p>${document.querySelectorAll('#first')[0].value}</p>`
      var tmp = []
      var blocks = document.querySelectorAll('.block')
      blocks.forEach(e => {
        var element = e.children[0]
        var index = parseInt(e.id.replace('block-', ''))
        var type = e.children[0].id
        postGeneractor(element, index, type)
      })
      function postGeneractor (element, index, type) {
        if (type === 'image') {
          tmp[index] = `<img src="${element.src}">`
        } else if (type === 'subtitle') {
          tmp[index] = `<h2>${element.value}</h2>`
        } else if (type === 'microtitle') {
          tmp[index] = `<h3>${element.value}</h3>`
        } else if (type === 'paragraph') {
          tmp[index] = `<p>${element.value}</p>`
        }
      }
      tmp.forEach(e => {
        this.post.content += e
      })
    }
  }
}
</script>

