<template>
	<view class="bar-list-box">
		<view class="bar-list" :class="{'operate-list-inner-style':bottomBarIndex == index}" v-for="(item,index) in barList" :key="index" @click="listEvent(item,index)">
			<text>{{item.text}}</text>
			<image :src="bottomBarIndex == index ? item.imgCheckd : item.img">
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache } from '@/common/js/utils'
	export default {
		props: {
		  'itemIndex': {
			  type: Number,
			  required:true,
			  default: -1
		  }
		},
		data() {
			return {
				barList: [
					{text: '呼叫', img: '/static/img/medical-call.png',imgCheckd: '/static/img/medical-call-checked.png'},
					{text: '任务跟踪', img: '/static/img/task-tail.png',imgCheckd: '/static/img/task-tail-checked.png'},
					{text: '历史任务', img: '/static/img/history-task.png',imgCheckd: '/static/img/history-task-checked.png'},
				],
				listIndex: ''
			}
		},
		onReady () {
		},
		computed: {
		    ...mapGetters([
				'bottomBarIndex'
		    ])
		 },
		mounted () {
			this.listIndex = this.itemIndex
		},
		methods: {
			listEvent (item,index) {
				this.listIndex = index;
				this.$emit('itemEvent',item)
			}
		}
	}
</script>

<style lang="scss">
@import "~@/common/stylus/variable.scss";
	.bar-list-box {
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-content: flex-start;
		.bar-list {
			width: 33.3333%;
			height: 65px;
			text-align: center;
			line-height: 65px;
			color: #fff;
			background: #3a4863;
			font-size: 16px;
			position: relative;
			padding-top: 15px;
			text {
				width: 100%;
				display: inline-block;
				text-align: center
			};
			image {
				position: absolute;
				top: 8px;
				left: 50%;
				margin-left: -13px;
				width: 26px;
				height: 26px
			}
		};
		.operate-list-inner-style {
            background: #15c4f9 !important;
         }
	}
</style>
