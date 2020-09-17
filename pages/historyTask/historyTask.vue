<template>
	<view class="container">
		<u-calendar v-model="show" :mode="mode" @change="dateChange"></u-calendar>
		<u-toast ref="uToast" />
		<view class="empty-info" v-show="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="加载中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
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
			<button @click="searchCompleteTask">搜索</button>
		</view>
		<view class="task-tail-content-box">
			<u-tabs :list="list" :is-scroll="false" font-size="35" bar-width="150" :current="current" @change="tabChange"></u-tabs>
			<view class="task-tail-content" v-show="current == 0">
				<view class="task-tail-content-item" v-for="(item,index) in stateCompleteList" :key="index">
					<view class="item-top">
						<view class="item-top-left">
							<view class="number">
								<text>编号: {{item.number}}</text>
							</view>
							<view class="start-point">
								<text>出发地: {{item.setOutPlaceName}}</text>
							</view>
							<view class="transport-type">
								<text>运送类型: {{item.taskTypeName}}</text>
							</view>
							<view class="bed-number">
								<text>床号: {{item.bedNumber}}</text>
							</view>
							<view class="createTime">
								<text>创建时间: {{item.createTime}}</text>
							</view>
						</view>
						<view class="item-top-right">
							<view class="priority status">
								<text>状态:</text>&nbsp;
								<text>{{stateTransfer(item.state)}}</text>
							</view>
							<view class="destination-point">
								<text>目的地: </text>
								<text v-for="(item,index) in item.distName" :key="index">{{item}}</text>
							</view>
							<view class="transport-people">
								<text>运送人: {{item.workerName}}</text>
							</view>
							<view class="transport-tool">
								<text>转运工具: {{item.toolName}}</text>
							</view>
							<view class="transport-tool">
								<text>耗时: {{consueTime(item.responseTime,item.finishTime)}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="task-tail-content task-tail-content-going" v-show="current == 1">
				<view class="task-tail-content-item" v-for="(item,index) in stateCompleteList" :key="index">
					<view class="item-top">
						<view class="item-top-left">
							<view class="number">
								<text>编号: {{item.number}}</text>
							</view>
							<view class="start-point">
								<text>出发地: {{item.setOutPlaceName}}</text>
							</view>
							<view class="transport-type">
								<text>运送类型: {{item.taskTypeName}}</text>
							</view>
							<view class="bed-number">
								<text>床号: {{item.bedNumber}}</text>
							</view>
						</view>
						<view class="item-top-right">
							<view class="priority status">
								<text>状态:</text>&nbsp;
								<text>{{stateTransfer(item.state)}}</text>
							</view>
							<view class="destination-point">
								<text>目的地: </text>
								<text v-for="(item,index) in item.distName" :key="index">{{item}}</text>
							</view>
							<view class="transport-people">
								<text>运送人: {{item.workerName}}</text>
							</view>
							<view class="transport-tool">
								<text>转运工具: {{item.toolName}}</text>
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
	import SOtime from '@/common/js/utils/SOtime.js'
	import {getDispatchTaskComplete} from '@/api/task.js'
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
				isFresh: false,
				mode: 'range',
				content: '',
				showLoadingHint: false,
				noDataShow: false,
				list: [{name: '已完成'}, {name: '已取消'}],
				stateCompleteList: [],
				current: 0
			}
		},
		onLoad (options) {
			this.taskTypeText = this.titleText
		},
		// 监听页面下拉刷新事件
		onPullDownRefresh() {
			this.isFresh = true;
			if (this.current === 0) {
			  this.queryCompleteDispatchTask(
				{
				  proId:this.proId, workerId:'',state:7,
				  startDate: this.dateStart, endDate: this.dateEnd,
				  departmentId: this.userInfo.depId
				}
			  )
			} else {
			  this.queryCompleteDispatchTask(
				{
				  proId:this.proId, workerId:'',state:6,
				  startDate: this.dateStart, endDate: this.dateEnd,
				  departmentId: this.userInfo.depId
				}
			  )
			}
		},
		computed: {
		    ...mapGetters([
				'titleText',
				'isToCallTaskPage',
				'userInfo'
		    ]),
			userName () {
				return this.userInfo.userName
			},
			proId () {
				return this.userInfo.extendData.proId
			},
			proName () {
				return this.userInfo.extendData.proName
			},
			workerId () {
				return this.userInfo.extendData.userId
			},
			accountName () {
				return this.userInfo.name
			}
		},
		
		mounted () {
			this.initDate();
			this.queryCompleteDispatchTask(
				{
				  proId:this.proId, workerId:'',state:7,
				  startDate: this.dateStart, endDate: this.dateEnd,
				  departmentId: this.userInfo.depId
				}
			)
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
			
			// 任务优先级转换
		  priorityTransfer (index) {
			switch(index) {
			  case 1 :
				return '正常'
				break;
			  case 2 :
				return '重要'
				break;
			  case 3 :
				return '紧急'
				break;
			  case 4 :
				return '紧急重要'
				break;
			}
		  },
		  
		  // 耗时
		  consueTime (t1,t2) {
			  if (t1 && t2) {
				return SOtime.time5(t1,t2)
			  }
		  },
						
			// 任务状态转换
			stateTransfer (index) {
				switch(index) {
				  case 0 :
					return '未分配'
					break;
				  case 1 :
					return '未查阅'
					break;
				  case 2 :
					return '未开始'
					break;
				  case 3 :
					return '进行中'
					break;
				  case 4 :
					return '未结束'
					break;
				  case 5 :
					return '已延迟'
					break;
				  case 6 :
					return '已取消'
					break;
				  case 7 :
					return '已完成'
					break;
				}
			},
			
			// tab切换改变事件
			tabChange (index) {
				this.current = index;
				if (index === 0) {
				  this.queryCompleteDispatchTask(
					{
					  proId:this.proId, workerId:'',state:7,
					  startDate: this.dateStart, endDate: this.dateEnd,
					  departmentId: this.userInfo.depId
					}
				  )
				} else {
				  this.queryCompleteDispatchTask(
					{
					  proId:this.proId, workerId:'',state:6,
					  startDate: this.dateStart, endDate: this.dateEnd,
					  departmentId: this.userInfo.depId
					}
				  )
				}
			},
			
			// 搜索完成的任务
			  searchCompleteTask () {
				if (this.current === 0) {
				  this.queryCompleteDispatchTask(
					{
					  proId:this.proId, workerId:'',state:7,
					  startDate: this.dateStart, endDate: this.dateEnd,
					  departmentId: this.userInfo.depId
					}
				  )
				} else {
				  this.queryCompleteDispatchTask(
					{
					  proId:this.proId, workerId:'',state:6,
					  startDate: this.dateStart, endDate: this.dateEnd,
					  departmentId: this.userInfo.depId
					}
				  )
				}
			  },
			  
			  // 查询历史调度任务(已完成)
				queryCompleteDispatchTask (data) {
				  this.noDataShow = false;
				  this.showLoadingHint = true;
				  getDispatchTaskComplete(data).then((res) => {
					this.showLoadingHint = false;
					this.stateCompleteList = [];
					if (this.isFresh) {
						uni.stopPullDownRefresh();
						this.isFresh = false
					};
					if (res && res.data.code == 200) {
					  if (res.data.data.length > 0) {
						this.noDataShow = false;
						for (let item of res.data.data) {
							this.stateCompleteList.push({
							  createTime: item.createTime,
							  responseTime: item.responseTime,
							  planStartTime: item.planStartTime,
							  state: item.state,
							  setOutPlaceName: item.setOutPlaceName,
							  destinationName: item.destinationName,
							  taskTypeName: item.taskTypeName,
							  toolName: item.toolName,
							  finishTime: item.finishTime,
							  priority: item.priority,
							  id: item.id,
							  number: item.taskNumber,
							  distName: item.distName,
							  patientName: item.patientName,
							  bedNumber: item.bedNumber,
							  startPhoto: item.startPhoto,
							  endPhoto: item.endPhoto,
							  isBack: item.isBack,
							  isSign: item.isSign,
							  workerName: item.workerName,
							})
						}
					  } else {
						this.noDataShow = true
					  }
					}
				  })
				  .catch((err) => {
					this.$refs.uToast.show({
						title: `${err.message}`,
						type: 'error'
					});
					this.showLoadingHint = false;
					this.noDataShow = true;
					if (this.isFresh) {
						uni.stopPullDownRefresh();
						this.isFresh = false
					}
				  })
				},
			
			// 初始化当前日期
			initDate () {
				this.dateStart = getDate();
				this.dateEnd = getDate()
			},
			
			// 返回上一页
			backTo () {
				this.changeBottomBarIndex(-1);
				uni.redirectTo({
				    url: '/pages/centerTransport/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},
			
			// 日期变化事件
			dateChange(e) {
				this.dateStart = e.startDate;
				this.dateEnd = e.endDate
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
		position: relative;
		.empty-info {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto
		};
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
					border: 1px solid #d8d7d7;
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
					border: 1px solid #d8d7d7;
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
				position: relative;
				background: #f7f7f7;
				.empty-info {
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
					right: 0;
					margin: auto
				};
				.task-tail-content-item {
					background: #FFFFFF;
					width: 98%;
					margin: 0 auto;
					margin-top: 6px;
					border-radius: 4px;
					&:last-child {
						margin-bottom: 6px
					};
					.item-top {
						width: 100%;
						display: inline-block;
						font-size: 16px;
						color: black;
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
									color: #278ee6;
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
							};
							.destination-point {
								text {
									&:not(:first-child) {
										margin-right: 4px
									}
								}
							};
							.status {
								text {
									&:last-child {
										color: red
									}
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
		height: 50px;
		width: 100%;
	}
</style>
