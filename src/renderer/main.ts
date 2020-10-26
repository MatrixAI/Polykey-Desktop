import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BalmUI from 'balm-ui'
import BalmUIPlus from 'balm-ui/dist/balm-ui-plus'
import 'balm-ui/dist/balm-ui.css'

const app = createApp(App)

app.use(BalmUI)
app.use(BalmUIPlus)
app.use(store)
app.use(router)
app.mount('#app')
