// import devtools from '@vue/devtools'
import { createApp } from 'vue'
import App from '@renderer/App.vue'
import router from '@renderer/router'
import store from '@renderer/store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@renderer/assets/index.css'

console.log(process.env)
// devtools.connect('http://localhost', 8098)

createApp(App)
  .use(Antd)
  .use(store)
  .use(router)
  .mount('#app')
