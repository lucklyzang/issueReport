<template>
	<view class="container">
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="意见反馈" @backClick="backTo"></nav-bar>
		</view>
		<view class="feedback-content-box">
			<view class="feedback-icon">
			<u-icon name="order" size="100" color="#2c9af1" />
			</view>
			<view class="idea-type">
				<text>*</text>意见类型
			</view>
			<view class="idea-type-list">
				<text>运送人员</text>
				<text>功能故障</text>
				<text>其它意见</text>
			</view>
			 <view class="feedback-idea">
				<text>*</text>反馈意见
			</view>
			<u-input v-model="deedbackContent" maxlength="2000" border placeholder="请输入你的反馈意见" type="textarea" height="200"/>
			<view class="guess-speak-list">
				<text v-for="(innerItem,innerIndex) in totalGuessSpeakList" @click="totalGuessSpeakListEvent(innerItem,innerIndex)" :key="innerIndex">{{innerItem.name}}</text>
			</view>  
			<view class="feedback-btn">
				意见反馈
			</view>
		</view>
		<view class="bottom-bar">
			<bottom-bar :itemIndex="3" @itemEvent="clickEvent"></bottom-bar>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
	} from '@/api/task.js'
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			faIcon,
			navBar
		},
		data() {
			return {
				totalGuessSpeakList: [{name: '服务态度有待改进'},{name: '运送时间比较长'},{name: '等待时间比较长'},{name: '服务不够细心'}],
				deedbackContent: ''
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
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex',
				'changeIsToCallTaskPage'
			]),

			// 返回上一页
			backTo() {
				uni.redirectTo({
				    url: '/transportPackage/pages/centerTransport/index/index'
				});
				this.changeBottomBarIndex(0);
				this.changeIsToCallTaskPage(false)
			},
			
			// 总体反馈猜你想说项点击事件
			totalGuessSpeakListEvent(innerItem,innerIndex) {
				if (this.deedbackContent.length == 0) {
					this.deedbackContent = `${innerItem.name}`
				} else {
					this.deedbackContent = `${this.deedbackContent},${innerItem.name}`
				}
			},
			
			clickEvent (item) {
				if (item.text == "任务跟踪") {
					uni.redirectTo({
						url: '/transportPackage/pages/task-tail/task-tail'
					});
					this.changeBottomBarIndex(1);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "呼叫下单") {
					if (this.isToCallTaskPage) {
						this.backTo()
					} else {
						uni.redirectTo({
							url: '/transportPackage/pages/callTask/callTask'
						});
						this.changeBottomBarIndex(0);
						this.changeIsToCallTaskPage(true)
					}
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
		.nav {
			width: 100%
		};
		.bottom-bar {
			width: 100%;
			height: 50px
		};
		.feedback-content-box {
			width: 100%;
			flex: 1;
			padding: 0 8px;
			box-sizing: border-box;
			.feedback-icon {
				height: 140px;
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
			};
			/deep/ .van-cell {
				border: 1px solid #dadada;
				background-color: #f6f6f6
			};
			.idea-type {
				color: black;
				font-size: 14px;
				font-weight: bold;;
				margin-bottom: 12px;
				>text {
					color: red;
				}
			};
			.guess-speak-list {
					display: flex;
					flex-flow: row wrap;
					justify-content: flex-start;
					margin: 20px 0;
					text {
						font-size: 13px;
						color: #a59f9f;
						display: inline-block;
						padding: 0 8px;
						box-sizing: border-box;
						height: 25px;
						line-height: 25px;
						text-align: center;
						border: 1px solid #a59f9f;
						margin: 0 8px 8px 0;
					}
			};
			.idea-type-list {
				display: flex;
				flex-flow: row wrap;
				justify-content: flex-start;
				text {
					font-size: 13px;
					color: #a59f9f;
					display: inline-block;
					padding: 8px 16px;
					background: #f4f4f4;
					box-sizing: border-box;
					text-align: center;
					border: 1px solid #a59f9f;
					margin: 0 8px 8px 0;
				}
			};
			.feedback-idea {
				color: black;
				font-size: 14px;
				font-weight: bold;
				margin: 12px 0;
				>text {
					color: red;
				}
			};
			.feedback-btn {
				width: 100%;
				margin: 0 auto;
				height: 42px;
				line-height: 42px;
				color: #fff;
				font-size: 13px;
				text-align: center;
				background: #63bbff
			}
		}
	}
</style>

