<template>
	<view class="container">
		<u-toast ref="uToast" />
		<view class="empty-info" v-show="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="加载中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" title="中央运送" @backClick="backTo"></nav-bar>
		</view>
		<view class="container-title">
			运送类型
		</view>
		<view class="trans-type-list">
			<view :class="{'transTypeListStyle': typeIndex == index}" v-for="(item,index) in transTypeList" :key="item.value" @click="typeEvent(item,index)">{{item.value}}</view>
		</view>
		<view class="bottom-bar">
			<bottom-bar :itemIndex="-1" @itemEvent="clickEvent"></bottom-bar>
		</view>
		<view>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache } from '@/common/js/utils'
	import {queryTransportTypeClass} from '@/api/task.js'
	import bottomBar from '@/components/bottom-bar/bottom-bar.vue'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components:{
			bottomBar,
			navBar
		},
		data() {
			return {
				typeText: '',
				transTypeList: [],
				typeIndex: null,
				showLoadingHint: false,
				noDataShow: false
			}
		},
		onReady () {
		},
		computed: {
		    ...mapGetters([
				'titleText',
				'userInfo',
				'isToCallTaskPage'
		    ]),
			userName () {
				return this.userInfo.userName
			},
			proId () {
				return this.userInfo.extendData.proId
			},
			proName () {
				return this.userInfo.extendData.proName
			},
			workerId () {
				return this.userInfo.extendData.userId
			},
			accountName () {
				return this.userInfo.name
			}
		 },
		mounted () {
			this.parallelFunctionTwo()
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex',
				'changeTitleText',
				'changeIsToCallTaskPage'
			]),
			
			// 返回上一页
			backTo () {
				uni.switchTab({
				    url: '/pages/index/index'
				})
			},
			
			// 运送类型点击事件
			typeEvent (item,index) {
				this.typeIndex = index;
				this.typeText = item;
				this.changeTitleText(item)
			},
			
		//运送类型
		 parallelFunctionTwo () {
			this.showLoadingHint = true;
			this.noDataShow = false;
			Promise.all([this.getTransportsType()])
			.then((res) => {
			  this.showLoadingHint = false;
			  if (res && res.length > 0) {
				this.noDataShow = false;
				let [item1] = res;
				if (item1) {
				  this.transPortTypeList = [];
				  for (let item of item1) {
					this.transTypeList.push({
					  id: item.id,
					  value: item.typeName
					})
				  }
				}
			  } else {
				  this.noDataShow = true
			  }
			})
			.catch((err) => {
			  this.showLoadingHint = false;
			  this.$refs.uToast.show({
			  	title: `${err}`,
			  	type: 'warning'
			  })
			})
		  },
		  
			// 查询运送类型分类
			getTransportsType () {
				return new Promise((resolve,reject) => {
				  queryTransportTypeClass({proId: this.proId, state: 0}).then((res) => {
					if (res && res.data.code == 200) {
					  if (res.data.data.length > 0) {
						resolve(res.data.data)
					  }
					}
				  })
				  .catch((err) => {
					reject(err.message)
				  })
				})
			  },
			  
			// 底部导航栏菜单点击事件
			clickEvent (item) {
				if (item.text == '呼叫') {
					if (this.typeIndex === null) {
						this.$refs.uToast.show({
							title: '请选择运送类型',
						});
						return
					};
					if (this.isToCallTaskPage) {
						uni.redirectTo({
						    url: '/pages/centerTransport/index/index'
						});
						this.changeBottomBarIndex(-1)
					} else {
						this.changeBottomBarIndex(0);
						uni.redirectTo({
							url: '/pages/callTask/callTask?title='+this.typeText
						});
						this.changeIsToCallTaskPage(true)
					}
			    } else if (item.text == '任务跟踪') {
					this.changeBottomBarIndex(1);
					uni.redirectTo({
						url: '/pages/task-tail/task-tail'
					});
					this.changeBottomBarIndex(1);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "历史任务") {
					uni.redirectTo({
						url: '/pages/historyTask/historyTask'
					});
					this.changeBottomBarIndex(2);
					this.changeIsToCallTaskPage(true)
				} 
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	.container {
		@include content-wrapper;
		position: relative;
		.empty-info {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto
		};
		.container-title {
			height: 60px;
			width: 100%;
			margin: 0 auto;
			line-height: 60px;
			text-align: center;
			font-size: 24px;
			color: black;
		};
		.trans-type-list {
			padding: 0 10px 10px 10px;
			flex: 1;
			overflow: auto;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-content: flex-start;
			.transTypeListStyle {
				background: #75b0f0
			};
			> view {
				width: 48%;
				height: 60px;
				background: #ececec;
				color: black;
				font-size: 20px;
				text-align: center;
				line-height: 60px;
				margin-bottom: 4%
			}
		}
		.bottom-bar {
			height: 50px;
			width: 100%;
		}
	}
</style>
