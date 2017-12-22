<template>
  <div class="stock">
    <div class="editor">
      <h1>新增商品</h1>
      <div class="editor-container">
        <input id="title" type="text" placeholder="商品名稱" v-model="stock.name">
        <div class="classBar">
          <ul>
            <li v-for="(types, i) in classType" @click="classSelect(types, i)">
              <span class="uppercase soli">{{ types }}</span>
            </li>
          </ul>
        </div>
        <h2>商品圖片</h2>
        <div class="stock-img">
          <div class="upload-container" v-show="stock.img.length < 4">
            <input type="file" name="upload" id="stock" accept="image/*" style="display:none" @change="handleFiles">
            <div class="button" v-if="!image" @click="img('stock')">
              <font-awesome-icon icon="camera" />
              <span>選擇圖片</span>
            </div>
            <div class="button pre" v-if="image" @click="imgUploadStock()" :style="{ 'background-image': `url(${image})` }">
              <span>確定上傳</span>
            </div>
          </div>
          <div class="upload-container" v-for="(img, i) in stock.img">
            <div class="close" @click="stock.img.splice(i, 1)">
              <font-awesome-icon icon="times" />
            </div>
            <div class="image" :style="{ background: `url(${img})`}"></div>
          </div>
        </div>
        <h2>商品資料</h2>
        <textarea name="" rows='5' id="summary" placeholder="商品簡介"></textarea>
        <input id="subtitle" type="text" placeholder="售價" v-model="stock.price">
        <input id="subtitle" type="text" placeholder="銷貨數量" v-model="stock.count">
        <div class="spec" v-for="i in specCount">
          <div class="close" @click="stock.spec.splice(i - 1, 1); specCount = stock.spec.length + 1" v-if="i !== 1">
            <font-awesome-icon icon="times" />
          </div>
          <input id="subtitle" type="text" placeholder="規格" v-model="stock.spec[i - 1]" @click="specCount === i && stock.spec.length === i - 1 ? specCount = stock.spec.length + 2 : null">
        </div>
        <h2>商品描述</h2>
        <div class="toolbox">
          <ul>
            <li @click="addHTML.push(tools.subtitle)">
              <div>h2</div>
              <div>副標題</div>
            </li>
            <li @click="addHTML.push(tools.microtitle)">
              <div>h3</div>
              <div>小標題</div>
            </li>
            <li @click="addHTML.push(tools.paragraph)">
              <div>
                <font-awesome-icon icon="paragraph" />
              </div>
              <div>文章段落</div>
            </li>
            <li @click="addHTML.push(tools.list)">
              <div>
                <font-awesome-icon icon="list-ul" />
              </div>
              <div>清單</div>
            </li>
            <li @click="uploadFile = true; image = ''">
              <div>
                <font-awesome-icon icon="image" />
              </div>
              <div>圖片</div>
            </li>
            <li @click="addIframe = true">
              <div>
                <font-awesome-icon :icon="['fab', 'youtube']" />
              </div>
              <div>影片嵌入</div>
            </li>
            <!-- <li @click="addHTML.push(tools.subtitle)"><div><font-awesome-icon icon="list-ul" /></div><div>清單</div></li> -->
            <li @click="onRemove = !onRemove">
              <div>
                <font-awesome-icon icon="times" />
              </div>
              <div>刪除區塊</div>
            </li>
            <!-- <li @click="submit"><div><font-awesome-icon icon="eye" /></div><div>預覽</div></li> -->
            <li @click="preview()">
              <div>
                <font-awesome-icon icon="paper-plane" />
              </div>
              <div>發佈</div>
            </li>
          </ul>
        </div>
        <textarea name="" id="discription" rows='5' placeholder="文章段落"></textarea>
        <div v-for="(html, i) in addHTML" class="blocks">
          <span class="icon" @click="addHTML.splice(i, 1)" v-if="onRemove">
            <font-awesome-icon icon="minus-circle" />
          </span>
          <span class="block" :id="`block-${i}`" v-html="html"></span>
        </div>
        <h2>商品規格</h2>
        <div class="toolbox">
          <ul>
            <li @click="addNote.push(tools.subtitle)">
              <div>h2</div>
              <div>副標題</div>
            </li>
            <li @click="addNote.push(tools.microtitle)">
              <div>h3</div>
              <div>小標題</div>
            </li>
            <li @click="addNote.push(tools.paragraph)">
              <div>
                <font-awesome-icon icon="paragraph" />
              </div>
              <div>文章段落</div>
            </li>
            <li @click="addNote.push(tools.list)">
              <div>
                <font-awesome-icon icon="list-ul" />
              </div>
              <div>清單</div>
            </li>
            <!-- <li @click="uploadFile = true; image = ''">
              <div>
                <font-awesome-icon icon="image" />
              </div>
              <div>圖片</div>
            </li>
            <li @click="addIframe = true">
              <div>
                <font-awesome-icon :icon="['fab', 'youtube']" />
              </div>
              <div>影片嵌入</div>
            </li> -->
            <!-- <li @click="addNote.push(tools.subtitle)"><div><font-awesome-icon icon="list-ul" /></div><div>清單</div></li> -->
            <li @click="onRemove = !onRemove">
              <div>
                <font-awesome-icon icon="times" />
              </div>
              <div>刪除區塊</div>
            </li>
            <!-- <li @click="submit"><div><font-awesome-icon icon="eye" /></div><div>預覽</div></li> -->
            <li @click="render()">
              <div>
                <font-awesome-icon icon="paper-plane" />
              </div>
              <div>發佈</div>
            </li>
            <li @click="submit()">
              <div>
                <font-awesome-icon icon="paper-plane" />
              </div>
              <div>發佈</div>
            </li>
          </ul>
        </div>
        <textarea name="" rows='5' id="note" placeholder="文章段落"></textarea>
        <div v-for="(html, i) in addNote" class="blocks">
          <span class="icon" @click="addNote.splice(i, 1)" v-if="onRemove">
            <font-awesome-icon icon="minus-circle" />
          </span>
          <span class="blockNote" :id="`block-${i}`" v-html="html"></span>
        </div>
        <!-- <div v-for="(html, i) in addHTML" class="blocks">
          <span class="icon" @click="addHTML.splice(i, 1)" v-if="onRemove"><font-awesome-icon icon="minus-circle" /></span><span class="block" :id="`block-${i}`" v-html="html"></span>
        </div> -->
      </div>
    </div>
    <div class="imgUpload" v-if="uploadFile">
      <div class="upload-container">
        <div class="close" @click="uploadFile = false">
          <font-awesome-icon icon="times" />
        </div>
        <input type="file" name="upload" id="upload" accept="image/*" style="display:none" @change="handleFiles">
        <img class="preview" :src="image">
        <div class="button" v-if="!image" @click="img('upload')">上傳圖片</div>
        <div class="button" v-if="image" @click="imgUpload()">確定</div>
      </div>
    </div>
    <div class="imgUpload" v-if="addIframe">
      <div class="upload-container">
        <input type="text" name="iframe">
        <div class="button" @click="Iframe()">OK</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      classType: ['體驗活動', '肌膚保養', '居家空間', '生活品味', '味蕾饗宴', '時尚藝術'],
      stock: {
        type: 1,
        comboList: [],
        img: [],
        name: '',
        info: '',
        count: '',
        available: false,
        price: '',
        seller: [],
        spec: []
      },
      tools: {
        subtitle: `<input id="subtitle" type="text" placeholder="副標題">`,
        microtitle: `<input id="microtitle" type="text" placeholder="小標題">`,
        paragraph: `<textarea id="paragraph" name="" rows='10' placeholder="文章段落"></textarea>`,
        list: `<input id="list" type="text" placeholder="清單項目">`
      },
      addHTML: [],
      addNote: [],
      uploadFile: false,
      addIframe: false,
      image: '',
      onRemove: false,
      pre: {
        type: '',
        summary: '',
        discription: '',
        note: ''
      },
      specCount: 1
    }
  },
  computed: {
    ...mapGetters([ 'user' ])
  },
  mounted () {
    this.stock.seller.push(this.user.uid)
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
      this.pre.type = i
      document.querySelectorAll('.classBar>ul>li').forEach(e => {
        e.className = ''
      })
      document.querySelectorAll('.classBar>ul>li')[this.pre.type].className = 'active'
      return this.pre.type
    },
    img (e) {
      this.image = ''
      document.querySelector(`#${e}`).click()
    },
    Iframe () {
      this.addHTML.push(`${document.querySelector('input[name="iframe"]').value}`)
      this.addIframe = false
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
    imgUploadStock () {
      var data = new FormData()
      data.append('file', document.querySelector('#stock').files[0])
      this.$http.put('/upload', data, { 'Content-Type': 'multipart/form-data' })
        .then(
          res => {
            if (res.data.result === 0) {
              this.stock.img.push(`http://60.249.179.125:3002${res.data.path}`)
              this.image = ''
              this.uploadFile = false
            }
          }
        )
    },
    preview () {
      this.pre.summary = document.querySelectorAll('#summary')[0].value
      this.pre.discription = `<p>${document.querySelectorAll('#discription')[0].value}</p>`
      var tmp = []
      var blocks = document.querySelectorAll('.block')
      blocks.forEach(e => {
        var element = e.children[0]
        var index = parseInt(e.id.replace('block-', ''))
        var type = e.children[0].id
        stockGeneractor(element, index, type)
      })
      function stockGeneractor (element, index, type) {
        if (type === 'image') {
          tmp[index] = `<img src="${element.src}">`
        } else if (type === 'subtitle') {
          tmp[index] = `<h2>${element.value}</h2>`
        } else if (type === 'microtitle') {
          tmp[index] = `<h3>${element.value}</h3>`
        } else if (type === 'paragraph') {
          tmp[index] = `<p>${element.value}</p>`
        } else if (type === 'list') {
          tmp[index] = `<li>${element.value}</li>`
        } else {
          var spam = document.createElement('div')
          spam.appendChild(element.cloneNode())
          tmp[index] = spam.innerHTML
        }
      }
      tmp.forEach(e => {
        this.pre.discription += e
      })
    },
    render () {
      this.pre.note = `<p>${document.querySelectorAll('#note')[0].value}</p>`
      var tmpN = []
      var blockNote = document.querySelectorAll('.blockNote')
      blockNote.forEach(e => {
        var element = e.children[0]
        var index = parseInt(e.id.replace('block-', ''))
        var type = e.children[0].id
        stockGeneractorN(element, index, type)
      })
      function stockGeneractorN (element, index, type) {
        if (type === 'image') {
          tmpN[index] = `<img src="${element.src}">`
        } else if (type === 'subtitle') {
          tmpN[index] = `<h2>${element.value}</h2>`
        } else if (type === 'microtitle') {
          tmpN[index] = `<h3>${element.value}</h3>`
        } else if (type === 'paragraph') {
          tmpN[index] = `<p>${element.value}</p>`
        } else if (type === 'list') {
          tmpN[index] = `<li>${element.value}</li>`
        }
      }
      tmpN.forEach(e => {
        this.pre.note += e
      })
    },
    submit () {
      this.preview()
      this.render()
      this.stock.info = JSON.stringify(this.pre)
      this.$http.post('http://60.249.179.125:3001/stock', this.stock).then(
        res => {
          if (res.data.result === 0) {
            window.open(`http://60.249.179.125/shop/${res.data.sid}`)
          } else {
            console.log(res.data)
          }
        }
      )
    }
  }
}
</script>

