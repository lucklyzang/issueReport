<template>
	<view class="container">
		<u-toast ref="uToast" />
		<ourLoading isFullScreen :active="showLoadingHint" :translateY="50" text="创建中···" color="#fff" textColor="#fff"
		 background-color="rgb(143 143 143)" />
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" :title="taskTypeText" @backClick="backTo"></nav-bar>
		</view>
	<!-- 	<view class="creat-box template-one">
			<view class="creat-priority priority-box">
				<view class="creat-priority-title">优先级</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="priorityValue" @change="radioGroupChange">
						<u-radio name="1" active-color="#8dc58d">正常</u-radio>
						<u-radio name="2" active-color="#8dc58d">重要</u-radio>
						<u-radio name="3" active-color="#8dc58d">紧急</u-radio>
						<u-radio name="4" active-color="#8dc58d">紧急重要</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-chooseHospital">
				<view class="creat-chooseHospital-title">科室选择</view>
				<view class="creat-chooseHospital-content">
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
			<view class="creat-transport-type">
				<view class="creat-transport-type-title">
					<text class="creat-transport-type-title-name">运送类型:</text>
				</view>
				<view class="creat-transport-type-content">
					<view class="creat-transport-type-content-list" v-for="(item,index) in transportList" :class="{'transTypeListStyle': typeIndex === index}" @click="typeEvent(item,index)" :key="index">{{item.text}}</view>
				</view>
			</view>
			<view class="creat-form">
				<view class="creat-form-field">
					<u-field
						v-model="bedNumber"
						label="床号"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入床号"
					>
					</u-field>
				</view>
				<view class="creat-form-field"> 
					<u-field
						v-model="patientName"
						label="姓名"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入姓名"
					>
					</u-field>
				</view>
				<view class="creat-form-field">
					<u-field
						v-model="patientNumber"
						label="住院号"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入住院号"
					>
					</u-field>
				</view>
				<view class="creat-form-field">
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
			<view class="creat-priority">
				<view class="creat-priority-title">转运工具</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="toolValue" @change="toolGroupChange">
						<u-radio
							@change="toolChange"
							active-color="#8dc58d"
							shape="circle"
							v-for="(item, index) in toolList" :key="index"
							:name="item.value"
						>
							{{item.text}}
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-priority creat-is-back">
				<view class="creat-priority-title">运送员是否返回</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="isBackValue" @change="isBackGroupChange">
						<u-radio name="0" active-color="#8dc58d">否</u-radio>
						<u-radio name="1" active-color="#8dc58d">是</u-radio>
					</u-radio-group>
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
		</view> -->
		<view class="creat-box template-two">
			<view class="creat-priority priority-box">
				<view class="creat-priority-title">优先级</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="priorityValue" @change="radioGroupChange">
						<u-radio name="1" active-color="#8dc58d">正常</u-radio>
						<u-radio name="2" active-color="#8dc58d">重要</u-radio>
						<u-radio name="3" active-color="#8dc58d">紧急</u-radio>
						<u-radio name="4" active-color="#8dc58d">紧急重要</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-priority">
				<view class="creat-priority-title">转运工具</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="toolValue" @change="toolGroupChange">
						<u-radio @change="toolChange" active-color="#8dc58d" shape="circle" v-for="(item, index) in toolList" :key="index"
						 :name="item.value">
							{{item.text}}
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-priority creat-is-back">
				<view class="creat-priority-title">运送员是否返回</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="isBackValue" @change="isBackGroupChange">
						<u-radio name="0" active-color="#8dc58d">否</u-radio>
						<u-radio name="1" active-color="#8dc58d">是</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-priority creat-is-back trans-total">
				<view class="trans-total-title">该任务运送总数</view>
				<view class="trans-total-content">
					<u-input disabled v-model="taskTotal" type="text" :border="true" />
				</view>
			</view>
			<view class="creat-chooseHospital">
				<view class="creat-chooseHospital-title">科室选择</view>
				<view class="creat-chooseHospital-content">
					<xfl-select :list="hospitalList" :clearable="false" :showItemNum="5" :isCanInput="true" :showList="controlListShow"
					 :style_Container="'height: 50px; font-size: 16px;'" :initValue="depName" @change="listChangeEvent" @input="inputEvent"
					 @visible-change="visibleChange">
					</xfl-select>
				</view>
			</view>
			<view class="patient-box">
				<view class="patient-box-list" v-for="(item,index) in templateTwoMessage" :key="index">
					<view class="patient-title">
						<view class="patient-name">病人{{index+1}}</view>
						<u-icon name="trash-fill" v-show="index > 0" @click="deletetMessage(index)"></u-icon>
					</view>
					<view class="creat-form">
						<view class="creat-form-field">
							<u-field v-model="templateTwoMessage[index].bedNumber" label="床号" :border-top="true" placeholder="请输入床号">
							</u-field>
						</view>
						<view class="creat-form-field">
							<u-field v-model="templateTwoMessage[index].patientName" label="姓名" :border-top="true" placeholder="请输入姓名">
							</u-field>
						</view>
						<view class="creat-form-field">
							<u-field v-model="templateTwoMessage[index].patientNumber" label="住院号" :border-top="true" placeholder="请输入住院号">
							</u-field>
						</view>
						<view class="creat-form-field">
							<u-field disabled v-model="templateTwoMessage[index].actualData" type="text" label="运送数量" :border-top="true">
							</u-field>
						</view>
					</view>
					<view class="creat-gender">
						<view class="creat-gender-title">性别</view>
						<view class="creat-gender-content">
							<xfl-select :list="item.genderList" :clearable="false" :showItemNum="5" :isCanInput="true" :showList="genderControlListShow"
							 :style_Container="'height: 50px; font-size: 16px;'" :initValue="item.genderInitName" @change="genderChangeEvent"
							 @input="genderInputEvent" @visible-change="genderVisibleChange">
							</xfl-select>
						</view>
					</view>
					<view class="transport-parent-box">
						<view class="transport-parent-box-title">
							<xfl-select :list="item.sampleList" :clearable="false" :showItemNum="5" :isCanInput="true" :showList="transportParentControlListShow"
							 :style_Container="'height: 50px; font-size: 16px;'" :initValue="item.sampleValue" :outerIndex="index" @change="transportParentChange"
							 @input="transportParentInputEvent" @visible-change="transportParentVisibleChange">
							</xfl-select>
						</view>
						<view class="transport-parent-box-content">
							<text class="content-type-title">运送类型:</text>
							<text class="content-type-name">{{jointTransportMessage(index)}}</text>
						</view>
					</view>
					<view class="creat-transport-type">
						<view class="creat-transport-type-content">
							<view class="creat-transport-type-content-list" v-for="(innerItem,innerIndex) in templateTwoMessage[index].transportList" :class="{'transTypeListStyle': item.transportList[innerIndex].checked }"
								@click="sampleTypeEvent(index,innerItem,innerIndex)" :key="innerItem.text">
								<view class="creat-transport-type-content-list-title">
									{{innerItem.text}}
								</view>
								<view class="creat-transport-type-content-list-content">
								<!-- 	<view class="subtract-box"
										@click.stop="plusNum(index,innerItem,innerIndex, $event)">
										<u-icon name="minus"></u-icon>
									</view>
									<input
										@click.stop="inpuntClick"
										type="number"
										:value="innerItem.typerNumber"
										@input="stepperValChange($event,index,innerIndex)"
									/>
									<view class="plus-box"
										@click.stop="minusNum(index,innerItem,innerIndex, $event)">
										<u-icon name="plus"></u-icon>
									</view> -->
									<stepNumberBox v-model="innerItem.typerNumber" 
										@plus="plusNum(arguments)"
										@inputBlur="inputBlurEvent(arguments)"
										:index="index"
										:innerIndex="innerIndex"
										@minus="minusNum(arguments)"
										@change="stepperValChange(arguments)"
									></stepNumberBox>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="addpatient-message-btn" @click="addMessageEvent">
				点击添加病人信息
			</view>
			<view class="task-describe">
				<u-field v-model="taskDescribe" label="任务描述" :border-top="true" placeholder="请输入任务描述" type="textarea">
				</u-field>
			</view>
		</view>
		<view class="btn-box">
			<view class="btn-sure">
				<button class="sureBtn" type="primary" @click="sure">确认</button>
			</view>
			<view class="btn-cancel">
				<button class="cancelBtn" type="primary" @click="cancel">取消</button>
			</view>
		</view>
		<!-- 	<view class="bottom-bar">
			<bottom-bar :itemIndex="0" @itemEvent="clickEvent"></bottom-bar>
		</view> -->
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
		queryTransportTypeClass,
		queryTransportTools,
		queryTransportType,
		queryAllDestination,
		generateDispatchTask
	} from '@/api/task.js'
	import navBar from "@/components/zhouWei-navBar"
	import xflSelect from '@/components/xfl-select/xfl-select.vue'
	import stepNumberBox from '@/components/step-number-box/step-number-box.vue'
	export default {
		components: {
			navBar,
			xflSelect,
			stepNumberBox
		},
		data() {
			return {
				showLoadingHint: false,
				controlListShow: false,
				transportParentControlListShow: false,
				taskTypeText: '',
				typeText: '',
				typeValue: '',
				taskTotal: '',
				typeIndex: null,
				priorityValue: 1,
				transportList: [],
				hospitalList: [],
				temporaryHospitalList: [],
				bedNumber: '',
				patientName: '',
				patientNumber: '',
				actualData: '',
				toolValue: null,
				toolName: '',
				toolList: [],
				isBackValue: 0,
				taskDescribe: '',
				startPointId: '',
				startPointName: '',
				templateTwoMessage: [{
					bedNumber: '',
					patientName: '',
					patientNumber: '',
					actualData: 0,
					genderInitName: '男',
					transportList: [],
					genderList: [{
							value: '男',
							id: 0
						},
						{
							value: '女',
							id: 1
						}
					],
					sampleList: [],
					sampleValue: '',
					sampleId: ''
				}],
				transportTypeParent: [],
				transportTypeChild: [],
				genderControlListShow: false,
			}
		},
		onLoad(options) {
			this.taskTypeText = this.titleText.value;
			this.templateTwoMessage[0].sampleValue = this.titleText.value;
			this.templateTwoMessage[0].sampleId = this.titleText.id
		},

		// 监听每个病人对应的运送类型数量
		watch: {
			templateTwoMessage: {
				handler(newVal, oldVal) {
					this.taskTotal = this.templateTwoMessage.reduce((accumulator, currentValue) => {
						return accumulator + Number(currentValue.actualData)
					}, 0);
				},
				deep: true,
				immediate: true
			}
		},

		computed: {
			...mapGetters([
				'titleText',
				'isToCallTaskPage',
				'userInfo',
				'isTemplateOne'
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
			
			textChange () {
				
			},
			
			// 返回上一页
			backTo() {
				this.changeBottomBarIndex(0);
				uni.redirectTo({
					url: '/pages/centerTransport/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},

			// 科室选择列表变化时
			listChangeEvent(val) {
				this.startPointId = val.orignItem.id;
				this.startPointName = val.orignItem.value;
			},

			// 下拉框隐藏或显示时事件
			visibleChange() {
				this.hospitalList = this.temporaryHospitalList
			},

			// input中的数据变化时触发
			inputEvent(val) {
				let innerList = this.temporaryHospitalList;
				this.hospitalList = innerList.filter((item) => {
					return item.value.indexOf(val.detail.value) != -1
				});
			},

			// 运送类型点击事件
			typeEvent(item, index) {
				this.typeIndex = index;
				this.typeText = item.text;
				this.typeValue = item.value;
			},

			// 模板二运送类型点击事件
			sampleTypeEvent(index, innerItem, innerIndex) {
				this.templateTwoMessage[index]['transportList'][innerIndex].checked = !this.templateTwoMessage[index][
					'transportList'
				][innerIndex].checked;
					if (!this.templateTwoMessage[index]['transportList'][innerIndex].checked) {
						if (this.templateTwoMessage[index]['transportList'][innerIndex]['typerNumber'] != 0) {
							this.templateTwoMessage[index]['transportList'][innerIndex]['typerNumber'] = 0;
							this.$forceUpdate();
							this.$set(this.templateTwoMessage[index]['transportList'][innerIndex], 'typerNumber', 0);
						}
					};
					console.log('数据',this.templateTwoMessage);
					this.reduceTotal(index);
			},

			// 拼接运送类型信息函数
			jointTransportMessage(index) {
				let finalMsg = '';
				let targetMsg = this.templateTwoMessage[index].transportList.filter((item) => {
					return item.checked == true
				});
				for (let item of targetMsg) {
					finalMsg += `${item.text}${item.typerNumber}个,`
				};
				return finalMsg
			},

			// 性别选择列表变化时
			genderChangeEvent(val) {

			},

			// 性别下拉框隐藏或显示时事件
			genderVisibleChange() {

			},

			// 性别input中的数据变化时触发
			genderInputEvent(val) {},

			// 运送类型大类选择列表变化时
			transportParentChange(val) {
				this.querytransportChildByTransportParent(val.parentIndex, val.orignItem.id);
				this.templateTwoMessage[val.parentIndex].actualData = 0;
				this.templateTwoMessage[val.parentIndex].sampleValue = val.orignItem.value;
				this.templateTwoMessage[val.parentIndex].sampleId = val.orignItem.id;
			},

			// 运送类型大类下拉框隐藏或显示时事件
			transportParentVisibleChange() {

			},

			// 运送类型大类input中的数据变化时触发
			transportParentInputEvent(val) {},
			
			inpuntClick () {
				
			},
			
			// 运送类型子类步进器值改变事件
			stepperValChange(msg) {
				this.reduceTotal(msg[1]);
			},
			
			// 步进器失去焦点事件
			inputBlurEvent (msg) {
			},

			// 步进器增加或减少事件
			plusNum(msg) {
				this.templateTwoMessage[msg[2]]['transportList'][msg[3]]['typerNumber'] = msg[1];
				this.reduceTotal(msg[2]);
			},
			minusNum(msg) {
				this.templateTwoMessage[msg[2]]['transportList'][msg[3]]['typerNumber'] = msg[1];
				this.reduceTotal(msg[2])
			},

			// 求和函数
			reduceTotal(index) {
				// 求该病人信息对应的运送数量
				let targetMsg = this.templateTwoMessage[index].transportList.filter((item) => {
					return item.checked == true
				});
				this.templateTwoMessage[index].actualData = targetMsg.reduce((accumulator, currentValue) => {
					return accumulator + currentValue.typerNumber
				}, 0);
			},

			// 底部按钮点击
			clickEvent(item) {
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
				this.toolValue = e;
				let currentText = this.toolList.filter((item) => {
					return item.value == e
				});
				this.toolName = currentText[0]['text']
			},

			isBackGroupChange(e) {
				console.log(e);
			},

			// 查询目的地
			getAllDestination() {
				return new Promise((resolve, reject) => {
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
			getTransportTools() {
				return new Promise((resolve, reject) => {
					queryTransportTools({
							proId: this.proId,
							state: 0
						})
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

			// 查询运送类型小类
			getTransPorttype(data) {
				return new Promise((resolve, reject) => {
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

			// 查询运送类型大类
			getTransportsTypeParent() {
				return new Promise((resolve, reject) => {
					queryTransportTypeClass({
							proId: this.proId,
							state: 0
						}).then((res) => {
							if (res && res.data.code == 200) {
								if (res.data.data.length > 0) {
									resolve(res.data.data)
								}
							}
						})
						.catch((err) => {
							reject(err.message)
						})
				})
			},

			// 根据运送类型大类查询运送类型小类
			querytransportChildByTransportParent(index, id) {
				queryTransportType({
						proId: this.proId,
						state: 0,
						parentId: id
					})
					.then((res) => {
						if (res && res.data.code == 200) {
							this.templateTwoMessage[index]['transportList'] = [];
							for (let item of res.data.data) {
								this.templateTwoMessage[index].transportList.push({
									text: item.typeName,
									value: item.id,
									checked: false,
									typerNumber: 0
								})
							}
						}
					})
					.catch((err) => {
						this.$refs.uToast.show({
							title: `${err.message}`,
							type: 'warning'
						}).then(() => {})
					})
			},

			// 并行查询目的地、转运工具、运送类型小类、运送类型大类
			parallelFunction(type) {
				Promise.all([this.getAllDestination(), this.getTransportTools(), this.getTransPorttype({
						proId: this.proId,
						state: 0,
						parentId: this.titleText.id
					}), this.getTransportsTypeParent()])
					.then((res) => {
						if (res && res.length > 0) {
							this.toolList = [];
							this.transportList = [];
							this.hospitalList = [];
							this.transportTypeParent = [];
							this.templateTwoMessage[0].sampleList = [];
							this.templateTwoMessage[0]['transportList'] = [];
							this.transportTypeChild = [];
							let [item1, item2, item3, item4] = res;
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
									this.toolList.push({
										text: item.toolName,
										value: item.id,
										checked: false
									})
								};
								this.toolList.push({
									text: '无工具',
									value: 0,
									checked: false
								})
							};
							if (item3) {
								for (let item of item3) {
									this.transportList.push({
										text: item.typeName,
										value: item.id
									});
									this.templateTwoMessage[0].transportList.push({
										text: item.typeName,
										value: item.id,
										checked: false,
										typerNumber: 0
									});
									this.transportTypeChild.push({
										text: item.typeName,
										value: item.id,
										checked: false,
										typerNumber: 0
									})
								};
							};
							if (item4) {
								for (let item of item4) {
									this.transportTypeParent.push({
										id: item.id,
										value: item.typeName
									})
								};
								this.templateTwoMessage[0].sampleList = this.transportTypeParent;
								this.templateTwoMessage[0].sampleValue = this.titleText.value;
								this.templateTwoMessage[0].sampleId = this.titleText.id;
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

			// 添加病人信息事件
			addMessageEvent() {
				this.templateTwoMessage.push({
					bedNumber: '',
					patientName: '',
					patientNumber: '',
					actualData: 0,
					genderInitName: '男',
					transportList: this.transportTypeChild,
					genderList: [{
							value: '男',
							id: 0
						},
						{
							value: '女',
							id: 1
						}
					],
					sampleList: this.transportTypeParent,
					sampleValue: this.titleText.value,
					sampleId: this.titleText.id
				});
			},

			// 病人信息删除事件
			deletetMessage(index) {
				this.templateTwoMessage.splice(index, 1)
			},

			// 生成调度任务
			postGenerateDispatchTask(data) {
				this.showLoadingHint = true;
				generateDispatchTask(data).then((res) => {
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
			dispatchTaskSure() {
				// 获取选中的运送工具信息
				let taskMessage = {
					setOutPlaceId: this.startPointId, //出发地ID
					setOutPlaceName: this.startPointName, //出发地名称
					destinationId: '', //目的地ID
					destinationName: '', //目的地名称
					parentTypeId: this.titleText.id, //运送父类型Id
					parentTypeName: this.titleText.value, //运送父类型名称
					taskTypeId: this.typeValue, //运送类型 ID
					taskTypeName: this.typeText, //运送类型 名 称
					priority: this.priorityValue, //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
					toolId: this.toolValue == 0 ? '' : this.toolValue, //运送工具ID
					toolName: this.toolName == '无工具' ? '' : this.toolName, //运送工具名称
					actualCount: this.actualData, //实际数量
					patientName: this.patientName, //病人姓名
					sex: 0, //病人性别  0-未指定,1-男, 2-女
					age: "", //年龄
					number: this.patientNumber, //住院号
					bedNumber: this.bedNumber, //床号
					taskRemark: this.taskDescribe, //备注
					createId: this.workerId, //创建者ID  当前登录者
					createName: this.userName, //创建者名称  当前登陆者
					proId: this.proId, //项目ID
					proName: this.proName, //项目名称
					isBack: this.isBackValue, //是否返回出发地  0-不返回，1-返回
					createType: 2 //创建类型   0-调度员,1-医务人员(平板创建),2-医务人员(小程序)
				};
				// 创建调度任务
				this.postGenerateDispatchTask(taskMessage)
			},

			// 调度任务生成
			sure() {
				this.dispatchTaskSure()
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
				height: 50px;
				line-height: 50px;
				margin-top: 6px;
				border-top: 1px solid #bcbcbc;
				border-bottom: 1px solid #bcbcbc;

				.creat-priority-title {
					height: 48px;
					line-height: 48px;
					float: left;
					width: 20%;
					padding-left: 4px;
					box-sizing: border-box;
				};
				.creat-priority-content {
					height: 48px;
					float: right;
					position: relative;
					width: 80%;
					
					/deep/ .u-radio-group {
						position: absolute;
						width: 100%;
						top: 50%;
						transform: translateY(-50%);
						left: 0
					}
				}
			};

			.creat-chooseHospital {
				width: 100%;
				height: 40px;
				margin-top: 6px;
				border-top: 1px solid #bcbcbc;
				border-bottom: 1px solid #bcbcbc;
				.creat-chooseHospital-title {
					height: 38px;
					float: left;
					width: 20%;
					line-height: 38px;
					padding-left: 4px;
					box-sizing: border-box
				};
				.creat-chooseHospital-content {
					height: 38px;
					float: right;
					position: relative;
					width: 80%;
					z-index: 300;
					
					.show-box {
						height: 30px !important;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			};

			.priority-box {
				.creat-priority-content {
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
							}
						}
					}
				};
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

					.creat-transport-type-title-name {
						padding-left: 4px;
						box-sizing: border-box;
						margin-right: 8px
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
					padding: 0 4px;
					box-sizing: border-box;
					overflow: auto;

					.transTypeListStyle {
						background: #75b0f0;
						color: #fff;
						border: none
					};

					.creat-transport-type-content-list{
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
				.creat-form-field {
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
				.creat-priority-title {
					display: inline-block;
					height: 48px;
					line-height: 48px;
					width: 30%;
					padding-left: 4px;
					box-sizing: border-box;
				};
				.creat-priority-content {
					display: inline-block;
					position: relative;
					height: 48px;
					width: 70%;
					
					/deep/ .u-radio-group {
						position: absolute;
						width: 100%;
						top: 50%;
						transform: translateY(-50%);
						left: 0
					}
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

		.template-two {
			.trans-total {
				.trans-total-title {
					float: left;
					width: 30%;
					padding-left: 4px;
					line-height: 48px !important;
					height: 48px !important;
				};
				.trans-total-content {
					height: 48px !important;
					float: right;
					width: 70%;
					position: relative;
					/deep/ .u-input {
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						left: 10px;
					}
				};
			}

			.patient-box {
				border-top: 1px solid #bcbcbc;
				border-bottom: 1px solid #bcbcbc;
				margin: 4px 0;
				padding: 4px;
				height: 400px;
				overflow: auto;

				.patient-box-list {
					background: #f6f6f6;
					margin-bottom: 4px;

					.creat-transport-type{
						margin-bottom: 0
					};

					.patient-title {
						height: 30px;
						line-height: 30px;
						color: black;
						font-weight: bold;
						position: relative;
						.patient-name {
							position: absolute;
							top: 0;
							height: 100%;
							font-size: 20px;
							width: 100px;
							left: 4px
						};
						/deep/ .u-icon {
							position: absolute;
							font-size: 20px;
							top: 50%;
							transform: translateY(-50%);
							right: 4px;
							color: red
						}
					};

					.creat-form {
						width: 100%;
						padding: 4px 0;
						box-sizing: border-box;
						margin-top: 6px;
						border: none !important;
						display: flex;
						width: 100%;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-between;
						align-content: flex-start;

						.creat-form-field {
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

					.creat-gender {
						width: 100%;
						height: 30px;
						position: relative;
						.creat-gender-title {
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							left: 4px;
							width: 20%;
						};
						.creat-gender-content {
							position: absolute;
							right: 0;
							width: 80%;
							z-index: 200;
							
							.show-box {
								height: 30px !important;
							}
						};
					};

					.transport-parent-box {
						height: 40px;
						position: relative;
						z-index: 100;
						.transport-parent-box-title {
							position: absolute;
							z-index: 10;
							top: 50%;
							transform: translateY(-50%);
							left: 4px;
							width: 30%;
							.show-box {
								height: 30px !important;
							}
						};
						.transport-parent-box-content {
							position: absolute;
							padding-left: 8px;
							right: 0;
							width: 70%;
							height: 30px;
							display: flex;
							flow: row nowrap;
						};
						.content-type-title {
							font-weight: bold;
							color: black;
							font-size: 14px;
							height: 40px;
							line-height: 40px;
							width: 60px;
						};
						.content-type-name {
							font-weight: bold;
							color: black;
							font-size: 14px;
							height: 40px;
							line-height: 40px;
							flex: 1;
							font-size: 12px;
							overflow: auto
						};
					};

					.creat-transport-type {
						width: 100%;
						height: 110px;
						border: 1px solid red;
						overflow: auto;
						margin: 0 auto;
						padding: 4px 0;
						display: flex;
						flex: 1;
						flex-direction: column;
						border: 1px solid #bcbcbc;

						.creat-transport-type-content {
							flex: 1;
							display: flex;
							width: 100%;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: space-between;
							align-content: flex-start;
							padding: 0 4px;
							box-sizing: border-box;
							overflow: auto;

							.transTypeListStyle {
								background: #75acef;
								color: #fff;
								border: none
							};

							.creat-transport-type-content-list {
								width: 49%;
								margin-bottom: 4px;
								height: 35px;
								border: 1px solid #dfdfdf;
								position: relative;
								.creat-transport-type-content-list-title {
									height: 100%;
									position: absolute;
									top: 0;
									width: 45%;
									text-align: left;
									left: 2px;
									overflow-x: auto;
								};
								.creat-transport-type-content-list-content {
									height: 100%;
									position: absolute;
									top: 0;;
									width: 55%;
									right: 0;
									// display: flex;
									// flex-flow: row nowrap;
									.subtract-box  {
										width: 30px;
										height: 33px;
										background: #d2d2d2;
										line-height: 33px;
									};
									input {
										flex: 1;
										height: 100%;
										background: #a7a7a7;
									};
									.plus-box  {
										width: 30px;
										height: 33px;
										background: #d2d2d2;
										line-height: 33px
									}
								}
							}
						}
					}
				}
			};

			.addpatient-message-btn {
				width: 120px;
				height: 30px;
				line-height: 30px;
				border-radius: 4px;
				text-align: center;
				margin: 0 auto;
				background: #75acef;
				color: #fff
			};

			.task-describe {
				margin: 4px 0;
			}
		};

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
			.btn-sure {
				width: 45%;
				.sureBtn {
					border-radius: 4px;
					background: #75acef;
					color: #fff
				}
			};
			.btn-cancel {
				width: 45%;
				.cancelBtn {
					border-radius: 4px;
					background: #fff;
					color: black
				}
			};
		}

		.bottom-bar {
			height: 50px;
			width: 100%;
		}
	}
</style>
