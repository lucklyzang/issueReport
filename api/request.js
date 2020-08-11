import axios from 'axios-miniprogram'
const instance = axios.create({
  baseURL: 'http://blink.blinktech.cn/project',
  headers: {
    common: {
      'Accept': 'application/json, test/plain,'
    },
    post: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  }
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log('request');
  return config;
}, function (error) {
  //处理请求错误
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 请求成功后做些什么
  console.log('response');
  return response;
}, function (error) {
  // 处理响应错误
  return Promise.reject(error);
});

export default instance