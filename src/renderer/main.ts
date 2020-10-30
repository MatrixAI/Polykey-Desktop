import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import BalmUI from 'balm-ui'
import BalmUIPlus from 'balm-ui/dist/balm-ui-plus'
import 'balm-ui/dist/balm-ui.css'
import '../index.css'

createApp(App)
  .use(BalmUI)
  .use(BalmUIPlus)
  .use(store)
  .use(router)
  .mount('#app')
