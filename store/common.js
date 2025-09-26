import { setCache, getCache } from '@/common/js/utils'
export default {	
	state: {
		//状态栏高度
		statusBarHeight: 0,
		//导航栏栏高度
		navigationBarHeight: 0,
		// 胶囊信息
		capsuleMessage: {}
	},
	getters: {
		statusBarHeight:(state) => {
			state.statusBarHeight = getCache('statusBarHeight') ? getCache('statusBarHeight') : 47;
			return state.statusBarHeight
		},
		navigationBarHeight:(state) => {
			state.navigationBarHeight = getCache('navigationBarHeight') ? getCache('navigationBarHeight') : 40;
			return state.navigationBarHeight
		},
		capsuleMessage:(state) => {
			state.capsuleMessage = getCache('capsuleMessage') ? getCache('capsuleMessage') : {};
			return state.capsuleMessage
		}
	},
	mutations: {
		storeStatusBarHeight(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('statusBarHeight', playLoad);
				state.statusBarHeight = playLoad
			}
		},
		storeNavigationBarHeight(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('navigationBarHeight', playLoad);
				state.navigationBarHeight = playLoad
			}
		},
		storeCapsuleMessage(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('capsuleMessage', playLoad);
				state.capsuleMessage = playLoad
			}
		},
		storeAllOrderCancelReason (state,playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('allOrderCancelReason', playLoad);
				state.allOrderCancelReason = playLoad
			}
		}
	}
}
