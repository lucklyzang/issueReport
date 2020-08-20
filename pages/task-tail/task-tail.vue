<template>
	<view class="container">
		<u-modal v-model="sureCancelShow" :content="content" title="确定取消?" 
		:show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
		</u-modal>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" title="任务跟踪" @backClick="backTo"></nav-bar>
		</view>
		<view class="task-tail-content-box">
			<view class="task-tail-title">
				<u-tabs :list="list" :is-scroll="false" :current="current" @change="tabChange"></u-tabs>
			</view>
			<view class="task-tail-content" v-show="current == 0">
				<view class="task-tail-content-item" v-for="(item,index) in waitTaskLit" :key="index">
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
								<text>优先级: {{item.priority}}</text>
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
					<view class="item-bottom">
						<view class="item-bottom-left">
							<view class="status">
								<text>状态:</text>&nbsp;
								<text>{{item.status}}</text>
							</view>
							<view class="time">
								<text>{{item.time}}</text>
							</view>
						</view>
						<view class="item-bottom-right">
							<view class="left">
								<button @click="reminder(item)">催单</button>
							</view>
							<view class="right">
								<button @click="cancel(item)">取消</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="task-tail-content task-tail-content-going" v-show="current == 1">
				<view class="task-tail-content-item" v-for="(item,index) in goingTaskLit" :key="index">
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
								<text>优先级: {{item.priority}}</text>
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
					<view class="item-bottom">
						<view class="item-bottom-left">
							<view class="status">
								<text>状态:</text>&nbsp;
								<text>{{item.status}}</text>
							</view>
							<view class="time">
								<text>{{item.time}}</text>
							</view>
						</view>
						<view class="item-bottom-right">
							<view class="left">
								<button @click="reminder(item)">催单</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<bottom-bar :itemIndex="1" @itemEvent="clickEvent"></bottom-bar>
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
				sureCancelShow: false,
				content: '',
				list: [{name: '代办任务'}, {name: '进行中'}],
				waitTaskLit: [
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						priority: '正常',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						time: '2020-8-30 13:00'
					},
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						priority: '正常',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						time: '2020-8-30 13:00'
					},
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						priority: '正常',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						time: '2020-8-30 13:00'
					}
				],
				goingTaskLit: [
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						priority: '正常',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						time: '2020-8-30 13:00'
					},
					{
						number: 'sasas1212',
						startPoint: '科室一',
						transportType: '检查',
						bedNumber: 'a-10',
						priority: '正常',
						destinationPoint: '科室一',
						transportPeople: '张三',
						transportTool: '平车',
						status: '未获取',
						time: '2020-8-30 13:00'
					}
				],
				current: 0
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
				'changeIsToCallTaskPage'
			]),
			// 返回上一页
			backTo () {
				uni.navigateTo({
				    url: '/pages/centerTransport/index/index'
				});
				this.changeBottomBarIndex(-1);
				this.changeIsToCallTaskPage(false)
			},
			
			// tab切换改变事件
			tabChange (index) {
				this.current = index;
			},
			
			// 催单事件
			reminder () {
				
			},
			
			// 取消事件
			cancel () {
				this.sureCancelShow = true
			},
			
			// 弹框确定事件
			sureCancel () {},
			
			// 弹框取消事件
			cancelSure () {},
			
			clickEvent (item) {
				if (item.text == "任务跟踪") {
					uni.redirectTo({
						url: '/pages/task-tail/task-tail'
					});
					this.changeBottomBarIndex(1);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "呼叫") {
					if (this.isToCallTaskPage) {
						this.backTo()
					} else {
						uni.redirectTo({
							url: '/pages/callTask/callTask'
						});
						this.changeBottomBarIndex(0);
						this.changeIsToCallTaskPage(true)
					}
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
			width: 100%
		};
		.task-tail-content-box {
			width: 100%;
			flex: 1;
			.task-tail-content {
				height: 93%;
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
						font-size: 16px;
						display: inline-block;
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
					};
					.item-bottom {
						width: 100%;
						display: inline-block;
						margin-top: 16px;
						.item-bottom-left {
							margin-top: 10px;
							width: 40%;
							height: 70px;
							float: left;
							font-size: 14px;
							color: black;
							.status {
								margin-bottom: 4px;
								text {
									&:last-child {
										color: red
									}
								}
							}
							.time {
								text {
									color: #b3babb;
								}
							}
						}
						.item-bottom-right {
							width: 60%;
							height: 70px;
							float: right;
							> view {
								width: 45%;
								margin-top: 10px;
								height: 40px;
							}
							.left  {
								float: left;
								button {
									color: #fff;
									background: #278ee6
								}
							};
							.right  {
								float: right;
								button {
									color: #fff;
									background: #616161
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
		width: 100%;
		height: 65px
	}
</style>
