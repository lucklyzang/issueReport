<template>
	<view class="container">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="创建中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" :title="taskTypeText" @backClick="backTo">
      </nav-bar>
		</view>
		<view class="creat-box">
			<view class="creat-priority priority-box">
				<view>优先级</view>
				<view>
					<u-radio-group v-model="priorityValue" @change="radioGroupChange">
						<u-radio name="1" active-color="#8dc58d">正常</u-radio>
						<u-radio name="2" active-color="#8dc58d">重要</u-radio>
						<u-radio name="3" active-color="#8dc58d">紧急</u-radio>
						<u-radio name="4" active-color="#8dc58d">紧急重要</u-radio>
					</u-radio-group>
				</view>
			</view>
      <view class="creat-chooseHospital">
        <view>科室选择</view>
        <view>
           <xfl-select 
              :list="hospitalList"
              :clearable="false"
              :showItemNum="5" 
              :isCanInput="true"
              :showList="controlListShow"
              :style_Container="'height: 50px; font-size: 16px;'"
              :initValue="depName"
              @change="listChangeEvent"
              @input="inputEvent"
              @visible-change="visibleChange"
          >
          </xfl-select>
        </view>
      </view>
      <view class="creat-chooseHospital creat-chooseDestination">
        <view>目的房间</view>
        <view>
           <xfl-select
              ref="destionationParent"
              :list="destinationList"
              :clearable="false"
              :showItemNum="5" 
              :isCanInput="true"
              :showList="destinationListShow"
              :style_Container="'height: 50px; font-size: 16px;'"
              :initValue="destinationName"
              @change="destinationListChangeEvent"
              @input="destinationInputEvent"
              @visible-change="destinationvisibleChange"
          >
          </xfl-select>
        </view>
      </view>
			<view class="creat-transport-type">
				<view class="creat-transport-type-title">
					<text>任务类型:</text>
				</view>
				<view class="creat-transport-type-content">
					<view v-for="(item,index) in taskTypeList" :class="{'transTypeListStyle': typeIndex === index}" @click="typeEvent(item,index)" :key="index">{{item.text}}</view>
				</view>
			</view>
      <view class="creat-form">
      	<view>
      		<u-field
      			v-model="serviceMan"
      			label="维修人员"
            :disabled="true"
      			:border-bottom="true"
      			:border-top="true"
      			placeholder="请输入维修人员姓名"
      		>
      		</u-field>
      	</view>
      </view>
      <view class="creat-chooseHospital">
        <view>协助人员</view>
        <view>
           <xfl-select 
              :list="helpWorkerList"
              :clearable="false"
              :showItemNum="5" 
              :isCanInput="true"
              :showList="helpWorkerListShow"
              :style_Container="'height: 50px; font-size: 16px;'"
              @change="helpWorkerListChangeEvent"
              @input="helpWorkerInputEvent"
              @visible-change="helpWorkerVisibleChange"
          >
          </xfl-select>
        </view>
      </view>
			<view class="task-describe">
				<u-field
					v-model="taskDescribe"
					label="任务描述"
					:border-bottom="true"
					:border-top="true"
					placeholder="请输入任务描述"
					type="textarea"
				>
				</u-field>
			</view>
      <view class="preinstall-box" >
      	<text v-for="(item,index) in preinstallList" :key="index" :class="{'preinstallStyle':index == preinstallIndex}" @click="preinstallEvent(item,index)">{{item}}</text>
      </view>
		</view>
		<view class="btn-box">
			<view>
				<button type="primary" @click="sure">确认</button>
			</view>
			<view>
				<button type="primary" @click="cancel">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache } from '@/common/js/utils'
	import {queryTaskType, queryAllDestination, reportProblem, departmentRoom, helpWorkers, getRemarks} from '@/api/task.js'
	import navBar from "@/components/zhouWei-navBar"
  import uniList from "@/components/uni-list/uni-list.vue"
  import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
  import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue";
  import xflSelect from '@/components/xfl-select/xfl-select.vue';
	export default {
		components:{
			navBar,
      xflSelect,
      uniList,
      uniListItem,
      faIcon
		},
		data() {
			return {
				showLoadingHint: false,
        controlListShow: false,
        helpWorkerListShow: false,
        helpWorkerList: [],
        temporaryHelpWorkerList: [],
        destinationListShow: false,
        destinationName: '',
        preinstallIndex: null,
        serviceMan: '',
        assistMan: '',
        preinstallList: [],
				taskTypeText: '',
				typeText: '',
				typeValue: '',
        srcImage: '',
				typeIndex: null,
				priorityValue: 1,
				taskTypeList: [],
        destinationList: [],
        destinationId: '',
        hospitalList: [],
        temporaryHospitalList: [],
        temporaryDestinationList: [],
				taskDescribe: '',
        startPointId: '',
        startPointName: '',
        helpWorkerId: '',
        helpWorkerName: ''
			}
		},
		onLoad (options) {
			this.taskTypeText = this.titleText
		},
		computed: {
      ...mapGetters([
        'titleText',
        'isToCallTaskPage',
        'userInfo',
        'isMedicalMan'
      ]),
			userName () {
				return this.userInfo.userName
			},
      depName () {
        return this.userInfo.depName
      },
      depId () {
        return this.userInfo.depId
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
			if (this.depName === '') {
				this.startPointId = '';
				this.startPointName = ''
			} else {
				this.startPointId = this.depId;
				this.startPointName = this.depName;
			};
      this.serviceMan = this.accountName;
      if (this.depId) {
        this.queryRoomByDepartment({
          proId: this.proId,  //项目ID 必输
          state: 0,    // 状态默认传 0 即可
          depId: this.depId     //科室ID
        })
      };
			this.parallelFunction()
		},
		
		methods: {
			...mapMutations([
				'changeTitleText',
				'changeBottomBarIndex',
				'changeIsToCallTaskPage',
        'changeIsCompletePhotoList'
			]),
			
			// 返回上一页
			backTo () {
				this.changeBottomBarIndex(0);
				uni.redirectTo({
				    url: '/pages/projectManagement/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},
      
      // 预设内容点击事件
      preinstallEvent (item,index) {
        this.preinstallIndex = index;
        this.taskDescribe = item
      },
      
      // 科室选择列表变化时
      listChangeEvent (val) {
        this.startPointId = val.orignItem.id;
        this.startPointName = val.orignItem.value;
        this.$refs.destionationParent.clearInput();
        this.queryRoomByDepartment({
          proId: this.proId,  //项目ID 必输
          state: 0,    // 状态默认传 0 即可
          depId: val.orignItem.id     //科室ID
        })
      },
      
      // 根据科室查询房间号
      queryRoomByDepartment (data) {
        this.destinationList = [];
        this.temporaryDestinationList = [];
        departmentRoom(data).then((res) => {
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                this.destinationList.push({
                  value: item['spaceName'],
                  id: item['id']
                });
                this.temporaryDestinationList = this.destinationList;
              }
            }
          }
        })
        .catch((err) => {
          this.$refs.uToast.show({
            title: `${err}`,
            type: 'warning'
          })
        })
      },
      
      // 目的地选择列表变化时
      destinationListChangeEvent (val) {
        this.destinationId = val.orignItem.id;
        this.destinationName = val.orignItem.value;
      },
      
      // 协助人员选择列表变化时
      helpWorkerListChangeEvent (val) {
        this.helpWorkerId = val.orignItem.id;
        this.helpWorkerName = val.orignItem.value;
      },
      
      // 科室下拉框隐藏或显示时事件
      visibleChange () {
        this.hospitalList = this.temporaryHospitalList
      },
      
      // 房间下拉框隐藏或显示时事件
      destinationvisibleChange () {
        this.destinationList = this.temporaryDestinationList
      },
      
      // 协助人员
      helpWorkerVisibleChange () {
         let helpWorkerList = this.temporaryHelpWorkerList;
      },
      
      // 科室input中的数据变化时触发
      inputEvent (val) {
        this.controlListShow = Math.random();
        let innerList = this.temporaryHospitalList;
        this.hospitalList = innerList.filter((item) => {return item.value.indexOf(val.detail.value) != -1});
				if (val.detail.value === '') {
					this.startPointId = '';
					this.startPointName = ''
				}
      },
      
      // 目的地input中的数据变化时触发
      destinationInputEvent (val) {
        this.destinationListShow = Math.random();
        let innerList = this.temporaryDestinationList;
        this.destinationList = innerList.filter((item) => {return item.value.indexOf(val.detail.value) != -1});
      },
      
      
      // 协助人员input中的数据变化时触发
      helpWorkerInputEvent (val) {
        this.helpWorkerListShow = Math.random();
        let innerList = this.temporaryHelpWorkerList;
        this.helpWorkerList = innerList.filter((item) => {return item.value.indexOf(val.detail.value) != -1});
      },
			
			// 运送类型点击事件
      typeEvent (item,index) {
        this.typeIndex = index;
        this.typeText = item.text;
        this.typeValue = item.value;
      },
			
			// 底部按钮点击
			clickEvent (item) {
				if (item.text == "呼叫下单") {
					if (this.isToCallTaskPage) {
						this.backTo()
					} else {
						uni.redirectTo({
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
			},
			radioGroupChange(e) {
				console.log(e);
			},
			
     // 查询目的地
      getAllDestination () {
        return new Promise((resolve,reject) => {
          queryAllDestination(this.proId).then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },
			
			  
			// 查询运送类型
			getTaskType (data) {
			  return new Promise((resolve,reject) => {
          queryTaskType(data)
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
			  })
			},
      
      // 查询协助人员
      queryHelpWorker (data) {
        return new Promise((resolve,reject) => {
          helpWorkers(data)
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },
      
      // 查询备注信息
      queryRemarks (data) {
        return new Promise((resolve,reject) => {
          getRemarks(data)
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },
			
		  // 并行查询目的地、运送类型、协助人员、备注信息
		  parallelFunction (type) {
        Promise.all([this.getAllDestination(),this.getTaskType({
          proId: this.proId,
          state: 0,
          parentId: this.titleText.id
        }),this.queryHelpWorker({
          	proId: this.proId,
            state: 1
        }),this.queryRemarks({
          proId: this.proId,
          workerId: this.workerId,
          flag: this.isMedicalMan ? 1 : 0,    //查询类型 0-维修人员，1-医务人员
        })])
        .then((res) => {
          if (res && res.length > 0) {
            this.taskTypeList = [];
            this.hospitalList = [];
            this.helpWorkerList = [];
            this.preinstallList = [];
            let [item1,item2,item3,item4] = res;
            if (item1) {
              Object.keys(item1).forEach((item) => {
                this.hospitalList.push({
                  value: item1[item],
                  id: item
                })
              });
              this.temporaryHospitalList = this.hospitalList
            };
            if (item2) {
              for(let item of item2) {
                this.taskTypeList.push({
                  text: item.typeName,
                  value: item.id
                })
              }
            };
            if (item3) {
              for(let itemOne of item3) {
                this.helpWorkerList.push({
                  value: itemOne.name, 
                  id: itemOne.id
                })
              };
              this.temporaryHelpWorkerList = this.helpWorkerList
            };
            if (item4) {
              for(let item of item4) {
                this.preinstallList.push(item)
              }
            };
          }
        })
        .catch((err) => {
          this.$refs.uToast.show({
            title: `${err}`,
            type: 'warning'
          })
        })
		  },
		  
      // 生成工程维修任务
      postTask (data) {
        this.showLoadingHint = true;
        reportProblem(data).then((res) => {
          if (res && res.data.code == 200) {
            this.$refs.uToast.show({
              title: `${res.data.msg}`,
              type: 'success'
            });
            setTimeout(()=> {
              this.backTo()
            },1000)
          } else {
            this.$refs.uToast.show({
              title: `${res.data.msg}`,
              type: 'warning'
            })
          };
          this.showLoadingHint = false
        })
        .catch((err) => {
          this.$refs.uToast.show({
            title: `${err.message}`,
            type: 'error'
          })
          this.showLoadingHint = false;
        })
      },

      // 运送类型信息确认事件
		  taskSure () {
				if (this.startPointId === '') {
					this.$refs.uToast.show({
					  title: '清选择科室',
					  type: 'warning'
					});
					return
				};
        // 获取选中的运送工具信息
        let taskMessage = {
          priority: this.priorityValue,   //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
          depId: this.startPointId,      //科室ID   必输
          typeName: this.typeText,
          typeId: this.typeValue,
          space: this.destinationName,      //当前地点
          taskDesc: this.taskDescribe,  //  问题描述  必填
          taskRemark: '',   //问题详情  非必输
          workerId: this.workerId,   //创建者ID  当前登录者
          workerName: this.userName,   //创建者名称  当前登陆者
          proId: this.proId,   //项目ID
          images: []  ,// 问题图片信息 非必输
          spaceId: this.destinationId,    // 选择的空间ID
          flag: this.isMedicalMan ? 1 : 0, // 上报人类型，0-维修人员，1-医护人员		
          present: this.helpWorkerId === '' ? [] : [{id: this.helpWorkerId, name: this.helpWorkerName}] // id 为选择协助人员的Id，name 为选择的协助人员的Id
        };
        // 创建调度任务
        this.postTask(taskMessage)
		  },
			
      // 调度任务生成
      sure () {
        this.taskSure()
      },
		
      // 调度任务取消
      cancel () {
        this.backTo()
      }
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	.container {
		@include content-wrapper;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);
		.nav {
			width: 100%;
		};
		.creat-box {
			position: relative;
			width: 100%;
			flex: 1;
			overflow: auto;
			font-size: 14px;
			color: black;
			display: flex;
			flex-direction: column;
			.creat-priority {
				width: 100%;
				height: 50px;
				line-height: 50px;
			  margin-top: 6px;
				border-top: 1px solid #bcbcbc;
				border-bottom: 1px solid #bcbcbc;
				> view {
					&:first-child {
						float: left;
						width: 20%;
						padding-left: 4px;
						box-sizing: border-box
					}
					&:last-child {
						float: right;
						position: relative;
						height: 50px;
						width: 80%;
						/deep/ .u-radio-group {
							position: absolute;
							width: 100%;
							top: 50%;
							transform: translateY(-50%);
							left: 0;
							display: flex;
							justify-content: space-between;
							.u-radio{
							   flex: 1 0 auto !important;
							   justify-content: space-between;
							   .u-radio__label {
							     margin-right: 9px;
							   }
							}
						}
					}
				}
			};
      .creat-chooseHospital {
        width: 100%;
        height: 50px;
        line-height: 50px;
        margin-top: 6px;
        > view {
            &:first-child {
              float: left;
              width: 20%;
              padding-left: 4px;
              box-sizing: border-box
            }
            &:last-child {
              float: right;
              position: relative;
              height: 50px;
              width: 80%
            }
          }
      };
      .creat-chooseDestination {
         margin-top: 0;
      };
      .priority-box {
        > view {
          &:last-child {
          	/deep/ .u-radio-group {
          		position: absolute;
          		width: 100%;
          		top: 50%;
          		transform: translateY(-50%);
          		left: 0
          	}
          }
        }
      };
			.creat-transport-type {
				width: 100%;
				height: 110px;
				overflow: auto;
				margin-top: 6px;
				display: flex;
				flex: 1;
				flex-direction: column;
				border-top: 1px solid #bcbcbc;
				border-bottom: 1px solid #bcbcbc;
				.creat-transport-type-title {
					height: 25px;
					line-height: 25px;
					text {
						&:nth-child(1) {
							padding-left: 4px;
							box-sizing: border-box;
							margin-right: 8px
						};
						&:nth-child(2) {
							font-size: 14px;
							color: red
						}
					}
				};
				.creat-transport-type-content {
					flex: 1;
					display: flex;
					width: 100%;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-content: flex-start;
					padding:0 4px;
					box-sizing: border-box;
					overflow: auto;
					.transTypeListStyle {
						background: #75b0f0;
						color: #fff;
						border: none
					};
					> view {
						width: 45%;
						margin-bottom: 4px;
						height: 35px;
						text-align: center;
						line-height: 35px;
						border: 1px solid #dfdfdf
					}
				}
			};
      .creat-form {
      	width: 100%;
      	padding: 4px 0;
      	box-sizing: border-box;
      	margin-top: 6px;
      	border-top: 1px solid #bcbcbc;
      	border-bottom: 1px solid #bcbcbc;
      	display: flex;
      	width: 100%;
      	flex-direction: row;
      	flex-wrap: wrap;
      	justify-content: space-between;
      	align-content: flex-start;
      	> view {
      		margin-bottom: 4px;
      		/deep/ .u-field {
      			padding: 11px 2px;
      			.u-label-text {
      				font-size: 14px
      			}
      		}
      	}
      };
      .preinstall-box {
        width: 90%;
        margin: 0 auto;
        display: flex;
        height: 60px;
        flex-flow: row wrap;
        justify-content: center;
        align-items: top;
        overflow: auto;
        > text {
          display: inline-block;
          height: 30px;
          text-align: center;
          color: black;
          border: 1px solid #e1d3de;
          line-height: 30px;
          padding: 0 3px;
          margin-right: 4px;
          margin-bottom: 4px 
        };
        .preinstallStyle {
          background: #689dec;
          color: #fff;
          border: none
        }
      };
			.task-describe {
				margin: 6px 0;
				border-top: 1px solid #bcbcbc;
				border-bottom: 1px solid #bcbcbc;
				/deep/ .u-field {
					padding: 11px 2px;
					.u-label-text {
						font-size: 14px
					}
				}
			}
		}
		.btn-box {
			width: 100%;
			box-sizing: border-box;
			border-top: 1px solid #bcbcbc;
			padding: 0 20px;
			margin: 0 auto;
			height: 80px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			view {
				width: 45%;
				&:first-child {
					button {
						border-radius: 4px;
						background: #75acef;
						color: #fff
					}
				};
				&:last-child {
					button {
						border-radius: 4px;
						background: #fff;
						color: black
					}
				};
			}
		}
		.bottom-bar {
			height: 50px;
			width: 100%;
		}
	}
</style>
