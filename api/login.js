import request from '@/api/request';

// 用户登录
export function logIn(data) {
	return request({
	    url: 'login/login',
	    method: 'post',
	    data
	  })
}

// 用户退出登录
export function userSignOut(proId,workerId) {
  return request({
    url: `login/signOut/${proId}/${workerId}`,
    method: 'get'
  })
};
