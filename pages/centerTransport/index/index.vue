<template>
	<view class="container">
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" title="中央运送" @backClick="backTo"></nav-bar>
		</view>
		<view class="container-title">
			运送类型
		</view>
		<view class="trans-type-list">
			<view :class="{'transTypeListStyle': typeIndex == index}" v-for="(item,index) in transTypeList" :key="item" @click="typeEvent(item,index)">{{item}}</view>
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
				transTypeList: ['检查','药品文书','标本'],
				typeIndex: null
			}
		},
		onReady () {
		},
		computed: {
		    ...mapGetters([
				'titleText',
				'isToCallTaskPage'
		    ])
		 },
		mounted () {
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
			typeEvent (item,index) {
				this.typeIndex = index;
				this.typeText = item;
				this.changeTitleText(item)
			},
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
			padding: 10px;
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
			height: 65px;
			width: 100%;
		}
	}
</style>
