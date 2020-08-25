<template>
	<view class="container">
		<u-modal v-model="sureCancelShow"  title="取消原因" 
		:show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
			<view class="slot-content">
			  <view :class="{spanStyle:cancelIndex === index}" v-for="(item,index) in cancelReasonLlist" :key="`${item.text}`" @click="cancelReasonCheck(item,index)">
				{{item.text}}
			  </view> 	
			</view>
		</u-modal>
		<u-toast ref="uToast" />
		<view class="empty-info" v-show="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="加载中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" title="任务跟踪" @backClick="backTo"></nav-bar>
		</view>
		<view class="task-tail-content-box">
			<view class="task-tail-title">
				<u-tabs :list="list" :is-scroll="false" font-size="35" :current="current" @change="tabChange"></u-tabs>
			</view>
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
						</view>
						<view class="item-top-right">
							<view class="priority">
								<text>优先级:</text>
								<text>{{priorityTransfer(item.priority)}}</text>
							</view>
							<view class="destination-point">
								<text>目的地: </text>
								<text v-for="(item,index) in item.distName">{{item}}</text>
							</view>
							<view class="transport-people">
								<text>运送人: {{item.workerName}}</text>
							</view>
							<view class="transport-tool">
								<text>转运工具: {{item.toolName}}</text>
							</view>
						</view>
					</view>
					<view class="item-bottom">
						<view class="item-bottom-left">
							<view class="status">
								<text>状态:</text>&nbsp;
								<text>{{stateTransfer(item.state)}}</text>
							</view>
							<view class="time">
								<text>{{item.createTime}}</text>
							</view>
						</view>
						<view class="item-bottom-right">
							<view class="left">
								<button @click="reminder(item)">催单</button>
							</view>
							<view class="right" v-show="item.state !== 3">
								<button @click="cancel(item)">取消</button>
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
							<view class="priority">
								<text>优先级:</text>
								<text>{{priorityTransfer(item.priority)}}</text>
							</view>
							<view class="destination-point">
								<text>目的地: </text>
								<text v-for="(item,index) in item.distName">{{item}}</text>
							</view>
							<view class="transport-people">
								<text>运送人: {{item.workerName}}</text>
							</view>
							<view class="transport-tool">
								<text>转运工具: {{item.toolName}}</text>
							</view>
						</view>
					</view>
					<view class="item-bottom">
						<view class="item-bottom-left">
							<view class="status">
								<text>状态:</text>&nbsp;
								<text>{{stateTransfer(item.state)}}</text>
							</view>
							<view class="time">
								<text>{{item.createTime}}</text>
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
	import {getDispatchTaskComplete, taskReminder, queryDispatchTaskCancelReason,updateDispatchTask} from '@/api/task.js'
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
				showLoadingHint: false,
				noDataShow: false,
				idFresh : false,
				cancelIndex: '',
				list: [{name: '待办任务'}, {name: '进行中'}],
				stateCompleteList: [],
				current: 0,
				cancelReasonLlist: [],
				taskCancelReason: '',
				taskId: ''
			}
		},
		
		onReady () {
		},
		
		// 监听页面下拉刷新事件
		onPullDownRefresh() {
			this.isFresh = true;
			if (this.current == 0) {
			  this.queryCompleteDispatchTask(
				{
				   proId:this.proId, workerId:'',state: -1,
				   departmentId: this.userInfo.depId
				}
			  )
			} else {
			  this.queryCompleteDispatchTask(
				{
				   proId:this.proId, workerId:'',state: 3,
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
			this.queryCompleteDispatchTask(
				{
				   proId:this.proId, workerId:'',state: -1,
				   departmentId: this.userInfo.depId
				}
			)
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex',
				'changeIsToCallTaskPage'
			]),
			
			// 返回上一页
			backTo () {
				uni.redirectTo({
				    url: '/pages/centerTransport/index/index'
				});
				this.changeBottomBarIndex(-1);
				this.changeIsToCallTaskPage(false)
			},
			
			// 任务优先级转换
			  priorityTransfer (index) {
				switch(index) {
				  case 0 :
					return '正常'
					break;
				  case 1 :
					return '重要'
					break;
				  case 2 :
					return '紧急'
					break;
				  case 3 :
					return '紧急重要'
					break;
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
		  
		  // 获取取消原因列表
		      getDispatchTaskCancelReason (data) {
		        queryDispatchTaskCancelReason(data).then((res) => {
		          if (res && res.data.code == 200) {
		            this.cancelReasonLlist = [];
		            for (let item of res.data.data) {
		              let temporaryWorkerMessageArray = [];
		              for (let innerItem in item) {
		                if (innerItem == 'id') {
		                  temporaryWorkerMessageArray.push(item[innerItem])
		                };
		                if (innerItem == 'cancelName') {
		                  temporaryWorkerMessageArray.push(item[innerItem])
		                }
		              };
		              this.cancelReasonLlist.push({text: temporaryWorkerMessageArray[1], value: temporaryWorkerMessageArray[1]})
		            };
		          }
		        })
		        .catch((err) => {
		          console.log(err)
		        })
		      },
			  
			// 取消原因列表点击事件
			cancelReasonCheck (item,index) {
			  this.cancelIndex = index;
			  this.taskCancelReason = item.text
			},
			  
			// 调度任务的取消
			cancelDispatchTask (data) {
			  updateDispatchTask(data)
			  .then((res) => {
				if (res && res.data.code == 200) {
				  this.$refs.uToast.show({
				  	title: `${res.data.msg}`,
				  	type: 'success'
				  });
				  this.queryCompleteDispatchTask(
					{
					   proId:this.proId, workerId:'',state: -1,
					   departmentId: this.userInfo.depId
					}
				  )
				} else {
				 this.$refs.uToast.show({
				 	title: `${res.data.msg}`,
				 	type: 'success'
				 })
				}
			  })
			  .catch((err) => {
				this.$refs.uToast.show({
					title: `${err.message}`,
					type: 'success'
				})
			  })
			},
			  
		   // 调度任务催单
			reminder(item) {
			  taskReminder(this.proId,item.id).then((res) => {
				if (res && res.data.code == 200) {
				  this.$refs.uToast.show({
				  	title: `${res.data.data}`,
				  	type: 'success'
				  })
				}
			  })
			  .catch((err) => {
				this.$refs.uToast.show({
					title: `${err.message}`,
					type: 'error'
				})
			  })
			},
			
			// tab切换改变事件
			tabChange (index) {
				this.current = index;
				if (index == 0) {
				  this.queryCompleteDispatchTask(
					{
					   proId:this.proId, workerId:'',state: -1,
					   departmentId: this.userInfo.depId
					}
				  )
				} else {
				  this.queryCompleteDispatchTask(
					{
					   proId:this.proId, workerId:'',state: 3,
					   departmentId: this.userInfo.depId
					}
				  )
				}
			},
			
			// 查询调度任务
			queryCompleteDispatchTask (data) {
			  this.noDataShow = false;
			  this.showLoadingHint = true;
			  getDispatchTaskComplete(data).then((res) => {
				this.showLoadingHint = false;
				if (this.isFresh) {
					uni.stopPullDownRefresh();
					this.isFresh = false
				};
				if (res && res.data.code == 200) {
				  this.stateCompleteList = [];
				  if (res.data.data.length > 0) {
					this.noDataShow = false;
					for (let item of res.data.data) {
						this.stateCompleteList.push({
						  createTime: item.createTime,
						  planUseTime: item.planUseTime,
						  planStartTime: item.planStartTime,
						  state: item.state,
						  setOutPlaceName: item.setOutPlaceName,
						  destinationName: item.destinationName,
						  taskTypeName: item.taskTypeName,
						  toolName: item.toolName,
						  priority: item.priority,
						  number: item.taskNumber,
						  id: item.id,
						  distName: item.distName,
						  patientName: item.patientName,
						  bedNumber: item.bedNumber,
						  startPhoto: item.startPhoto,
						  endPhoto: item.endPhoto,
						  isBack: item.isBack,
						  isSign: item.isSign,
						  workerName: item.workerName
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
			
			// 取消事件
			cancel (item) {
				this.sureCancelShow = true;
				this.cancelIndex = '';
				this.taskCancelReason = '';
				this.getDispatchTaskCancelReason({proId: this.proId, state: 0});
				this.taskId = item.id
			},
			
			// 弹框确定事件
			sureCancel () {
				if (this.taskCancelReason === '') {
					this.$refs.uToast.show({
						title: '取消原因不能为空',
						type: 'warning'
					});
					return
				};
				this.cancelDispatchTask({
					proId: this.proId,	//当前项目ID
					id: this.taskId, //当前任务ID
					state: 6, //取消后的状态
					cancelReason: this.taskCancelReason //取消原因
				  })
			},
			
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
			width: 100%
		};
		/deep/ .u-mode-center-box {
			.slot-content {
				padding: 20px 4px 0;
				box-sizing: border-box;
				overflow: auto;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				align-content: flex-start;
				> view {
					width: 48%;
					height: 40px;
					background: #ececec;
					font-size: 14px;
					color: black;
					text-align: center;
					line-height: 40px;
					margin-bottom: 4%
				};
				 .spanStyle {
					color: #fff;
					background: #278ee6
				  }
			}
		}
		.task-tail-content-box {
			width: 100%;
			flex: 1;
			.task-tail-content {
				height: 93%;
				overflow: auto;
				.task-tail-content-item {
					width: 98%;
					margin: 0 auto;
					margin-bottom: 6px;
					border-radius: 4px;
					background: #f7f7f7;
					&:last-child {
						margin-bottom: 0
					};
					.item-top {
						width: 100%;
						font-size: 16px;
						display: inline-block;
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
									font-size: 14px;
									&:last-child {
										color: red
									}
								}
							};
							.destination-point {
								text {
									&:not(:first-child) {
										margin-right: 4px
									}
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
							width: 45%;
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
									color: #278ee6;
								}
							}
						}
						.item-bottom-right {
							width: 55%;
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
									height: 100%;
									font-size: 16px;
									background: #278ee6
								}
							};
							.right  {
								float: right;
								button {
									color: #fff;
									height: 100%;
									font-size: 16px;
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
		height: 50px
	}
</style>
