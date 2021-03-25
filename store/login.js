export default {
	state: {
		userInfo: null,
		token: null, //请求token,
		// 判断模板类型
		templateType: '',
		overDueWay: false,
		weixinInfo: null
	},
	getters: {
		userInfo: state => state.userInfo,
		templateType: state => state.templateType,
		token: state => state.token,
		overDueWay: state => state.overDueWay,
		weixinInfo: state => state.weixinInfo
	},
	mutations: {
		storeUserInfo(state, playLoad) {
			state.userInfo = playLoad
		},
		// 修改token状态
		changeToken(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				state.token = playLoad
			}
		},
		// 修改模板状态
		changeTemplateType(state, playLoad) {
			state.templateType = playLoad
		},
		// 修改过期方式
		changeOverDueWay(state, playLoad) {
			state.overDueWay = playLoad
		},
		// 修改用户微信信息
		changeWeixinInfo(state, playLoad) {
			state.weixinInfo = playLoad
		}
	},
	actions: {}
}
