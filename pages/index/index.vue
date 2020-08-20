<template>
	<view class="container">
		<view class="bg-icon">	
			<text>BLINK</text>
		</view>
		<view class="title-wrapper">
			<view class="center-transport">
				<text @click="skipPage">中央运送系统</text>
			</view>
			<view class="project-manage">
				<text>工程管理系统</text>
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
			skipPage () {
				uni.navigateTo({
					url: '/pages/centerTransport/index/index'
				});
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
			height: 200px;
			background: #75b0f0;
			text {
				display: inline-block;
				width: 100%;
				height: 200px;
				text-align: center;
				line-height: 200px;
				color: black;
				font-weight: blod;
				font-size: 50px
			}
		};
		.title-wrapper {
			flex: 1;
			padding-top: 20px;
			font-size: 20px;
			color: deepskyblue;
			box-sizing: border-box;
			> view {
				width: 200px;
				height: 150px;
				margin: 0 auto;
				text-align: center;
				line-height: 150px;
				border: 1px solid deepskyblue
			}
			.center-transport {
				margin-bottom: 20px
			}
		}
	}
</style>
