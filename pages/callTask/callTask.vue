<template>
	<view class="container">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="创建中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" :title="taskTypeText" @backClick="backTo"></nav-bar>
		</view>
		<view class="creat-box">
			<view class="creat-priority">
				<view>优先级</view>
				<view>
					<u-radio-group v-model="priorityValue" @change="radioGroupChange">
						<u-radio name="0" active-color="#8dc58d">正常</u-radio>
						<u-radio name="1" active-color="#8dc58d">重要</u-radio>
						<u-radio name="2" active-color="#8dc58d">紧急</u-radio>
						<u-radio name="3" active-color="#8dc58d">紧急重要</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-transport-type">
				<view class="creat-transport-type-title">
					<text>运送类型:</text>
				</view>
				<view class="creat-transport-type-content">
					<view v-for="(item,index) in transportList" :class="{'transTypeListStyle': typeIndex === index}" @click="typeEvent(item,index)" :key="index">{{item.text}}</view>
				</view>
			</view>
			<view class="creat-form">
				<view>
					<u-field
						v-model="bedNumber"
						label="床号"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入床号"
					>
					</u-field>
				</view>
				<view>
					<u-field
						v-model="patientName"
						label="姓名"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入姓名"
					>
					</u-field>
				</view>
				<view>
					<u-field
						v-model="patientNumber"
						label="住院号"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入住院号"
					>
					</u-field>
				</view>
				<view>
					<u-field
						v-model="actualData"
						label="运送数量"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入运送数量"
						type="number"
					>
					</u-field>
				</view>
			</view>
			<view class="creat-box">
				<view class="creat-priority">
					<view>转运工具</view>
					<view>
						<u-radio-group v-model="toolValue" @change="toolGroupChange">
							<u-radio 
								@change="toolChange"
								active-color="#8dc58d"
								v-for="(item, index) in toolList" :key="index" 
								:name="item.value"
								:disabled="item.disabled"
							>
								{{item.text}}
							</u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
			<view class="creat-box">
				<view class="creat-priority creat-is-back">
					<view>运送员是否返回</view>
					<view>
						<u-radio-group v-model="isBackValue" @change="isBackGroupChange">
							<u-radio name="0" active-color="#8dc58d">否</u-radio>
							<u-radio name="1" active-color="#8dc58d">是</u-radio>
						</u-radio-group>
					</view>
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
		</view>
		<view class="btn-box">
			<view>
				<button type="primary" @click="sure">确认</button>
			</view>
			<view>
				<button type="primary" @click="cancel">取消</button>
			</view>
		</view>
		<view class="bottom-bar">
			<bottom-bar :itemIndex="0" @itemEvent="clickEvent"></bottom-bar>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache } from '@/common/js/utils'
	import {queryTransportTools,queryTransportType, queryAllDestination, generateDispatchTask} from '@/api/task.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components:{
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				taskTypeText: '',
				typeText: '',
				typeValue: '',
				typeIndex: '',
				priorityValue: 0,
				transportList: [],
				bedNumber: '',
				patientName: '',
				patientNumber: '',
				actualData: '',
				toolValue: '',
				toolName: '',
				toolList: [],
				isBackValue: 0,
				taskDescribe: ''
			}
		},
		onLoad (options) {
			this.taskTypeText = this.titleText.value
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
			this.parallelFunction()
		},
		
		methods: {
			...mapMutations([
				'changeTitleText',
				'changeBottomBarIndex',
				'changeIsToCallTaskPage'
			]),
			
			// 返回上一页
			backTo () {
				this.changeBottomBarIndex(-1);
				uni.redirectTo({
				    url: '/pages/centerTransport/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},
			
			// 运送类型点击事件
			  typeEvent (item,index) {
				this.typeIndex = index;
				this.typeText = item.text;
				this.typeValue = item.value;
			  },
			
			// 底部按钮点击
			clickEvent (item) {
				if (item.text == "呼叫") {
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
			toolChange(e) {
				console.log(e);
			},
			toolGroupChange(e) {
				console.log(e);
				for (let item of this.toolList) {
					if (e == item.value) {
						this.toolName = item.text
					}
				};
				console.log(this.toolList);
			},
			isBackGroupChange(e) {
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
			
			  // 查询转运工具
			  getTransportTools () {
				return new Promise((resolve,reject) => {
				  queryTransportTools({proId: this.proId, state: 0})
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
			  
			// 查询运送类型
			getTransPorttype (data) {
			  return new Promise((resolve,reject) => {
				queryTransportType(data)
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
			
		  // 并行查询目的地、转运工具、运送类型
		  parallelFunction (type) {
			Promise.all([this.getAllDestination(),this.getTransportTools(), this.getTransPorttype({
			  proId: this.proId,
			  state: 0,
			  // parentId: this.transportantTaskMessage.id
			})])
			.then((res) => {
			  if (res && res.length > 0) {
				this.toolList = [];
				this.transportList = [];
				let [item1,item2,item3] = res;
				// if (item1) {
				//   Object.keys(item1).forEach((item) => {
				// 	this.destinationList.push({
				// 	  text: item1[item],
				// 	  value: item
				// 	})
				//   })
				// };
				if (item2) {
				  for (let item of item2) {
					this.toolList.push({
					  text: item.toolName,
					  value: item.id
					});
				  }
				};
				if (item3) {
				  for(let item of item3) {
					this.transportList.push({
					  text: item.typeName, 
					  value: item.id
					})
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
		  
		 // 生成调度任务
		postGenerateDispatchTask (data) {
		  this.showLoadingHint = true;
		  generateDispatchTask(data).then((res) => {
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
		  dispatchTaskSure () {
			// 获取选中的运送工具信息
			let taskMessage = {
			  setOutPlaceId: this.userInfo.depId,  //出发地ID
			  setOutPlaceName: this.userInfo.depName,  //出发地名称
			  destinationId: '',   //目的地ID
			  destinationName: '',  //目的地名称
			  parentTypeId:  this.titleText.id, //运送父类型Id
			  parentTypeName: this.titleText.value,//运送父类型名称
			  taskTypeId: this.typeValue,  //运送类型 ID
			  taskTypeName: this.typeText,  //运送类型 名 称
			  priority: this.priorityValue,   //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
			  toolId: this.toolValue,   //运送工具ID
			  toolName: this.toolName,  //运送工具名称
			  actualCount: this.actualData,   //实际数量
			  patientName: this.patientName,  //病人姓名
			  sex: 0,    //病人性别  0-未指定,1-男, 2-女
			  age: "",   //年龄
			  number: this.patientNumber,   //住院号
			  bedNumber: this.bedNumber,  //床号
			  taskRemark: this.taskDescribe,   //备注
			  createId: this.workerId,   //创建者ID  当前登录者
			  createName: this.userName,   //创建者名称  当前登陆者
			  proId: this.proId,   //项目ID
			  proName: this.proName,   //项目名称
			  isBack: this.isBackValue,  //是否返回出发地  0-不返回，1-返回
			  createType: 1   //创建类型   0-调度员，1-医务人员 固定传 1
			};
			// 创建调度任务
			this.postGenerateDispatchTask(taskMessage)
		  },
			
		// 调度任务生成
		sure () {
			this.dispatchTaskSure()
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
		.nav {
			width: 100%;
		};
		.creat-box {
			position: relative;
			width: 100%;
			flex: 1;
			overflow: auto;
			font-size: 14px;
			margin-top: 4px;
			color: black;
			.creat-priority {
				width: 100%;
				height: 50px;
				line-height: 50px;
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
						border: 1px solid #b7b7b7
					}
				}
			}
			.creat-form {
				width: 100%;
				padding: 4px 0;
				box-sizing: border-box;
				margin-top: 6px;
				border-top: 1px solid #bcbcbc;
				border-bottom: 1px solid #bcbcbc;
				flex: 1;
				display: flex;
				width: 100%;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				align-content: flex-start;
				> view {
					width: 50%;
					margin-bottom: 4px;
					/deep/ .u-field {
						padding: 11px 2px;
						.u-label-text {
							font-size: 14px
						}
					}
				}
			};
			.creat-is-back {
				> view {
					display: inline-block;
					&:first-child {
						width: 40%;
						padding-left: 4px;
						box-sizing: border-box;
					}
					&:last-child {
						width: 60%;
					}
				}
			};
			.task-describe {
				margin-top: 6px;
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
			width: 90%;
			margin: 0 auto;
			height: 80px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-content: flex-start;
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
