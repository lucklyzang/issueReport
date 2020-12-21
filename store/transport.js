export default {
  state:{
    titleText: '',
    bottomBarIndex: 0,
    isToCallTaskPage: false,
  },
  getters:{
    titleText: state => state.titleText,
    bottomBarIndex: state => state.bottomBarIndex,
    isToCallTaskPage: state => state.isToCallTaskPage,
  },
  mutations:{
    changeTitleText (state, playLoad) {
      state.titleText = playLoad
    },
	changeBottomBarIndex (state, playLoad) {
	  state.bottomBarIndex = playLoad
	},
	changeIsToCallTaskPage (state, playLoad) {
	  state.isToCallTaskPage = playLoad
	}
  },
  actions:{}
}