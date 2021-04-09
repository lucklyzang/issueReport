<template>
	<view class="container">
		<u-toast ref="uToast" />
		<u-modal v-model="sureCancelShow" :content="content" title="确定删除此图片?" :show-cancel-button="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<ourLoading isFullScreen :active="showLoadingHint" :translateY="50" text="创建中···" color="#fff" textColor="#fff"
		 background-color="rgb(143 143 143)" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" :title="taskTypeText" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="creat-box">
			<view class="creat-priority priority-box">
				<view>优先级</view>
				<view>
					<u-radio-group v-model="priorityValue" @change="radioGroupChange">
						<u-radio name="1" active-color="#333">正常</u-radio>
						<u-radio name="2" active-color="#333">重要</u-radio>
						<u-radio name="3" active-color="#333">紧急</u-radio>
						<u-radio name="4" active-color="#333">紧急重要</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-chooseHospital">
				<view>科室选择</view>
				<view class="creat-chooseHospital-content-two">
				<!-- 	<xfl-select :list="hospitalList" :clearable="false" :showItemNum="5" :isCanInput="true" :showList="controlListShow"
					 :style_Container="'height: 50px; font-size: 15px;'" :initValue="depName" @change="listChangeEvent" @input="inputEvent"
					 @visible-change="visibleChange">
					</xfl-select> -->
					<ld-select :list="hospitalList"
						label-key="value" value-key="id"
						clearable
						placeholder="请选择"
						color="#333"
						selectColor="#43c3f3"
						bgColor="#f9f9f9"
						v-model="departmentValue"
						@change="listChangeEvent">
					</ld-select>
				</view>
			</view>
			<view class="creat-chooseHospital creat-chooseDestination">
				<view>目的房间</view>
				<view class="creat-chooseHospital-content creat-chooseHospital-content-two">
					<!-- <xfl-select ref="destionationParent" :list="destinationList" :clearable="false" :showItemNum="5" :isCanInput="true"
					 :showList="destinationListShow" :style_Container="'height: 50px; font-size: 15px;'" :initValue="destinationName"
					 @change="destinationListChangeEvent" @input="destinationInputEvent" @visible-change="destinationvisibleChange">
					</xfl-select> -->
					<ld-select :list="destinationList"
						label-key="value" value-key="id"
						clearable
						v-if="departmentShow"
						placeholder="请选择"
						color="#333"
						selectColor="#43c3f3"
						bgColor="#f9f9f9"
						v-model="hospitalListValue"
						@change="destinationListChangeEvent">
					</ld-select>
				</view>
			</view>
			<view class="creat-transport-type">
				<view class="creat-transport-type-title">
					<text>任务类型</text>
				</view>
				<view class="creat-transport-type-content">
					<view v-for="(item,index) in taskTypeList" :class="{'transTypeListStyle': typeIndex === index}" @click="typeEvent(item,index)"
					 :key="index">{{item.text}}</view>
				</view>
			</view>
			<view class="view-photoList">
				<view>
					<text>问题拍照</text>
				</view>
				<view>
					<view v-for="(item, index) in imgArr" :key='index'>
						<image :src="item" mode="aspectFill"></image>
						<fa-icon type="window-close" size="20" color="#000000" @click="photoDelete(item,index)"></fa-icon>
					</view>
				</view>
				<view>
					<image class="" mode="aspectFill" :lazy-load="true" src="/static/img/plus.png"  @click="getImg"/>
				</view>
			</view>
			<view class="task-describe">
				<u-field v-model="taskDescribe" label="任务描述" :border-bottom="true" :border-top="true" placeholder="请输入任务描述" type="textarea">
				</u-field>
			</view>
			<view class="preinstall-box">
				<text v-for="(item,index) in preinstallList" :key="item" :class="{'preinstallStyle':index == preinstallIndex}"
				 @click="preinstallEvent(item,index)">{{item}}</text>
			</view>
		</view>
		<view class="btn-box">
			<view>
				<button type="primary" @click="sure">确 认</button>
			</view>
			<view>
				<button type="primary" @click="cancel">取 消</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		getCache
	} from '@/common/js/utils'
	import {
		queryTaskType,
		queryAllDestination,
		departmentRoom,
		reportProblem,
		getRemarks
	} from '@/api/task.js'
	import navBar from "@/components/zhouWei-navBar"
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue";
	import ldSelect from "@/components/ld-select/ld-select.vue"
	import xflSelect from "@/components/xfl-select/xfl-select.vue";
	export default {
		components: {
			navBar,
			xflSelect,
			uniList,
			ldSelect,
			uniListItem,
			faIcon
		},
		data() {
			return {
				showLoadingHint: false,
				departmentShow: true,
				content: '',
				departmentValue: '',
				sureCancelShow: false,
				controlListShow: false,
				destinationListShow: false,
				destinationName: '',
				preinstallIndex: null,
				imgArr: [],
				imgIndex: '',
				preinstallList: [],
				taskTypeText: '',
				typeText: '',
				hospitalListValue: '',
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
				startPointName: ''
			}
		},
		onLoad(options) {
			this.taskTypeText = this.titleText
		},
		computed: {
			...mapGetters([
				'titleText',
				'isToCallTaskPage',
				'userInfo',
				'isMedicalMan'
			]),
			userName() {
				return this.userInfo.userName
			},
			depName() {
				return this.userInfo.depName
			},
			depId() {
				return this.userInfo.depId
			},
			proId() {
				return this.userInfo.extendData.proId
			},
			proName() {
				return this.userInfo.extendData.proName
			},
			workerId() {
				return this.userInfo.extendData.userId
			},
			accountName() {
				return this.userInfo.name
			}
		},
		mounted() {
			this.startPointId = this.depId;
			this.startPointName = this.depName;
			this.parallelFunction()
		},
		methods: {
			...mapMutations([
				'changeTitleText',
				'changeBottomBarIndex',
				'changeIsToCallTaskPage'
			]),
			// 返回上一页
			backTo() {
				this.changeBottomBarIndex(0);
				uni.redirectTo({
					url: '/pages/projectManagement/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},
			// 预设内容点击事件
			preinstallEvent(item, index) {
				this.preinstallIndex = index;
				this.taskDescribe = item
			},
			// 弹框确定按钮
			sureCancel() {
				this.imgArr.splice(this.imgIndex, 1)
			},
			// 弹框取消按钮
			cancelSure() {
			},
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			// 选择图片方法
			getImg() {
				var that = this
				uni.chooseImage({
					count: 3,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							that.srcImage = res.tempFilePaths[imgI];
							uni.getFileSystemManager().readFile({
								filePath: that.srcImage,
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.imgArr.push(base64);
								}
							})
						}
					}
				});
			},
			// 科室选择列表变化时
			listChangeEvent(val) {
				this.departmentValue = val;
				this.hospitalListValue = '';
				this.departmentShow = false;
				if (this.departmentValue != '') {
					this.queryRoomByDepartment({
						proId: this.proId, //项目ID 必输
						state: 0, // 状态默认传 0 即可
						depId: this.departmentValue //科室ID
					});
				} else {
					this.destinationList = [];
					this.departmentShow = true
				}
				// this.startPointId = val.orignItem.id;
				// this.startPointName = val.orignItem.value;
				// this.$refs.destionationParent.clearInput();
			},
			// 根据科室查询房间号
			queryRoomByDepartment(data) {
				this.temporaryDestinationList = [];
				this.destinationList = [];
				departmentRoom(data).then((res) => {
					this.departmentShow = true;
						if (res && res.data.code == 200) {
							if (res.data.data.length > 0) {
								for (let item of res.data.data) {
									this.destinationList.push({
										value: item['spaceName'],
										id: item['id']
									})
								};
								this.temporaryDestinationList = this.destinationList;
							}
						} else {
							this.$refs.uToast.show({
								title: `${res.data.data.msg}`,
								type: 'warning'
							})
						}
					})
					.catch((err) => {
						this.departmentShow = true;
						this.$refs.uToast.show({
							title: `${err}`,
							type: 'warning'
						})
					})
			},
			// 目的地选择列表变化时
			destinationListChangeEvent(val) {
				this.hospitalListValue = val;
				// this.destinationId = val.orignItem.id;
				// this.destinationName = val.orignItem.value;
			},
			// 科室下拉框隐藏或显示时事件
			visibleChange() {
				this.hospitalList = this.temporaryHospitalList
			},
			// 目的地下拉框隐藏或显示时事件
			destinationvisibleChange() {
				this.destinationList = this.temporaryDestinationList
			},
			// 科室input中的数据变化时触发
			inputEvent(val) {
				this.controlListShow = Math.random();
				let innerList = this.temporaryHospitalList;
				this.hospitalList = innerList.filter((item) => {
					return item.value.indexOf(val.detail.value) != -1
				});
			},
			// 目的地input中的数据变化时触发
			destinationInputEvent(val) {
				this.destinationListShow = Math.random();
				let innerList = this.temporaryDestinationList;
				this.destinationList = innerList.filter((item) => {
					return item.value.indexOf(val.detail.value) != -1
				});
			},
			// 根据科室id获取科室名称
			getDepartmentNameById(id) {
				return this.hospitalList.filter((item) => {return item['id'] == id})[0]['value']
			},
			// 运送类型点击事件
			typeEvent(item, index) {
				this.typeIndex = index;
				this.typeText = item.text;
				this.typeValue = item.value;
			},
			// 底部按钮点击
			clickEvent(item) {
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
			getAllDestination() {
				return new Promise((resolve, reject) => {
					queryAllDestination(this.proId).then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							} else {
								this.$refs.uToast.show({
									title: `${res.data.data.msg}`,
									type: 'warning'
								})
							}
						})
						.catch((err) => {
							reject(err.message)
						})
				})
			},
			// 查询运送类型
			getTaskType(data) {
				return new Promise((resolve, reject) => {
					queryTaskType(data)
						.then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							} else {
								this.$refs.uToast.show({
									title: `${res.data.data.msg}`,
									type: 'warning'
								})
							}
						})
						.catch((err) => {
							reject(err.message)
						})
				})
			},
			// 查询备注信息
			queryRemarks(data) {
				return new Promise((resolve, reject) => {
					getRemarks(data)
						.then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							} else {
								this.$refs.uToast.show({
									title: `${res.data.data.msg}`,
									type: 'warning'
								})
							}
						})
						.catch((err) => {
							reject(err.message)
						})
				})
			},
			// 并行查询目的地、运送类型、备注信息
			parallelFunction(type) {
				Promise.all([this.getAllDestination(), this.getTaskType({
						proId: this.proId,
						state: 0,
						parentId: this.titleText.id
					}), this.queryRemarks({
						proId: this.proId,
						workerId: this.workerId,
						flag: this.isMedicalMan ? 1 : 0, //查询类型 0-维修人员，1-医务人员
					})])
					.then((res) => {
						if (res && res.length > 0) {
							this.taskTypeList = [];
							this.hospitalList = [];
							this.helpWorkerList = [];
							this.preinstallList = [];
							let [item1, item2, item3] = res;
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
								for (let item of item2) {
									this.taskTypeList.push({
										text: item.typeName,
										value: item.id
									})
								}
							};
							if (item3) {
								for (let item of item3) {
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
			// 创建自主任务
			postTask(data) {
				this.showLoadingHint = true;
				reportProblem(data).then((res) => {
						if (res && res.data.code == 200) {
							this.$refs.uToast.show({
								title: `${res.data.msg}`,
								type: 'success'
							});
							setTimeout(() => {
								this.backTo()
							}, 1000)
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
			takaskSure() {
				// 获取选中的运送工具信息
				let taskMessage = {
					priority: this.priorityValue, //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
					depId: this.departmentValue, //科室ID   必输
					typeName: this.typeText,
					typeId: this.typeValue,
					space: this.hospitalListValue, //当前地点
					taskDesc: this.taskDescribe, //  问题描述  必填
					taskRemark: '', //问题详情  非必输
					workerId: this.workerId, //创建者ID  当前登录者
					workerName: this.userName, //创建者名称  当前登陆者
					proId: this.proId, //项目ID
					images: this.imgArr, // 问题图片信息 非必输
					spaceId: this.destinationId, // 选择的空间ID
					flag: this.isMedicalMan ? 1 : 0, // 上报人类型，0-维修人员，1-医护人员		
					present: [] // id 为选择协助人员的Id，name 为选择的协助人员的Id
				};
				// 创建工程维修任务
				this.postTask(taskMessage)
			},
			// 工程维修任务生成
			sure() {
				if (this.taskDescribe == '' && this.imgArr.length == 0) {
					this.$refs.uToast.show({
						title: '任务描述和问题照片至少一项不能为空',
						type: 'warning'
					})
				} else {
					this.takaskSure()
				}
			},
			// 调度任务取消
			cancel() {
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
				height: 60px;
				line-height: 60px;
				border-bottom: 1px solid $color-underline;
				>view {
					&:first-child {
						float: left;
						width: 20%;
						padding-left: 4px;
						box-sizing: border-box;
						color: $color-text-left;
					};
					&:last-child {
						float: right;
						position: relative;
						height: 60px;
						width: 80%;
						/deep/ .u-radio-group {
							position: absolute;
							width: 100%;
							top: 50%;
							transform: translateY(-50%);
							left: 0;
							display: flex;
							justify-content: space-between;
							.u-radio {
								flex: 1 0 auto !important;
								justify-content: space-between;
								.u-radio__label {
									margin-right: 9px;
									color: #333
								}
							}
						}
					}
				}
			};
	
			.creat-chooseHospital {
				width: 100%;
				height: 60px;
				border-bottom: 1px solid $color-underline;
				>view {
					&:first-child {
						float: left;
						width: 20%;
						height: 60px;
						line-height: 60px;
						padding-left: 4px;
						box-sizing: border-box;
						color: $color-text-left;
					}
	
					&:last-child {
						float: right;
						position: relative;
						height: 60px;
						width: 80%;
						.show-box {
							color: #333;
							position: absolute;
							left: 0;
							top: 50%;
							transform: translateY(-50%);
							height: 40px !important;
							background: #f9f9f9;
							border: none;
							/deep/ .input {
								font-size: 15px !important
							};
							.right-arrow {
								color: #333 !important
							}
						}
					}
				};
				.creat-chooseHospital-content-two {
						height: 60px;
						float: right;
						position: relative;
						width: 70%;
						.main {
							color: $color-text-right;
							position: absolute;
							left: 0;
							top: 10px;
							width: 100%;
							height: 40px !important;
							background: #f9f9f9;
							border: none;
							/deep/ .input {
								height: 100%;
								border: none;
								.uni-input-wrapper {
									font-size: 15px !important
								}
							};
							/deep/.text-blue {
								color: #969696 !important
							};
							/deep/ .text-green {
								color: #43c3f3 !important
							}
						}
					}
			};
			.view-photoList {
				display: flex;
				flex-flow: row wrap;
				// min-height: 112px;
				background: #fff;
				box-sizing: border-box;
				border-bottom: 12px solid #f6f6f6;
				>view {
					&:first-child {
						color: $color-text-left;
						width: 80px;
						height: 100px;
						padding-left: 4px;
						line-height: 100px;
					};
					&:nth-child(2) {
						flex: 1;
						font-size: 34px;
						display: flex;
						// height: 100px;
						// line-height: 100px;
						flex-flow: row wrap;
						align-items: center;
						overflow: auto;
						>view {
							flex: 0 0 48%;
							height: 100px;
							display: inline-block;
							margin-right: 4px;
							margin-bottom: 4px;
							margin-top: 4px;
							position: relative;
							>fa-icon {
								position: absolute;
								top: -12px;
								right: 0
							};
							&:last-child {
								margin-right: 0
							};
							image {
								width: 100%;
								height: 100%
							}
						}
					};
					&:last-child {
						width: 80px;
						height: 80px;
						margin-top: 10px;
						margin-right: 4px;
						image {
							width: 100%;
							height: 100%
						};
						.fa-icon {
							color: #000000 !important
						}
					}
				}
			};
	
			.creat-chooseDestination {
				margin-top: 0;
				border: none;
				> view {
				    &:last-child {
							z-index: 10;
				    }
				  }
			};
	
			.priority-box {
				>view {
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
				max-height: 120px;
				overflow: auto;
				display: flex;
				flex-direction: row;
				border-top: 12px solid #f6f6f6;
				border-bottom: 12px solid #f6f6f6;
	
				.creat-transport-type-title {
					margin-top: 8px;
					width: 20%;
					height: 35px;
					line-height: 35px;
					color: $color-text-left;
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
					font-size: 15px;
					color: #333;
					width: 100%;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-content: flex-start;
					padding: 8px 6px 8px 0;
					box-sizing: border-box;
					overflow: auto;
					.transTypeListStyle {
						background: #d6f4ff;
						color: #01a6ff;
						border: 1px solid #4cc5f2
					};
	
					>view {
						width: 45%;
						margin-bottom: 4px;
						height: 35px;
						text-align: center;
						line-height: 35px;
						background:: #f9f9f9;
						border-radius: 16px
					}
				}
			};
			
			.creat-form {
				/deep/ .u-field {
					padding: 10px 4px;
					.u-label {
						font-size: 14px;
						color: $color-text-left !important
					};
					.fild-body {
						color: #333 !important;
						.u-flex-1  {
							font-size: 15px !important
						}
					}
				}
			};
	
			.preinstall-box {
				width: 90%;
				margin: 0 auto;
				display: flex;
				max-height: 60px;
				flex-flow: row wrap;
				justify-content: center;
				align-items: center;
				overflow: scroll;
				border-bottom: 1px solid $color-underline;
	
				>text {
					display: inline-block;
					height: 30px;
					text-align: center;
					color: #333;
					background: #f9f9f9;
					line-height: 30px;
					padding: 0 3px;
					margin-right: 4px;
					margin-bottom: 4px;
					border-radius: 4px;
				};
	
				.preinstallStyle {
					background: #d6f4ff;
					color: #01a6ff;
					border: 1px solid #4cc5f2;
				}
			};
	
			.task-describe {
				height: 112px;
				border-bottom: 12px solid #f6f6f6;
	
				/deep/ .u-field {
					padding: 16px 2px;
					color: $color-text-left;
					.u-label-text {
						font-size: 14px
					};
					.u-label {
						margin-top: 8px;
					};
					.fild-body {
						color: #333;
						height: 68px;
						overflow: auto;
						background: #f9f9f9;
						.u-flex-1 {
							font-size: 15px !important
						}
					}
				}
			}
		};
	
		.btn-box {
			width: 100%;
			box-sizing: border-box;
			padding: 0 20px;
			margin: 0 auto;
			height: 80px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			view {
				width: 47%;
				&:first-child {
					button {
						border-radius: 4px;
						background-image: linear-gradient(to right, #37d5fc , #429bff);
						color: #fff
					}
				};
	
				&:last-child {
					button {
						border-radius: 4px;
						background: #e8e8e8;
						border: none;
						color: #666666
					}
				}
			}
		};
		.bottom-bar {
			height: 50px;
			width: 100%;
		}
	}
</style>