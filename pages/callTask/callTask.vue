<template>
	<view class="container">
		<view class="nav">
			<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" :title="taskTypeText" @backClick="backTo"></nav-bar>
		</view>
		<view class="creat-box">
			<view class="creat-priority">
				<view>优先级</view>
				<view>
					<u-radio-group v-model="priorityValue" @change="radioGroupChange">
						<u-radio 
							@change="radioChange"
							active-color="#8dc58d"
							v-for="(item, index) in priorityList" :key="index" 
							:name="item.name"
							:disabled="item.disabled"
						>
							{{item.name}}
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-transport-type">
				<view class="creat-transport-type-title">
					<text>运送类型:</text>
					<text>已选数量</text>
				</view>
				<view class="creat-transport-type-content">
					<view v-for="(item,index) in transportList" :key="index">{{item}}</view>
				</view>
			</view>
			<view class="creat-form">
				<view>
					<u-field
						v-model="number"
						label="床号"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入床号"
					>
					</u-field>
				</view>
				<view>
					<u-field
						v-model="name"
						label="姓名"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入姓名"
					>
					</u-field>
				</view>
				<view>
					<u-field
						v-model="admissionNumber"
						label="住院号"
						:border-bottom="true"
						:border-top="true"
						placeholder="请输入住院号"
					>
					</u-field>
				</view>
				<view>
					<u-field
						v-model="transportNumber"
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
								:name="item.name"
								:disabled="item.disabled"
							>
								{{item.name}}
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
							<u-radio 
								@change="isBackChange"
								active-color="#8dc58d"
								v-for="(item, index) in isBackList" :key="index" 
								:name="item.name"
								:disabled="item.disabled"
							>
								{{item.name}}
							</u-radio>
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
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components:{
			navBar
		},
		data() {
			return {
				taskTypeText: '',
				priorityList: [
					{
						name: '正常',
						disabled: false
					},
					{
						name: '重要',
						disabled: false
					},
					{
						name: '紧急',
						disabled: false
					},
					{
						name: '紧急重要',
						disabled: false
					}
				],
				priorityValue: '正常',
				transportList: ['类型一','类型二','类型一','类型一'],
				number: '',
				name: '',
				admissionNumber: '',
				transportNumber: '',
				toolValue: '无',
				toolList: [
					{
						name: '无',
						disabled: false
					},
					{
						name: '平车',
						disabled: false
					},
					{
						name: '轮椅',
						disabled: false
					},
				],
				isBackValue: '否',
				isBackList: [
					{
						name: '否',
						disabled: false
					},
					{
						name: '是',
						disabled: false
					},
				],
				taskDescribe: ''
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
				uni.navigateTo({
				    url: '/pages/centerTransport/index/index'
				});
				this.changeIsToCallTaskPage(false)
			},
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
			radioChange(e) {
				console.log(e);
			},
			radioGroupChange(e) {
				console.log(e);
			},
			toolChange(e) {
				console.log(e);
			},
			toolGroupChange(e) {
				console.log(e);
			},
			isBackChange(e) {
				console.log(e);
			},
			isBackGroupChange(e) {
				console.log(e);
			},
			sure () {},
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
			height: 65px;
			width: 100%;
		}
	}
</style>
