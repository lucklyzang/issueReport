<template>
	<view class="container">
		<view class="bg-icon">
		  <text>BLINK</text>
		</view>
		<view class="title-wrapper">
			<view class="center-transport" @click="skipPageTrans" v-if="isMedicalMan">
        <view>
          <fa-icon type="plus-square" size="100" color="#065da7"></fa-icon>
        </view>
				<text>中央运送系统</text>
			</view>
			<view class="project-manage" @click="skipPageManage">
        <view>
          <fa-icon type="wrench" size="100" color="#065da7"></fa-icon>
        </view>
				<text>工程管理系统</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache, getCache } from '@/common/js/utils'
  import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	export default {
    components: {
      faIcon
    },
		data() {
			return {
			}
		},
		onReady () {
			uni.setNavigationBarTitle({
			    title: ''
			});
			uni.setNavigationBarColor({
				backgroundColor: '#00aaff',
				 animation: {
					duration: 400,
					timingFunc: 'easeIn'
				  }
			})
		},
		computed: {
      ...mapGetters([
        'isMedicalMan'
      ])
		},
		mounted () {
			this.initStoreInfo()
		},
		methods: {
			...mapMutations([
				'changeBottomBarIndex',
        'changeIsProjectTask'
			]),
			skipPageTrans () {
				uni.navigateTo({
					url: '/pages/centerTransport/index/index'
				});
        this.changeIsProjectTask(false);
				this.changeBottomBarIndex(-1);
			},
      skipPageManage () {
      	uni.navigateTo({
      		url: '/pages/projectManagement/index/index'
      	});
        this.changeIsProjectTask(true);
      	this.changeBottomBarIndex(-1);
      },
			initStoreInfo () {
				// 页面刷新时重新存入用户信息
				if (getCache('userInfo')) {
				  this.$store.commit('storeUserInfo',getCache('userInfo'));
				};
				// 页面刷新重新存入请求token
				if (getCache('questToken')) {
				  this.$store.commit('changeToken', getCache('questToken'));
				};
				if (getCache('weixinInfo')) {
				  this.$store.commit('changeWeixinInfo', getCache('weixinInfo'));
				}
			}
		}
	}
</script>

<style lang="scss">
	 @import "~@/common/stylus/variable.scss";
	.container {
		@include content-wrapper;
		font-size: 14px;
		.bg-icon {
			width: 100%;
			height: 190px;
			line-height: 190px;
			text-align: center;
			color: black;
      background: #fcfcfc;
			font-size: 26px;
			color: #065da7;
			font-weight: bold;
			font-size: 50px;
			  span {
			    box-shadow: 0 8px 6px -6px black
			  }
		};
		.title-wrapper {
			flex: 1;
      overflow: auto;
			font-size: 20px;
			color: #333;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
			> view {
				width: 180px;
				flex-basis: 180px;
				border-radius: 50%;
				color: black;
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				align-items: center;
				border: 1px solid #d6d3d3;
				box-shadow: 0 15px 10px -15px #6d6d6d;
				margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0
        }
			};
			.center-transport {
			};
      .project-manage {
        // visibility: hidden;
      }
		}
	}
</style>
