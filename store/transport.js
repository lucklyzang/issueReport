export default {
  state:{
    titleText: '',
    bottomBarIndex: 0,
    isToCallTaskPage: false,
    isMedicalMan: true,
    isProjectTask: true,
    isCompleteRepairsWorkOrderPhotoList: []
  },
  getters:{
    titleText: state => state.titleText,
    bottomBarIndex: state => state.bottomBarIndex,
    isToCallTaskPage: state => state.isToCallTaskPage,
    isMedicalMan: state => state.isMedicalMan,
    isCompleteRepairsWorkOrderPhotoList: state => state.isCompleteRepairsWorkOrderPhotoList,
    isProjectTask: state => state.isProjectTask
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
    },
    changeIsMedicalMan (state, playLoad) {
      state.isMedicalMan = playLoad
    },
    changeIsProjectTask (state, playLoad) {
      state.isProjectTask = playLoad
    },
    // 改变已完成上传图片的状态
    changeIsCompletePhotoList (state, playLoad) {
      state.isCompleteRepairsWorkOrderPhotoList = playLoad
    }
  },
  actions:{}
}