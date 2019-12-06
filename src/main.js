// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import './components/registeBaseComponent'
import './filters'
import './directive'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
Vue.use(ElementUI)

import FormRules from "./plugin/formRules";
Vue.use(FormRules)

import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

import VueMoment from 'vue-moment'
Vue.use(VueMoment)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
