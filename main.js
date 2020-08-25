import Vue from 'vue'
import App from './App'
import store from './store'
import uView from "uview-ui"
import ourLoading from '@/components/our-loading/our-loading.vue'
import { getCache } from '@/common/js/utils'
Vue.component('ourLoading', ourLoading)
Vue.use(uView);
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store,
	created () {
		// 页面刷新时重新存入用户信息
		if (getCache('userInfo')) {
		  store.commit('storeUserInfo',getCache('userInfo'));
		};
		// 页面刷新重新存入请求token
		if (getCache('questToken')) {
		  store.commit('changeToken', getCache('questToken'));
		};
	}
})
app.$mount()
