import Vue          from 'vue'
import { sync }     from 'vuex-router-sync'
import axios        from 'axios'
import VueAxios     from 'vue-axios'
import VueCookie    from 'vue-cookie'

import App          from './App'
import router       from './router'
import store        from './store'

import FontAwesomeIcon                from '@fortawesome/vue-fontawesome'
import FontAwesome                    from '@fortawesome/fontawesome'
import { faYoutube }                  from '@fortawesome/fontawesome-free-brands'
import  {
          faListUl,
          faHashtag,
          faParagraph,
          faLink,
          faImage
        }            from '@fortawesome/fontawesome-free-solid'

FontAwesome.library.add(faYoutube, faListUl, faHashtag, faParagraph, faLink, faImage)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

Vue.router = router
Vue.use(VueAxios, axios)
Vue.use(VueCookie)
Vue.config.devtools = true

sync(store, router)

const app = new Vue({
  router,
  store,
  ...App
}).$mount('#app')

export { app, router, store, FontAwesome }
