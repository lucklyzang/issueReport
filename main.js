import Vue from 'vue'
import App from './App'
import store from './store'
import uView from "uview-ui"
import ourLoading from '@/components/our-loading/our-loading.vue'
Vue.component('ourLoading', ourLoading)
Vue.use(uView);
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
