import axios from 'axios-miniprogram'
import store from '@/store'
import { setCache, getCache, removeAllLocalStorage } from '@/common/js/utils'
// 开发环境： https://blink.blinktech.cn
// 测试环境：https://show.blinktech.cn
// 准生产环境：https://ver.blinktech.cn
// 生产环境：https://blinktech.cn
const instance = axios.create({
  baseURL: 'https://blink.blinktech.cn',
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
  config.baseURL = store.state.transport.isProjectTask ? 'https://blink.blinktech.cn/project' : 'https://blink.blinktech.cn/trans';
	if (config['url'] == 'project/queryAll') {
		config.headers['HTTP_REQUEST_TYPE'] = 1
	};
	// 请求头添加token
	if (store.getters.token) {
	   config.headers['Authorization'] = store.getters.token
	};
	// 请求头添加模板信息
	if (store.getters.templateType) {
	   config.headers['REQUEST_TEMPLATE'] = store.getters.templateType
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
          duration: 1000
        });
        setTimeout(() => {
          uni.redirectTo({
           url: '/pages/login/login'
          })
        },2000);
		   } else {
			  uni.redirectTo({
			    url: '/pages/login/login'
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