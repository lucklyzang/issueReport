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
					{text: '呼叫下单', img: '/static/img/medical-call.png',imgCheckd: '/static/img/medical-call-checked.png'},
					{text: '任务跟踪', img: '/static/img/task-tail.png',imgCheckd: '/static/img/task-tail-checked.png'},
					{text: '历史任务', img: '/static/img/history-task.png',imgCheckd: '/static/img/history-task-checked.png'},
					{text: '意见反馈', img: '/static/img/feedback-idea-selected.png',imgCheckd: '/static/img/feedback-idea.png'}
				],
				listIndex: ''
			}
		},
		onReady () {
		},
		computed: {
      ...mapGetters([
        'bottomBarIndex',
				'templateType',
				'isProjectTask'
      ])
		},
		mounted () {
			this.listIndex = this.itemIndex;
			this.isShowFeedbackEvent()
		},
		methods: {
			listEvent (item,index) {
				this.listIndex = index;
				this.$emit('itemEvent',item)
			},
			
			//模板二时不展示意见反馈
			isShowFeedbackEvent () {
				if (this.templateType == 'template_two' || this.isProjectTask) {
				  this.barList = this.barList.filter((item) => {return item.text != '意见反馈'})
				}
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
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 1000;
		background: #fff;
		.bar-list {
			flex: 1;
			height: 50px;
			text-align: center;
			line-height: 65px;
			color: #fff;
			background: #000000;
			font-size: 14px;
			position: relative;
			text {
				width: 100%;
				height: 30px;
				display: inline-block;
				margin-top: 6px;
				text-align: center;
			};
			image {
				position: absolute;
				top: 4px;
				left: 50%;
				margin-left: -13px;
				width: 24px;
				height: 24px
			}
		};
		.operate-list-inner-style {
            background: $color-bottom-nav !important;
         }
	}
</style>
