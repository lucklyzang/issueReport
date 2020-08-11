import request from '@/api/request';

// 手机登录
export function phoneLogin (data) {
	return request({
		url: 'login/login',
		method: 'post',
		data
	})
}
