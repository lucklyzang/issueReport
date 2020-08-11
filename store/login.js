export default {
  state:{
    userInfo: null,
	ceshi: 'hello word'
  },
  getters:{
    userInfo : state => state.userInfo,
	ceshi: state => state.ceshi
  },
  mutations:{
    storeUserInfo (state, playLoad) {
      state.userInfo = playLoad
    }
  },
  actions:{}
}