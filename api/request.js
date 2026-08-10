import axios from 'axios-miniprogram'
import store from '@/store'
import { setCache, getCache, removeAllLocalStorage } from '@/common/js/utils'
// 开发环境： https://blink.blinktech.cn
// 测试环境：https://show.blinktech.cn
// 准生产环境：https://ver.blinktech.cn
// 生产环境：https://blinktech.cn
const instance = axios.create({
  baseURL: 'https://blinktech.cn',
  headers: {
    // common: { 
    //   'Accept': 'application/json, test/plain,'
    // }
    // post: {
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    // }
  }
});
// ========== 重试配置 ==========
const RETRY_COUNT = 2;        // 最大重试次数
const RETRY_DELAY = 1000;     // 重试间隔（ms）
// 用 Map 记录每个请求的重试次数（key 用 url + method + params 组合）
const retryMap = new Map();
// 生成请求唯一标识
function getRequestKey(config) {
  const params = config.params ? JSON.stringify(config.params) : ''
  const data = config.data ? JSON.stringify(config.data) : ''
  return `${config.method}_${config.url}_${params}_${data}`
};
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  config.baseURL = config['url'] == 'user/update-password' ? 'https://blinktech.cn/project' : store.state.transport.isProjectTask ? 'https://blinktech.cn/project' : 'https://blinktech.cn/trans';
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
       setCache('token', response.headers['token']);
     };
		 if (response.data.code == '401') {
		 	if (!store.getters.overDueWay) { 
		 		uni.showToast({
		 			title: 'token已过期,请重新登录!',
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
		 	};
		 	// 清空store和localStorage
		 	removeAllLocalStorage();
			store.commit('changeIsProjectTask', false);
			store.commit('changeIsLogin', false);
			store.commit('changeWeixinInfo', false);
		 }
	};
	//成功时清除重试记录
	const key = getRequestKey(response.config);
	retryMap.delete(key);
	return response;
}, function (error) {
	if (Object.prototype.toString.call(error.response) === '[object Object]') {
		if (error.response.hasOwnProperty('status')) {
			if (error.response.status === 401) { 
				if (!store.getters.overDueWay) { 
					uni.showToast({
						title: 'token已过期,请重新登录!',
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
				};
				// 清空store和localStorage
				removeAllLocalStorage();
				store.commit('changeIsProjectTask', false);
				store.commit('changeIsLogin', false);
				store.commit('changeWeixinInfo', false);
			} else {
			}
		}
	};
	const config = error.config;
	// 没有 config 说明请求根本没发出去
	if (!config) {
		return Promise.reject(error);
	};
	const key = getRequestKey(config);
	const currentRetry = retryMap.get(key) || 0;
	// 判断是否需要重试
	if (!shouldRetry(error) || currentRetry >= RETRY_COUNT) {
		retryMap.delete(key)
		return Promise.reject(error)
	};
	// 记录重试次数
	retryMap.set(key, currentRetry + 1);
	return delay(RETRY_DELAY * (currentRetry + 1)).then(() => {
		return instance(config)
	})
});
// 判断是否应该重试
function shouldRetry(error) {
  // 1. 网络错误（无响应）
  if (!error.response) {
    return true
  };
  // 2. 服务端错误 5xx
  if (error.response.status >= 500) {
    return true
  };
  // 3. 请求超时
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true
  };
  // 4. 401 不重试（需要重新登录）
  if (error.response.status === 401) {
    return false
  };
  return false
};
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
};
export default instance