<template>
	<view class="container">
		<navigator url="/pages/business/issue-report?id=1" hover-class="navigator-hover">
			<button type="default">问题上报</button>
		</navigator>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
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
			console.log('恰恰',this.ceshi)
		},
		methods: {

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
