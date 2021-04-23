<template>
	<view class="container">
		<u-toast ref="uToast" />
		<view class="empty-info" v-show="noDataShow">
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="加载中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<view class="nav">
			<nav-bar backState="3000" bgColor="#2c9af1" fontColor="#FFF" title="工程管理" @backClick="backTo"></nav-bar>
		</view>
		<view class="trans-type-list">
			<view :class="{'transTypeListStyle': typeIndex == index}" v-for="(item,index) in serviceList" :key="item" @click="typeEvent(item,index)">
        <view>
          <fa-icon v-show="item == '设备维保'" type="wrench" size="100" color="#065da7"></fa-icon>
          <fa-icon v-show="item == '工程人员维修'" type="cog" size="100" color="#065da7"></fa-icon>
        </view>
        <text>
          {{item}}
        </text>
      </view>
		</view>
		<view class="bottom-bar">
			<bottom-bar :itemIndex="-1" @itemEvent="clickEvent"></bottom-bar>
		</view>
		<view>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache } from '@/common/js/utils'
	import {queryTransportTypeClass} from '@/api/task.js'
	import bottomBar from '@/components/bottom-bar/bottom-bar.vue'
	import navBar from "@/components/zhouWei-navBar"
  import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	export default {
		components:{
			bottomBar,
			navBar,
      faIcon
		},
		data() {
      return {
				typeText: '',
				serviceList: ['设备维保','工程人员维修'],
				typeIndex: null,
				showLoadingHint: false,
				noDataShow: false
			}
		},
		onReady () {
		},
		computed: {
      ...mapGetters([
        'titleText',
        'userInfo',
        'isToCallTaskPage',
        'isMedicalMan'
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
      if (this.isMedicalMan) {
        this.serviceList.splice(this.serviceList.length-1,1)
      };
      this.changeBottomBarIndex(0)
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex',
				'changeTitleText',
				'changeIsToCallTaskPage'
			]),
			
			// 返回上一页
			backTo () {
				uni.switchTab({
				    url: '/pages/index/index'
				})
			},
			
			// 运送类型点击事件
			typeEvent (item,index) {
				this.typeIndex = index;
				this.typeText = item;
				this.changeTitleText('创建自主任务');
        this.changeBottomBarIndex(0);
        if (item == '设备维保') {
          uni.redirectTo({
          	url: '/projectPackage/pages/medicRepairs/medicRepairs'
          });
        } else {
          uni.redirectTo({
          	url: '/projectPackage/pages/projectRepairs/projectRepairs'
          });
        };
        this.changeIsToCallTaskPage(true)
			},
			
			  
			// 底部导航栏菜单点击事件
			clickEvent (item) {
				if (item.text == '呼叫下单') {
					if (this.isToCallTaskPage) {
						uni.redirectTo({
						    url: '/projectPackage/pages/projectManagement/index/index'
						});
						this.changeBottomBarIndex(0)
					} 
			  } else if (item.text == '任务跟踪') {
					this.changeBottomBarIndex(1);
					uni.redirectTo({
						url: '/projectPackage/pages/projectTaskTail/projectTaskTail'
					});
					this.changeBottomBarIndex(1);
					this.changeIsToCallTaskPage(true)
				} else if (item.text == "历史任务") {
					uni.redirectTo({
						url: '/projectPackage/pages/projectHistoryTask/projectHistoryTask'
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
		.trans-type-list {
			padding: 50px 0;
			flex: 1;
			-webkit-overflow-scrolling: touch;
			overflow: auto;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
      background: #FFF;
			.fa-icon {
				color: #0e89ec !important
			};
			.transTypeListStyle {
				background: #ededed
			};
			> view {
				width: 180px;
        flex-basis: 180px;
        border-radius: 50%;
				background: #FFF;
				color: black;
        border: 1px solid #d6d3d3;
        box-shadow: 0 15px 10px -15px #6d6d6d;
				font-size: 20px;
				margin-bottom: 20px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        &:last-child {
          margin-bottom: 0;
        };
        > text {
          width: 70px;
          text-align: center;
          font-size: 16px
        }
			}
		}
		.bottom-bar {
			height: 50px;
			width: 100%;
		}
	}
</style>
