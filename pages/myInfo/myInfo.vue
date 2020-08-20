<template>
	<view class="container">
		<view class="container-content">
			<view class="conten-text">
				<button type="primary">使用微信登陆</button>
				<button type="primary" @click="skipAccountPage">用户名密码登陆</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache } from '@/common/js/utils'
	export default {
		data() {
			return {
			}
		},
		onReady () {
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
		    ])
		 },
		mounted () {
		},
		methods: {
			skipAccountPage () {
				uni.navigateTo({
				    url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	.container {
		@include content-wrapper;
		.container-content {
			flex: 1;
			background: #75b0f0;
			position: relative;
			.conten-text {
				width: 55%;
				position: absolute;
				positioin: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				button {
					margin-bottom: 30px;
					border-radius: 20px;
					&:first-child {
						background: #78d035
					};
					&:last-child {
						background: #359ed0
					}
				}
			}
		}
	}
</style>
