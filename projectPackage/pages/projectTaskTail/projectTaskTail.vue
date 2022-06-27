<template>
	<view class="container">
		<u-modal v-model="sureCancelShow"  title="取消原因" 
		:show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
			<view class="slot-content">
			  <view :class="{'spanStyle':cancelIndex == index}" v-for="(item,index) in cancelReasonLlist" :key="index" @click="cancelReasonCheck(item.text,index)">
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
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="任务跟踪" @backClick="backTo"></nav-bar>
		</view>
		<view class="task-tail-content-box">
			<view class="task-tail-title">
				<u-tabs :list="list" :is-scroll="false" font-size="35" active-color="#2c9af1" inactive-color="#7d7d7d" bar-width="150" :current="current" @change="tabChange"></u-tabs>
			</view>
			<view class="task-tail-content" v-show="current == 0">
				<view class="task-tail-content-item" v-for="(item,index) in stateCompleteList" :key="index">
					<view class="item-top">
						<view class="item-top-one">
							<view class="number">
								<text>编号 : {{item.number}}</text>
							</view>
              <view class="priority">
              	<text>{{stateTransfer(item.state)}}</text>
              </view>
            </view>
            <view class="item-top-two">
              <view class="start-point">
								<text>优先级 :</text>
              	<text>{{priorityTransfer(item.priority)}}</text>
              </view>
            	<view class="destination-point">
								<text>任务类型 :</text>
            		<text>{{item.taskTypeName}}</text>
            	</view>
            </view>
            <view class="item-top-three">
            	<view class="transport-type">
								<text>目的地 :</text>
            		<text>{{item.destinationName}}</text>
            	</view>
              <view class="transport-people">
								<text>维修人员 :</text>
              	<text>{{item.workerName}}</text>
              </view>
            </view>
            <view class="item-top-four">
              <view class="bed-number">
								<text>任务描述 :</text>
              	<text>{{item.taskDesc}}</text>
              </view>
						</view>
					</view>
					<view class="item-bottom">
						<view class="item-bottom-left">
							<view class="time">
								<text>{{item.createTime}}</text>
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
				<view class="task-tail-content-item" v-for="(item,index) in stateCompleteList" :key="index">
					<view class="item-top">
						<view class="item-top-one">
							<view class="number">
								<text>编号 : {{item.number}}</text>
							</view>
						  <view class="priority">
						  	<text style="color:rgb(148 225 120)">{{stateTransfer(item.state)}}</text>
						  </view>
						</view>
						<view class="item-top-two">
						  <view class="start-point">
								<text>优先级 :</text>
						  	<text> {{priorityTransfer(item.priority)}}</text>
						  </view>
							<view class="destination-point">
								<text>任务类型 :</text>
								<text> {{item.taskTypeName}}</text>
							</view>
						</view>
						<view class="item-top-three">
							<view class="transport-type">
								<text>目的地 :</text>
								<text>{{item.destinationName}}</text>
							</view>
						  <view class="transport-people">
								<text>维修人员 :</text>
						  	<text>{{item.workerName}}</text>
						  </view>
						</view>
						<view class="item-top-four">
						  <view class="bed-number">
								<text>任务描述 :</text>
						  	<text>{{item.taskDesc}}</text>
						  </view>
						</view>
					</view>
					<view class="item-bottom-complete">
						<view class="item-bottom-left">
							<view class="time">
								<text>开始-完成时间 :</text>
								<text>{{item.createTime}}-{{item.finishTime}}</text>
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
	import { projectTaskCancel, projectTaskCancelReason, getMaintainTask, projectTaskReminder} from '@/api/task.js'
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
				cancelIndex: null,
				list: [{name: '进行中'}, {name: '已完成'}],
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
			  this.queryProjectTask(
				{
				   proId:this.proId, workerId:'',state: 3,
				   startDate: '', endDate: ''
				}
			  )
			} else {
			  this.queryProjectTask(
				{
				   proId:this.proId, workerId:'',state: 5,
				   startDate: '', endDate: ''
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
			this.queryProjectTask(
				{
				   proId:this.proId, workerId:'',state: 3,
				   startDate: '', endDate: ''
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
				    url: '/projectPackage/pages/projectManagement/index/index'
				});
				this.changeBottomBarIndex(0);
				this.changeIsToCallTaskPage(false)
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
			
			// 任务状态转换
			stateTransfer (index) {
				switch(index) {
				  case 0 :
					return '未分配'
					break;
				  case 1 :
					return '未获取'
					break;
				  case 2 :
					return '未开始'
					break;
				  case 3 :
					return '进行中'
					break;
				  case 4 :
					return '待签字'
					break;
				  case 5 :
					return '已完成'
					break;
				  case 6 :
					return '已取消'
					break;
				  case 7 :
					return '已延迟'
					break;
				}
			},
		  
			// 获取取消原因列表
      getProjectTaskCancelReason (data) {
        projectTaskCancelReason(data).then((res) => {
          if (res && res.data.code == 200) {
            this.cancelReasonLlist = [];
            for (let item of res.data.data) {
               this.cancelReasonLlist.push({text: item.cancelName, value: item.id})
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
      },
			  
			// 取消原因列表点击事件
			cancelReasonCheck (item,index) {
			  this.cancelIndex = index;
			  this.taskCancelReason = item
			},
			  
			// 调度任务的取消
			cancelProjectTask (data) {
			  projectTaskCancel(data)
			  .then((res) => {
				if (res && res.data.code == 200) {
				  this.$refs.uToast.show({
				  	title: `${res.data.msg}`,
				  	type: 'success'
				  });
				  this.queryProjectTask(
					{
					   proId:this.proId, workerId:'',state: 3,
					   startDate: '', endDate: ''
					}
				  )
				} else {
				 this.$refs.uToast.show({
				 	title: `${res.data.msg}`,
				 	type: 'warning'
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
			  projectTaskReminder(this.proId,item.id).then((res) => {
          if (res && res.data.code == 200) {
            this.$refs.uToast.show({
              title: `${res.data.data}`,
              type: 'success'
            })
          } else {
            this.$refs.uToast.show({
              title: `${res.data.msg}`,
              type: 'warning'
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
				  this.queryProjectTask(
					{
					   proId:this.proId, workerId:'',state: 3,
					   startDate: '', endDate: ''
					}
				  )
				} else {
				  this.queryProjectTask(
					{
					   proId:this.proId, workerId:'',state: 5,
					   startDate: '', endDate: ''
					}
				  )
				}
			},
			
			// 查询工程维修任务
			queryProjectTask (data) {
			  this.noDataShow = false;
			  this.showLoadingHint = true;
			  getMaintainTask(data).then((res) => {
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
              startTime: item.startTime,
						  finalFinishTime: item.finalFinishTime,
              finishTime: item.finishTime,
						  state: item.state,
						  destinationName: item.depName,
						  taskTypeName: item.typeName,
						  priority: item.priority,
						  number: item.taskNumber,
						  id: item.id,
						  taskDesc: item.taskDesc,
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
				this.cancelIndex = null;
				this.taskCancelReason = '';
				this.getProjectTaskCancelReason({proId: this.proId,state: 0,reason: ''});
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
				this.cancelProjectTask({
					proId: this.proId,	//当前项目ID
					taskId: this.taskId, //当前任务ID
					reason: this.taskCancelReason //取消原因
				  })
			},
			
			// 弹框取消事件
			cancelSure () {},
			
			clickEvent (item) {
				if (item.text == "任务跟踪") {
					uni.redirectTo({
						url: '/projectPackage/pages/projectTaskTail/projectTaskTail'
					});
					this.changeBottomBarIndex(1);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "呼叫下单") {
					if (this.isToCallTaskPage) {
						this.backTo()
					} else {
						uni.redirectTo({
							url: '/projectPackage/pages/projectRepairs/projectRepairs'
						});
						this.changeBottomBarIndex(0);
						this.changeIsToCallTaskPage(true)
					}
				} else if (item.text == "历史任务") {
					uni.redirectTo({
						url: '/projectPackage/pages/projectHistoryTask/projectHistoryTask'
					});
					this.changeBottomBarIndex(2);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "意见反馈") {
					uni.redirectTo({
						url: '/projectPackage/pages/totalFeedbackIdea/totalFeedbackIdea'
					});
					this.changeBottomBarIndex(3);
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
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);
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
				padding: 10px;
				box-sizing: border-box;
				-webkit-overflow-scrolling: touch;
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
					border-radius: 4px;
					text-align: center;
					line-height: 40px;
					margin-bottom: 4%
				};
				 .spanStyle {
					background: #d6f4ff;
					color: #01a6ff;
					border: 1px solid #4cc5f2;
				}
			};
			.u-model__footer {
				justify-content: space-between;
				padding: 6px;
				.u-model__footer__button {
					border-radius: 30px;
					flex: 0 0 45%;
					margin-top: 4px;
					height: 40px;
					line-height: 40px;
					background: #e8e8e8;
					color: #666666
				}
			;
				.hairline-left {
					border-radius: 30px;
					flex: 0 0 45%;
					margin-top: 4px;
					background: #fff;
					color: #43c3f4 !important;
					border: 1px solid #43c3f4
				}
			}
		}
		.task-tail-content-box {
			width: 100%;
			flex: 1;
			.task-tail-content {
				height: 93%;
				-webkit-overflow-scrolling: touch;
				overflow: auto;
				background: #f7f7f7;
				.task-tail-content-item {
					width: 100%;
					margin: 0 auto;
					padding: 0;
					border-radius: 4px;
					background: #FFFFFF;
					&:last-child {
						margin-bottom: 6px
					};
					.item-top {
						width: 100%;
						font-size: 16px;
						display: inline-block;
						color: black;
            > view {
              padding: 6px 0;
              display: flex;
              box-sizing: border-box;
              flex-flow: row nowrap;
              > view {
                width: 50%;
                > text {
                  &:last-child {
                    padding-left: 0;
                  }
                }
              }
            };
            .item-top-one {
							height:40px;
							padding: 0 12px;
							background: #f9f9f9;
              > view {
								height: 20px;
								line-height: 20px;
								margin-top: 10px;
                word-break: break-all;
                font-size: 13px;
                text {
                  color: #333;
                };
                &:first-child {
                  width: 60%;
									-webkit-overflow-scrolling: touch;
									overflow: auto;
                };
                &:last-child {
                  width: 40%;
									-webkit-overflow-scrolling: touch;
									overflow: auto;
                  text-align: right;
                  > text {
                    &:first-child {
                      color: black
                    };
                    &:last-child {
                      color: red;
											display: inline-block;
											width: 80px;
											text-align: center;
											background: #fff;
											border-radius: 4px;
                    }
                  }
                }
              }
            };
						.item-top-two {
							height:40px;
							padding: 0 12px;
							> view {
								height: 40px;
								line-height: 40px;
							  &:first-child {
							    width: 60%;
									-webkit-overflow-scrolling: touch;
									overflow: auto;
									text {
										&:first-child {
											color: $color-text-left;
											margin-right: 4px
										};
										&:last-child {
											color: $color-text-right;
											font-weight: bold
										}
									}
							  };
							  &:last-child {
									width: 40%;
									-webkit-overflow-scrolling: touch;
									overflow: auto;
									text {
										&:first-child {
											color: $color-text-left;
											margin-right: 4px
										};
										&:last-child {
											color: $color-text-right;
											font-weight: bold
										}
									}
								}
							}
						};
            .item-top-three {
              height:40px;
              padding: 0 12px;
              > view {
              	height: 40px;
              	line-height: 40px;
                &:first-child {
                  width: 60%;
									-webkit-overflow-scrolling: touch;
              		overflow: auto;
              		text {
              			&:first-child {
              				color: $color-text-left;
											margin-right: 4px
              			};
              			&:last-child {
              				color: $color-text-right;
											font-weight: bold
              			}
              		}
                };
                &:last-child {
									width: 40%;
									-webkit-overflow-scrolling: touch;
									overflow: auto;
              		text {
              			&:first-child {
              				color: $color-text-left;
											margin-right: 4px
              			};
              			&:last-child {
              				color: $color-text-right;
											font-weight: bold
              			}
              		}
              	}
              }
            };
            .item-top-four {
							 height:80px;
							 padding: 4px 12px;
							 font-size: 15px;
							 background: #f7f7f7;
							 box-sizing: border-box;
							 > view {
								height: 80px;
								width: 100%;
								-webkit-overflow-scrolling: touch;
								overflow: auto;
								text {
									display: inline-block;
									&:first-child {
										color: $color-text-left;
										margin-right: 4px
									};
									&:last-child {
										width:70%;
										color: $color-text-right;
										font-weight: bold
									}
								}
							}
            }
           };
					.item-bottom {
						width: 100%;
						display: inline-block;
						.item-bottom-left {
							width: 45%;
							height: 70px;
							float: left;
							font-size: 14px;
							color: black;
              padding-left: 12px;
							.time {
								height: 70px;
                position: relative;
								text {
                  width: 100%;
                  display: inline-block;
                  position: absolute;
                  left: 0;
                  top: 50%;
                  transform: translateY(-50%);
									color: #c2c8cb
								}
							}
						}
						.item-bottom-right {
							width: 55%;
							height: 70px;
							float: right;
              position: relative;
							> view {
								width: 45%;
								height: 40px;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                > button {
                  color: #fff;
                  height: 100%;
                  font-size: 16px;
                }
							}
							.left  {
								left: 0;
								button {
									background: #5ab3ff
								}
							};
							.right  {
								right: 0;
								button {
									color: #666;
									background: #e8e8e8
								}
							}
						}
					};
          .item-bottom-complete {
            height: 40px;
            position: relative;
						padding: 0 12px;
						-webkit-overflow-scrolling: touch;
						overflow: auto;
            .item-bottom-left {
              width: 100%;
               position: absolute;
               top: 50%;
               transform: translateY(-50%);
               > view {
                 text {
									 &:first-child {
										 margin-right: 4px;
									 };
                   display: inline-block;
                   color: #aaa9a7
                 }
               }
            }
          };
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