<template>
	<view class="container">
		<u-calendar v-model="show" :mode="mode" @change="dateChange"></u-calendar>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" title="历史任务" @backClick="backTo"></nav-bar>
		</view>
		<view class="time-change-box">
			<view class="time-change-text">至</view>
			<view class="time-change-left">
				<u-field @click="showAction"  v-model="dateStart" :disabled="true" right-icon="calendar"></u-field>
			</view>
			<view class="time-change-right">
				<u-field @click="showAction" v-model="dateEnd" :disabled="true" right-icon="calendar"></u-field>
			</view>
		</view>
		<view class="search">
			<button @click="searchEvent">搜索</button>
		</view>
		<view class="task-tail-content-box">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="tabChange"></u-tabs>
			<view class="task-tail-content" v-show="current == 0">
				<view class="task-tail-content-item" v-for="(item,index) in completeTaskLit" :key="index">
					<view class="item-top">
						<view class="item-top-left">
							<view class="number">
								<text>编号: {{item.number}}</text>
							</view>
							<view class="start-point">
								<text>出发地: {{item.startPoint}}</text>
							</view>
							<view class="transport-type">
								<text>运送类型: {{item.transportType}}</text>
							</view>
							<view class="bed-number">
								<text>床号: {{item.bedNumber}}</text>
							</view>
							<view class="createTime">
								<text>创建时间: {{item.createTime}}</text>
							</view>
						</view>
						<view class="item-top-right">
							<view class="priority">
								<text>状态: {{item.status}}</text>
							</view>
							<view class="destination-point">
								<text>目的地: {{item.destinationPoint}}</text>
							</view>
							<view class="transport-people">
								<text>运送人: {{item.transportPeople}}</text>
							</view>
							<view class="transport-tool">
								<text>转运工具: {{item.transportTool}}</text>
							</view>
							<view class="transport-tool">
								<text>耗时: {{item.consumeTime}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="task-tail-content task-tail-content-going" v-show="current == 1">
				<view class="task-tail-content-item" v-for="(item,index) in cancelTaskLit" :key="index">
					<view class="item-top">
						<view class="item-top-left">
							<view class="number">
								<text>编号: {{item.number}}</text>
							</view>
							<view class="start-point">
								<text>出发地: {{item.startPoint}}</text>
							</view>
							<view class="transport-type">
								<text>运送类型: {{item.transportType}}</text>
							</view>
							<view class="bed-number">
								<text>床号: {{item.bedNumber}}</text>
							</view>
						</view>
						<view class="item-top-right">
							<view class="priority">
								<text>状态: {{item.status}}</text>
							</view>
							<view class="destination-point">
								<text>目的地: {{item.destinationPoint}}</text>
							</view>
							<view class="transport-people">
								<text>运送人: {{item.transportPeople}}</text>
							</view>
							<view class="transport-tool">
								<text>转运工具: {{item.transportTool}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<bottom-bar :itemIndex="2" @itemEvent="clickEvent"></bottom-bar>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache, getDate } from '@/common/js/utils'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components:{
			navBar
		},
		data() {
			return {
				dateStart: '',
				dateEnd: '',
				show: false,
				mode: 'range',
				content: '',
				list: [{name: '已完成'}, {name: '已取消'}],
				completeTaskLit: [
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						createTime: '2020-8-30 13:00',
						consumeTime: '2020-8-30 13:00'
					},
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						createTime: '2020-8-30 13:00',
						consumeTime: '2020-8-30 13:00'
					},
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						createTime: '2020-8-30 13:00',
						consumeTime: '2020-8-30 13:00'
					}
				],
				cancelTaskLit: [
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						cancelTime: '2020-8-30 13:00'
					},
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						cancelTime: '2020-8-30 13:00'
					}
				],
				current: 0
			}
		},
		onLoad (options) {
			this.taskTypeText = this.titleText
		},
		computed: {
		    ...mapGetters([
				'titleText',
				'isToCallTaskPage'
		    ])
		},
		
		mounted () {
			this.initDate()
		},
		
		methods: {
			...mapMutations([
				'changeTitleText',
				'changeBottomBarIndex',
				'changeIsToCallTaskPage'
			]),
			
			// 触发日历显示事件
			showAction () {
				this.show = true
			},
			
			// tab切换改变事件
			tabChange (index) {
				this.current = index;
			},
			
			// 初始化当前日期
			initDate () {
				this.dateStart = getDate();
				this.dateEnd = getDate()
			},
			
			// 返回上一页
			backTo () {
				this.changeBottomBarIndex(-1);
				uni.navigateTo({
				    url: '/pages/centerTransport/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},
			
			// 日期变化事件
			dateChange(e) {
				console.log(e);
				this.dateStart = e.startDate;
				this.dateEnd = e.endDate
			},
			
			// 搜索事件
			searchEvent () {
				
			},
			
			clickEvent (item) {
				if (item.text == "呼叫") {
					if (this.isToCallTaskPage) {
						this.backTo()
					} else {
						uni.redirectTo ({
							url: '/pages/callTask/callTask'
						});
						this.changeBottomBarIndex(0);
						this.changeIsToCallTaskPage(true)
					}
				} else if (item.text == "任务跟踪") {
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
		.nav {
			width: 100%;
		};
		.time-change-box {
			height: 60px;
			width: 100%;
			padding: 10px;
			box-sizing: boredr-box;
			position: relative;
			.time-change-text {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 60px;
				line-height: 60px;
				text-align: center
			}
			.time-change-left {
				width: 45%;
				height: 100%;
				float: left;
				/deep/ .u-field {
					border: 1px solid #aaa;
					padding: 5px 15px;
					.u-label {
						flex: 0 0 0 !important
					}
					.u-icon__icon {
						font-size: 26px !important
					}
				}
			};
			.time-change-right {
				width: 45%;
				height: 100%;
				float: right;
				/deep/ .u-field {
					border: 1px solid #aaa;
					padding: 5px 15px;
					.u-label {
						flex: 0 0 0 !important
					}
					.u-icon__icon {
						font-size: 26px !important
					}
				}
			}
		}
		.search {
			width: 100px;
			height: 40px;
			margin: 0 auto;
			button {
				font-size: 14px;
				color: #fff;
				background: #278ee6
			}
		}
		.task-tail-content-box {
			width: 100%;
			flex: 1;
			overflow: auto;
			.task-tail-content {
				height: 94%;
				overflow: auto;
				.task-tail-content-item {
					padding: 10px;
					box-sizing: border-box;
					border-top: 1px solid #ccc;
					border-bottom: 1px solid #ccc;
					margin-bottom: 6px;
					&:last-child {
						margin-bottom: 0
					};
					.item-top {
						width: 100%;
						display: inline-block;
						font-size: 16px;
						color: black;
						font-weight: bold;
						.item-top-left {
							width: 55%;
							float: left;
							height: 100%;
							> view {
								line-height: 35px;
							}
							.number {
								text {
									font-size: 14px;
									color: #b3babb;
								}
							}
						};
						.item-top-right {
							width: 45%;
							float: right;
							height: 100%;
							> view {
								line-height: 35px;
							}
							.priority {
								text {
									font-size: 14px
								}
							}
						}
					}
				}
			}
			.task-tail-content-going {
				.item-bottom {
					.item-bottom-right {
						.left {
							float: right !important
						}
					}
				}
			}
		}
	};
	.bottom-bar {
		height: 65px;
		width: 100%;
	}
</style>
