import Vue from 'vue'
import App from './App'
import store from './store'
import uView from "uview-ui"
import ourLoading from '@/components/our-loading/our-loading.vue'
import { getCache } from '@/common/js/utils'
Vue.component('ourLoading', ourLoading)
Vue.use(uView)
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
		// 重新存入模板信息
		if (getCache('isTemplateOne')) {
			this.$store.commit('changeIsTemplateOne', parseInt(getCache('isTemplateOne')));
		};
		// 页面刷新重新存入请求token
		if (getCache('questToken')) {
		  store.commit('changeToken', getCache('questToken'));
		};
		// 页面刷新重新存入用户微信信息
		if (getCache('weixinInfo')) {
		  store.commit('changeWeixinInfo', getCache('weixinInfo'));
		};
		// 判断是否登录过
		let login = getCache('isLogin');
		if (login) {
			uni.switchTab({
				url: '/pages/index/index'
			})
		  } else {
			uni.redirectTo({
				url: '/pages/myInfo/myInfo'
			})
		}
	}
});
app.$mount();

