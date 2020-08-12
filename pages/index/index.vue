<template>
	<view class="container">
	<!-- 	<navigator url="/pages/business/issue-report?id=1" hover-class="navigator-hover"> -->
			<button type="default" @click="skipPage">问题上报</button>
		<!-- </navigator> -->
		<text>{{ceshi}}</text>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache } from '@/common/js/utils'
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		computed: {
		    ...mapGetters([
				'ceshi'
		    ])
		 },
		mounted () {
			console.log('恰恰',this.ceshi);
			setCache('测试',[{a:1,b:2},{a:3,b:4}]);
			console.log(getCache('测试'))
		},
		methods: {
			skipPage () {
				uni.navigateTo({
					url: '/pages/business/issue-report?id=1'
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
		.intro {
			width: 100%;
			display: inline-block;
			text-align: center
		}
	}
</style>
