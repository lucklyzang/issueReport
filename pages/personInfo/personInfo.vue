<template>
	<view class="content-box">
		<view class="nav">
			<nav-bar backState="2000" :home="false" bgColor="#000" fontColor="#FFF" title="个人资料" @backClick="backTo"></nav-bar>
		</view>
		<view class="content-top">
			<view class="content-top-name">
			  <text>头像</text>
			  <view>
				<image src="/static/img/default-person.jpg">
			  </view>
			</view>
			<view class="content-top-other">
			  <text>姓名</text>
			  <text>
				{{name}}
			  </text>
			</view>
			<view class="content-top-other">
			  <text>手机号码</text>
			  <text>
				无
			  </text>
			</view>
			<view class="content-top-other">
			  <text>公司部门</text>
			  <text>
				{{proName}}
			  </text>
			</view>
			<view class="content-top-other">
			  <text>职位</text>
			  <text>
				{{userType}}
			  </text>
			</view>
		 </view>
		 <view class="content-bottom">
			<view class="app-version">
				<text>当前版本</text>
				  <text>
					{{versionNumber}}
				  </text>
			</view>
			<view class="quit-account" @click="isLoginOut">退出账号</view>
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
				name: 'sasa1',
				proName: '维修部',
				userType: '员工',
				versionNumber: '1.0.1'
			}
		},
		onReady () {
		},
		computed: {
		    ...mapGetters([
		    ])
		 },
		mounted () {
		},
		methods: {
			// 返回上一页
			backTo () {
				uni.navigateTo({
				    url: '/pages/centerTransport/index/index'
				})
			},
			isLoginOut () {
				uni.navigateTo({
				    url: '/pages/myInfo/myInfo'
				})
			}
		}
	}
</script>

<style lang="scss">
@import "~@/common/stylus/variable.scss";
.content-box {
	@include content-wrapper;
	.content-top {
		height: auto;
		font-size: 14px;
		background: #fff;
	.content-top-name {
	  height: 90px;
	  padding: 10px;
	  box-sizing: border-box;
	  position: relative;
	  @include bottom-border-1px(#dadada);
	  > text {
		position: absolute;
		display: inline-block;
		left: 0;
		top: 38px;
		color: #bbbaba;
		padding-left: 10px
	  };
	  > view {
		  position: absolute;
		  color: #271010;
		  font-weight: bold;
		  right: 10px;
		  top: 10px;
		  width: 65px;
		  height: 65px;
		  border-radius: 50%;
		  image {
			width: 100%;
			height: 100%
		  }
	  }
	};
	.content-top-other {
	  height: 45px;
	  line-height: 45px;
	  box-sizing: border-box;
	  position: relative;
	  @include bottom-border-1px(#dadada);
	  &:last-child {
		@include bottom-border-1px(#fff);
	  }
	  > text {
		position: absolute;
		display: inline-block;
		&:first-child {
		  left: 0;
		  top: 0;
		  color: #bbbaba;
		  padding-left: 10px;
		};
		&:last-child {
		  color: #271010;
		  font-weight: bold;
		  right: 10px;
		  top: 0
		}
	  }
	}
  };
  .content-bottom {
	flex: 1;
	margin: 0 auto;
	width: 100%;
	font-size: 13px;
	background: #f7f7f7;
	position: relative;
	.app-version {
	  position: relative;
	  top: 14px;
	  left: 0;
	  height: 45px;
	  background: #fff;
	  line-height: 45px;
	  box-sizing: border-box;
	  > text {
		position: absolute;
		display: inline-block;
		&:first-child {
		  left: 0;
		  top: 0;
		  color: #bbbaba;
		  padding-left: 10px;
		};
		&:last-child {
		  color: #271010;
		  font-weight: bold;
		  right: 10px;
		  top: 0
		}
	  }
	};
	.back-home {
	  height: 45px;
	  width: 300px;
	  margin: 0 auto;
	  line-height: 45px;
	  left: 50%;
	  margin-left: -150px;
	  position: absolute;
	  bottom: 100px;
	  background: #fff;
	  color: #271010;
	  font-weight: bold;
	  text-align: center
	};
	.quit-account {
	  height: 45px;
	  width: 300px;
	  margin: 0 auto;
	  line-height: 45px;
	  left: 50%;
	  margin-left: -150px;
	  position: absolute;
	  bottom: 30px;
	  background: #ff0000;
	  color: #fff;
	  font-weight: bold;
	  text-align: center
	}
  }
 }
</style>
