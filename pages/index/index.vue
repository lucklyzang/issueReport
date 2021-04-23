<template>
	<view class="container">
		<view class="bg-icon">
			<text>BLINK</text>
		</view>
		<view class="title-wrapper">
			<view class="center-transport" :class="transClass" @click="skipPageTrans" @touchstart="transTouchStart" @touchend="transTouchEnd"
			 v-if="isMedicalMan">
				<view>
					<fa-icon type="plus-square" size="100" color="#065da7"></fa-icon>
				</view>
				<text>中央运送系统</text>
			</view>
			<view class="project-manage" :class="manageClass" @click="skipPageManage" @touchstart="manageTouchStart" @touchend="manageTouchEnd">
				<view>
					<fa-icon type="wrench" size="100" color="#065da7"></fa-icon>
				</view>
				<text>工程管理系统</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		getCache
	} from '@/common/js/utils'
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	export default {
		components: {
			faIcon
		},
		data() {
			return {
				transClass: '',
				manageClass: ''
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: ''
			});
			uni.setNavigationBarColor({
				backgroundColor: '#00aaff',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		computed: {
			...mapGetters([
				'isMedicalMan'
			])
		},
		mounted() {
			this.initStoreInfo()
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex',
				'changeIsProjectTask'
			]),
			// 中央运送touchStart事件
			transTouchStart() {
				this.transClass = 'enlargeTransStyle'
			},

			// 中央运送touchEnd事件
			transTouchEnd() {
				this.transClass = 'shrinkTransStyle'
			},
			skipPageTrans() {
				uni.navigateTo({
					url: '/transportPackage/pages/centerTransport/index/index'
				});
				this.changeIsProjectTask(false);
				setCache('isProjectTask', {flag:false});
				this.changeBottomBarIndex(-1);
			},
			// 工程管理touchStart事件
			manageTouchStart() {
				this.manageClass = 'enlargeTransStyle'
			},

			// 工程管理touchEnd事件
			manageTouchEnd() {
				this.manageClass = 'shrinkTransStyle'
			},
			skipPageManage() {
				uni.navigateTo({
					url: '/projectPackage/pages/projectManagement/index/index'
				});
				this.changeIsProjectTask(true);
				setCache('isProjectTask', {flag:true});
				this.changeBottomBarIndex(-1);
			},
			initStoreInfo() {
				// 页面刷新时重新存入用户信息
				if (getCache('userInfo')) {
					this.$store.commit('storeUserInfo', getCache('userInfo'));
				};
				// 页面刷新时重新存入点击的系统信息
				if (getCache('isProjectTask')) {
					this.$store.commit('changeIsProjectTask', getCache('isProjectTask')['flag']);
				};
				// 重新存入模板信息
				if (getCache('templateType')) {
					this.$store.commit('changeTemplateType', getCache('templateType'));
				};
				// 页面刷新重新存入请求token
				if (getCache('questToken')) {
					this.$store.commit('changeToken', getCache('questToken'));
				};
				if (getCache('weixinInfo')) {
					this.$store.commit('changeWeixinInfo', getCache('weixinInfo'));
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";

	.container {
		@include content-wrapper;
		font-size: 14px;

		.bg-icon {
			width: 100%;
			height: 190px;
			line-height: 190px;
			text-align: center;
			color: black;
			background: #fcfcfc;
			font-size: 26px;
			color: #2c9af1;
			font-weight: bold;
			font-size: 50px;

			span {
				box-shadow: 0 8px 6px -6px black
			}
		}

		;

		.title-wrapper {
			flex: 1;
			-webkit-overflow-scrolling: touch;
			overflow: auto;
			font-size: 20px;
			color: #333;
			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
			align-items: center;

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

			>view {
				width: 180px;
				flex-basis: 180px;
				border-radius: 50%;
				color: black;
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				align-items: center;
				border: 1px solid #d6d3d3;
				box-shadow: 0 15px 10px -15px #6d6d6d;
				margin-bottom: 20px;

				&:last-child {
					margin-bottom: 0
				}
			}

			;

			.center-transport {
				.fa-icon {
					color: $color-big-icon !important
				}
			}

			;

			.project-manage {
				.fa-icon {
					color: $color-big-icon !important
				}
			}
		}
	}
</style>
