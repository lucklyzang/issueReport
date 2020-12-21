import axios from 'axios-miniprogram'
import store from '@/store'
import { setCache, getCache, removeAllLocalStorage } from '@/common/js/utils'
const instance = axios.create({
  baseURL: 'https://blinktech.cn/trans',
  headers: {
    // common: {
    //   'Accept': 'application/json, test/plain,'
    // }
    // post: {
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    // }
  }
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
	if (config['url'] == 'project/queryAll') {
		config.headers['HTTP_REQUEST_TYPE'] = 1
	};
	// 在发送请求之前做些什么
	if (store.getters.token) {
	   config.headers['Authorization'] = store.getters.token
	};
	 return config;
}, function (error) {
  //处理请求错误
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
 if (response['headers']['Status'] != '2003' && response['config']['url'] != 'project/queryAll') {
	 if (response.headers['token']) {
		   store.commit('changeToken', response.headers['token']);
		   setCache('questToken', response.headers['token']);
		 };
		 if (!response.headers.hasOwnProperty('token')) {
		   if (response.data.msg == `当前用户[${getCache('userName')}]已登陆,不可重复登陆` || response.data.msg == `当前登陆用户[${getCache('userName')}]不存在`) {
				return response
		   };
		   removeAllLocalStorage();
		   if (!store.getters.overDueWay) {
        uni.showToast({
          title: 'token已过期,请重新登录',
          duration: 2000
        });
         setTimeout(() => {
           uni.redirectTo({
            url: '/pages/myInfo/myInfo',
           })
         },2000);
		   } else {
			   uni.redirectTo({
					url: '/pages/myInfo/myInfo',
			   })
		   }
		}
	}
	return response;
}, function (error) {
  // 处理响应错误
  return Promise.reject(error);
});

export default instance