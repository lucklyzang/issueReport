<template>
	<view class="container">
		<view>
			<u-picker mode="time" v-model="startShow" :params="params" @confirm="startDateSure"></u-picker>
		</view>
		<view>
			<u-picker mode="time" v-model="endShow" :params="params" @confirm="endDateSure"></u-picker>
		</view>
		<u-toast ref="uToast" />
		<view class="empty-info" v-show="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="加载中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="历史任务" @backClick="backTo"></nav-bar>
		</view>
		<view class="time-change-box">
			<view class="time-change-text">至</view>
			<view class="time-change-left">
				<u-field @click="showActionStart"  v-model="dateStart" :disabled="true" right-icon="calendar"></u-field>
			</view>
			<view class="time-change-right">
				<u-field @click="showActionEnd" v-model="dateEnd" :disabled="true" right-icon="calendar"></u-field>
			</view>
		</view>
		<!-- <view class="search">
			<button @click="searchCompleteTask">搜索</button>
		</view> -->
		<view class="task-tail-content-box">
			<u-tabs :list="list" :is-scroll="false" font-size="35" bar-width="150" active-color="#2c9af1" inactive-color="#7d7d7d" :current="current" @change="tabChange"></u-tabs>
			<view class="task-tail-content" v-show="current == 0">
				<view class="task-tail-content-item" v-for="(item,index) in stateCompleteList" :key="index">
					<view class="item-top">
						<view class="item-top-one">
							<view class="number">
								<text>编号 : {{item.number}}</text>
							</view>
							<view class="priority" style="color:'#94e178'">
								<text>{{stateTransfer(item.state)}}</text>
							</view>
						</view>
						<view class="item-top-two">
							<view class="start-point">
								<text>优先级 :</text>
								<text>{{priorityTransfer(item.priority)}}</text>
							</view>
							<view class="destination-point" v-if="templateType == 'template_one'">
								<text>运送类型 :</text>
								<text>{{item.taskTypeName}}</text>
							</view>
							<view class="destination-point" v-else-if="templateType === 'template_two'">
								<text>运送类型 :</text>
								<text>{{item.patientInfoList[0].typeList[0].parentTypeName}}</text>
							</view>
						</view>
						<view class="item-top-three">
							<view class="transport-type">
								<text>转运工具 :</text>
								<text>{{item.toolName}}</text>
							</view>
							<view class="transport-people">
								<text>运送人 :</text>
								<text>{{item.workerName}}</text>
							</view>
						</view>
						<view class="item-top-three">
							<view class="start-point">
								<text>出发地 :</text>
								<text>{{item.setOutPlaceName}}</text>
							</view>
							<view class="bed-number" v-if="templateType === 'template_one'">
								<text>床号: </text>
								<text>{{item.bedNumber}}</text>
							</view>
							<view class="bed-number" v-else-if="templateType === 'template_two'">
								<text>床号 :</text>
								<text>{{item.patientInfoList[0].bedNumber}}</text>
							</view>
						</view>
						<view class="item-top-four">
							<view class="bed-number">
								<text>目的地: </text>
								<text class="destina-list" v-for="(item,index) in item.destinations" :key="index">{{item.destinationName}}</text>
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
							<view class="transport-tool">
								<text>耗时: {{consueTime(item.responseTime,item.finishTime)}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="task-tail-content" v-show="current == 1">
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
								<view class="destination-point" v-if="templateType == 'template_one'">
									<text>运送类型 :</text>
									<text>{{item.taskTypeName}}</text>
								</view>
								<view class="destination-point" v-else-if="templateType === 'template_two'">
									<text>运送类型 :</text>
									<text>{{item.patientInfoList[0].typeList[0].parentTypeName}}</text>
								</view>
							</view>
							<view class="item-top-three">
								<view class="transport-type">
									<text>转运工具 :</text>
									<text>{{item.toolName}}</text>
								</view>
								<view class="transport-people">
									<text>运送人 :</text>
									<text>{{item.workerName}}</text>
								</view>
							</view>
							<view class="item-top-three">
								<view class="start-point">
									<text>出发地 :</text>
									<text>{{item.setOutPlaceName}}</text>
								</view>
								<view class="bed-number" v-if="templateType === 'template_one'">
									<text>床号: </text>
									<text>{{item.bedNumber}}</text>
								</view>
								<view class="bed-number" v-else-if="templateType === 'template_two'">
									<text>床号 :</text>
									<text>{{item.patientInfoList[0].bedNumber}}</text>
								</view>
							</view>
							<view class="item-top-four">
								<view class="bed-number">
									<text>目的地: </text>
									<text class="destina-list" v-for="(item,index) in item.destinations" :key="index">{{item.destinationName}}</text>
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
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				startShow: false,
				endShow: false,
				dateStart: '',
				dateEnd: '',
				isFresh: false,
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
        'userInfo',
				'templateType'
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
			
			// 触发日历显示事件开始日期
			showActionStart () {
				this.startShow = true
			},
			
			// 触发日历显示事件结束日期
			showActionEnd () {
				this.endShow = true
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
									patientInfoList: item.patientInfoList,
                  distName: item.distName,
									destinations: item.destinations,
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
				this.changeBottomBarIndex(0);
				uni.redirectTo({
				    url: '/pages/centerTransport/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},
			
			
			// 开始时间确定
			startDateSure(e) {
				this.dateStart = `${e.year}-${e.month}-${e.day}`;
				if (SOtime.time6(this.dateEnd) < SOtime.time6(this.dateStart)) {
					this.$refs.uToast.show({
					  title: `结束日期不能小于开始日期`,
					  type: 'warning'
					});
					return
				};
				this.searchCompleteTask()
			},
			
			// 结束日期确定
			endDateSure(e) {
				this.dateEnd = `${e.year}-${e.month}-${e.day}`;
				if (SOtime.time6(this.dateEnd) < SOtime.time6(this.dateStart)) {
					this.$refs.uToast.show({
					  title: `结束日期不能小于开始日期`,
					  type: 'warning'
					});
					return
				};
				this.searchCompleteTask()
			},
			
			clickEvent (item) {
				if (item.text == "呼叫下单") {
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
									overflow: auto;
					      };
					      &:last-child {
					        width: 40%;
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
							 back-sizing: border-box;
							 font-size: 15px;
							 background: #f7f7f7;
							 > view {
								height: 80px;
								width: 100%;
								overflow: auto;
								.destina-list {
									color: $color-text-right;
									margin-right: 4px;
									font-weight: bold
								};
								text {
									display: inline-block;
									&:first-child {
										color: $color-text-left;
										margin-right: 4px
									};
								}
							}
					  }
					}
				}
			}
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
						line-height: 40px;
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
			}
		}
	};
	.bottom-bar {
		height: 50px;
		width: 100%;
	}
</style>
