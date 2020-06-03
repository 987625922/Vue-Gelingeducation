import ElementUI from 'element-ui';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'

import './assets/icon/iconfont.css'
import '../src/assets/theme/theme/index.css'

Vue.prototype.$axios = axios;    //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs
Vue.config.productionTip = false
var that = this

Vue.use(VueAxios, axios)
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
