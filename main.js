import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import request from "./utils/request";
Vue.config.productionTip = false
App.mpType = 'app'
//引入vuex
import store from './store'
//定义为全局组件
Vue.prototype.$store = store

Vue.config.productionTip = false
// console.log(request)

Vue.prototype.request = request; //通过this.request() 使用
// console.log(request)

const app = new Vue({
    ...App,
	//挂载vuex
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif	