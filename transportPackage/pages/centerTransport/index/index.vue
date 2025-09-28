<template>
	<view class="container">
		<u-toast ref="uToast" />
		<view class="empty-info" v-show="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint" :translateY="50" text="加载中···" color="#fff" textColor="#fff"
		 background-color="rgb(143 143 143)" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="中央运送" @backClick="backTo"></nav-bar>
		</view>
		<view class="trans-type-list">
			<view :class="{'enlargeTransStyle': typeIndex == index && transTypeClass, 'shrinkTransStyle': typeIndex == index && !transTypeClass}" v-for="(item,index) in transTypeList" :key="item.value"
			 @click="typeEvent(item,index)"
			 @touchstart="transTypeTouchStart(index)" @touchend="transTypeTouchEnd(index)"
			 >
				<view>
					<fa-icon v-show="item.value == '标本'" type="flask" size="100" color="#065da7"></fa-icon>
					<fa-icon v-show="item.value == '药、物、文书'" type="plus-square-o" size="100" color="#065da7"></fa-icon>
					<fa-icon v-show="item.value == '检查'" type="user-circle-o" size="100" color="#065da7"></fa-icon>
					<fa-icon v-show="item.value == '核酸采集'" type="address-card" size="100" color="#065da7"></fa-icon>
				</view>
				<text>
					{{item.value}}
				</text>
			</view>
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
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		queryTransportTypeClass
	} from '@/api/task.js'
	import bottomBar from '@/components/bottom-bar/bottom-bar.vue'
	import navBar from "@/components/zhouWei-navBar"
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	export default {
		components: {
			bottomBar,
			navBar,
			faIcon
		},
		data() {
			return {
				transTypeClass: '',
				typeText: '',
				transTypeList: [],
				typeIndex: null,
				showLoadingHint: false,
				noDataShow: false
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
				'titleText',
				'userInfo',
				'isToCallTaskPage'
			]),
			userName() {
				return this.userInfo.userName
			},
			proId() {
				return this.userInfo.extendData.proId
			},
			proName() {
				return this.userInfo.extendData.proName
			},
			workerId() {
				return this.userInfo.extendData.userId
			},
			accountName() {
				return this.userInfo.name
			}
		},
		mounted() {
			this.changeBottomBarIndex(0);
			this.parallelFunctionTwo()
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex',
				'changeTitleText',
				'changeIsToCallTaskPage'
			]),

			// 返回上一页
			backTo() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},

			// 运送类型点击事件
			typeEvent(item, index) {
				this.typeIndex = index;
				this.typeText = item;
				this.changeTitleText(item);
				this.changeBottomBarIndex(0);
				uni.redirectTo({
					url: '/transportPackage/pages/callTask/callTask?title=' + this.typeText
				});
				this.changeIsToCallTaskPage(true)
			},
			
			// 运送类型TouchStart事件
			transTypeTouchStart(index) {
				this.transTypeClass = true;
				this.typeIndex = index
			},
			
			// 运送类型TouchEnd事件
			transTypeTouchEnd(index) {
				this.transTypeClass = false;
				this.typeIndex = index
			},

			//运送类型
			parallelFunctionTwo() {
				this.showLoadingHint = true;
				this.noDataShow = false;
				Promise.all([this.getTransportsType()])
					.then((res) => {
						this.showLoadingHint = false;
						if (res && res[0] && res[0].length > 0) {
							this.noDataShow = false;
							let [item1] = res;
							if (item1) {
								this.transTypeList = [];
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
			getTransportsType() {
				return new Promise((resolve, reject) => {
					queryTransportTypeClass({
							proId: this.proId,
							state: 0
						}).then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							}
						})
						.catch((err) => {
							reject(err.message)
						})
				})
			},

			// 底部导航栏菜单点击事件
			clickEvent(item) {
				if (item.text == '呼叫') {
					if (this.isToCallTaskPage) {
						uni.redirectTo({
							url: '/transportPackage/pages/centerTransport/index/index'
						});
						this.changeBottomBarIndex(0)
					}
				} else if (item.text == '任务跟踪') {
					this.changeBottomBarIndex(1);
					uni.redirectTo({
						url: '/transportPackage/pages/task-tail/task-tail'
					});
					this.changeBottomBarIndex(1);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "历史任务") {
					uni.redirectTo({
						url: '/transportPackage/pages/historyTask/historyTask'
					});
					this.changeBottomBarIndex(2);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "意见反馈") {
					uni.redirectTo({
						url: '/transportPackage/pages/totalFeedbackIdea/totalFeedbackIdea'
					});
					this.changeBottomBarIndex(3);
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
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.empty-info {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto
		}

		;

		.trans-type-list {
			padding: 50px 0;
			flex: 1;
			-webkit-overflow-scrolling: touch;
			overflow: auto;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			background: #FFF;
			.fa-icon {
				color: $color-big-icon !important
			};
			
			.enlargeTransStyle {
				animation: enlarge 0.2s linear both
			}
			
			;
			
			.shrinkTransStyle {
				animation: shink 0.2s linear both
			}
			
			;
			
			@keyframes enlarge {
				from {
					transform: scale3d(1, 1, 1);
				}
			
				to {
					transform: scale3d(1.3, 1.3, 1.3);
				}
			}
			
			;
			
			@-webkit-keyframes shink {
				from {
					transform: scale3d(1.3, 1.3, 1.3);
				}
			
				to {
					transform: scale3d(1, 1, 1);
				}
			}
			
			;

			.transTypeListStyle {
				background: #ededed
			}

			;

			>view {
				width: 180px;
				flex-basis: 180px;
				border-radius: 50%;
				background: #FFF;
				color: black;
				border: 1px solid #d6d3d3;
				box-shadow: 0 15px 10px -15px #6d6d6d;
				font-size: 20px;
				margin-bottom: 20px;
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				align-items: center;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.bottom-bar {
			height: 50px;
			width: 100%;
		}
	}
</style>
