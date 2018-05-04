
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
// 没有点击事件的三百毫秒的延迟
fastclick.attach(document.body)
// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
