<template>
	<view class="wrapper">
		<u-toast ref="uToast"/>
		<!-- 是否有账号选择框 -->
		<u-modal v-model="showChooseWay" :show-cancel-button="true"
      content="是否存在账号?" confirm-text="是" cancel-text="否" @confirm="chooseSure" @cancel="chooseCancel">
		</u-modal>
		<!-- 账号密码输入框 -->
		<u-modal v-model="showAccount" :show-cancel-button="true"
			title="请输入账号密码"  @confirm="accountSure" @cancel="accountCancel">
			<view class="slot-content">
				<u-field
					v-model="username"
					label="账号"
					placeholder="请填写账号"
				>
				</u-field>
				<u-field
					v-model="password"
					label="密码"
					placeholder="请填写密码"
				>
				</u-field>	
			</view>
		</u-modal>
		<!-- 医院选择列表框 -->
		<u-modal v-model="showHospitailList" show-cancel-button="true" width="80%"
			title="请选择医院"  @confirm="hospitailSure" @cancel="hospitailCancel">
			<view class="slot-content">
				<view :class="{'spanStyle':typeIndex == index}" v-for="(item,index) in hospitalOptions" :key="index" @click="cancelReasonCheck(item,index)">
					{{item.label}}
				</view> 
			</view>
		</u-modal>
		<view v-if="isCanUse">
			<view>
				<view class="nav">
					<nav-bar backState="3000" bgColor="#000" fontColor="#FFF" title="登录" @backClick="backTo"></nav-bar>
				</view>
				<view class='header'>
					<image src='../../static/img/weixin-login.png'></image>
				</view>
				<view class='content'>
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>
				<button v-if="canUseGetUserProfile" class='bottom' type='primary' @tap="getUserProfile">微信登录</button>
				<button v-else class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
					授权登录
				</button>
			</view>
		</view>
	 </view>
</template>

<script>
	import navBar from "@/components/zhouWei-navBar"
	import { mapGetters, mapMutations } from 'vuex'
	import { setCache } from '@/common/js/utils'
	import {weixinLogIn, boundExist, boundNotExist, getHospitalList} from '@/api/login.js'
    export default {
      components:{
        navBar
      },
      data() {
        return {
          SessionKey: '',
          OpenId: '',
					canUseGetUserProfile: false,
          showChooseWay: false,
          showAccount: false,
          showHospitailList: false,
          typeIndex: null,
          typeText: '',
          code: '',
          isCanUse: true,
          hospitalOptions: [],
          username: '',
          password: ''
        };
      },
      methods: {
        ...mapMutations([
          'storeUserInfo',
          'changeOverDueWay',
          'changeWeixinInfo',
          'changeIsMedicalMan',
					'changeTemplateType'
        ]),
				
				// 返回
				backTo () {
					uni.redirectTo({
            url: '/pages/login/login'
					})
				},
				
				// 用户同意授权(uni.getUserProfile获取用户信息)
				getUserProfile() {
					let _this = this;
					this.isCanUse = false;
					uni.getUserProfile({
						desc: '用于完善用户信息',
						success: function(res) {
							_this.sendCode(_this.code);
							_this.changeWeixinInfo(res.userInfo);
							setCache('weixinInfo',res.userInfo)
						},
						fail: function (err) {
							_this.$refs.uToast.show({
								title: `${err.errMsg}`,
								duration: 3000,
								url: '/pages/login/login',
								type: 'error'
							})
						}
					})
				},
				
				// 用户同意授权(uni.getUserInfo获取用户信息)
				wxGetUserInfo() {
				  this.isCanUse = false;
					let _this = this;
				  uni.getUserInfo({
				  	provider: 'weixin',
				  	success: function(infoRes) {
				  		_this.sendCode(_this.code);
				  		_this.changeWeixinInfo(infoRes.userInfo);
				  		setCache('weixinInfo',infoRes.userInfo)
				  	},
				  	fail: function (err) {
				  		_this.$refs.uToast.show({
				  			title: `${err.errMsg}`,
				  			duration: 3000,
				  			url: '/pages/login/login',
				  			type: 'error'
				  		})
				  	}
				  });
				  //将用户登录code传递到后台置换用户SessionKey、OpenId等信息
				  //小程序appid
				  let appid = 'wxe7ea58a8f75b0816';
				  //小程序secret
				  let secret = '44d0550eefb1a5e919b63a7966a9abf4';
				  //wx接口路径
				  // let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + _this.code + '&grant_type=authorization_code';	
				},
					
				// 实时获取code
				getCode () {
					let _this = this;
					return new Promise((resolve,reject) => {
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								resolve(loginRes.code)
							},
							fail: function(err) {
								uni.hideLoading();
								_this.$refs.uToast.show({
									title: `${err.errMsg}`,
									duration: 3000,
									url: '/pages/myInfo/myInfo',
									type: 'error'
								})
							}
						})
					})
				},
				
				// 医院列表点击事件
				cancelReasonCheck (item,index) {
					this.typeIndex = index;
					this.typeText = item.value;
				},
				
				
				// 获取医院列表
				queryHospitalList () {
					this.hospitalOptions = [];
					getHospitalList().then((res) => {
						if (res && res.data.code == 200) {
							if (res.data.data.length > 0) {
								for (let item of res.data.data) {
									this.hospitalOptions.push({
										label: item['proName'],
										value: item['id']
									})
								}
							} else {
								this.$refs.uToast.show({
									title: '获取的医院列表为空',
									type: 'error'
								})
							}
						} else {
							this.$refs.uToast.show({
								title: `${res.data.msg}`,
								type: 'error'
							})
						}
					})
					.catch((err) => {
						this.$refs.uToast.show({
							title: `${res.message}`,
							type: 'error'
						})
					})
				},
				
				// 医院列表选择框确定
				async hospitailSure () {
					if (this.typeText == '') {
						this.$refs.uToast.show({
							title: '请选择医院',
							type: 'warning'
						});
						this.showHospitailList = true;
						return
					};
					uni.showLoading({
						title: '登录中...'
					});
					let code = await this.getCode();
					this.proIdSure(code)
				},
				
				// 医院选择列表取消
				hospitailCancel () {
					this.backTo()
				},
				
				// 没有账号
				proIdSure (code) {
					boundNotExist(this.typeText,code).then((res) => {
						if (res.data.code == 200) {
							this.changeOverDueWay(false);
							setCache('storeOverDueWay',false);
							setCache('userInfo', res.data.data);
							setCache('isLogin', true);
							this.storeUserInfo(res.data.data);
              if (res.data.data['extendData']['user_type_id'] == 1) {
                this.changeIsMedicalMan(true)
              } else {
                this.changeIsMedicalMan(false)
              };
							// 保存模板类型
							if (res.data.data.mobile) {
								this.changeTemplateType(res.data.data.mobile);
								setCache('templateType', res.data.data.mobile)
							};
							uni.hideLoading();
							uni.switchTab({
								url: '/pages/index/index'
							})
						} else {
							uni.hideLoading();
							this.$refs.uToast.show({
								title: `${res.data.msg}`,
								type: 'error'
							})
						}
					})
					.catch((err) => {
						uni.hideLoading();
						this.$refs.uToast.show({
							title: `${err.message}`,
							type: 'error'
						})
					})
				},
				
				// 有账号
				chooseSure () {
					this.showAccount = true
				},
				
				// 账号密码绑定code
				bindCodeByAccount (code) {
					let userInfo = {
						username: this.username,
						password: this.password
					};
					boundExist(code,userInfo).then((res) => {
						if (res.data.code == 200) {
							this.changeOverDueWay(false);
							setCache('storeOverDueWay',false);
							setCache('userInfo', res.data.data);
							setCache('isLogin', true);
							this.storeUserInfo(res.data.data);
              if (res.data.data['extendData']['user_type_id'] == 1) {
                this.changeIsMedicalMan(true)
              } else {
                this.changeIsMedicalMan(false)
              };
							// 保存模板类型
							if (res.data.data.mobile) {
								this.changeTemplateType(res.data.data.mobile);
								setCache('templateType', res.data.data.mobile)
							};
							uni.hideLoading();
							uni.switchTab({
								url: '/pages/index/index'
							})
						} else {
							uni.hideLoading();
							this.$refs.uToast.show({
								title: `${res.data.msg}`,
								type: 'error'
							})
						}
					})
					.catch((err) => {
						uni.hideLoading();
						this.$refs.uToast.show({
							title: `${err.message}`,
							type: 'error'
						})
					})
				},
				
				// 弹出医院选择框
				chooseCancel () {
					this.showHospitailList = true;
					this.queryHospitalList()
				},
				
				// 账号密码确定
				async accountSure () {
					uni.showLoading({
						title: '登录中...'
					});
					let code = await this.getCode();
					this.bindCodeByAccount(code)
				},
				
				// 账号密码取消
				accountCancel () {
					this.backTo()
				},
				
				// 发送code到后台
				sendCode (code) {
					uni.showLoading({
					  title: '登录中...'
					});
					weixinLogIn(code).then((res) => {
						if (res['headers']['Status'] == '2003') {
							//当前微信未绑定过账号
							uni.hideLoading();
							this.showAccount = true;
						} else if (res['headers']['Status'] == '2002') {
							uni.hideLoading();
							//当前微信未绑定账号,后台登陆,存储用户相关信息
							if (res.data.code == 200) {
								this.changeOverDueWay(false);
								setCache('storeOverDueWay',false);
								setCache('userInfo', res.data.data);
								setCache('isLogin', true);
								this.storeUserInfo(res.data.data);
                if (res.data.data['extendData']['user_type_id'] == 1) {
                  this.changeIsMedicalMan(true)
                } else {
                  this.changeIsMedicalMan(false)
                };
								// 保存模板类型
								if (res.data.data.mobile) {
									this.changeTemplateType(res.data.data.mobile);
									setCache('templateType', res.data.data.mobile)
								};
								uni.hideLoading();
								uni.switchTab({
									url: '/pages/index/index'
								})
							} else {
								this.$refs.uToast.show({
									title: `${res.data.msg}`,
									duration: 3000,
									url: '/pages/login/login',
									type: 'error'
								})
							}
						} else if (res['headers']['Status'] == '2001') {
							uni.hideLoading();
							if (res.data.code == 200) {
								this.changeOverDueWay(false);
								setCache('storeOverDueWay',false);
								setCache('userInfo', res.data.data);
								setCache('isLogin', true);
								this.storeUserInfo(res.data.data);
                if (res.data.data['extendData']['user_type_id'] == 1) {
                  this.changeIsMedicalMan(true)
                } else {
                  this.changeIsMedicalMan(false)
                };
								// 保存模板类型
								if (res.data.data.mobile) {
									this.changeTemplateType(res.data.data.mobile);
									setCache('templateType', res.data.data.mobile)
								};
								uni.switchTab({
									url: '/pages/index/index'
								});
							} else {
								this.$refs.uToast.show({
									title: `${res.data.msg}`,
									duration: 3000,
									url: '/pages/login/login',
									type: 'error'
								})
							}
						}
					})
					.catch((err) => {
						uni.hideLoading();
						this.$refs.uToast.show({
							title: `${err.message}`,
							duration: 3000,
							url: '/pages/login/login',
							type: 'error'
						})
					})
				}
			},
			
      onLoad() {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						_this.code = loginRes.code;
						//判断是否存在getUserProfile方法
						if (uni.getUserProfile) {
							 _this.canUseGetUserProfile = true
						}
					},
					fail: function(err) {
						uni.hideLoading();
						_this.$refs.uToast.show({
							title: `${err.errMsg}`,
							duration: 3000,
							url: '/pages/myInfo/myInfo',
							type: 'error'
						})
					}
				})
      }
	 }
</script>

<style lang="scss">
	.wrapper {
		/deep/ .u-mode-center-box {
			.slot-content {
				padding: 20px 4px 0;
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
					text-align: center;
					line-height: 40px;
					margin-bottom: 4%
				};
				 .spanStyle {
					color: #fff;
					background: #278ee6
				  }
			}
		}
	}
	 .header {
	        margin: 90rpx 0 90rpx 50rpx;
	        border-bottom: 1px solid #ccc;
	        text-align: center;
	        width: 650rpx;
	        height: 300rpx;
	        line-height: 450rpx;
			image {
			    width: 200rpx;
			    height: 200rpx;
			}
	    };
	    .content {
	        margin-left: 50rpx;
	        margin-bottom: 90rpx;
			text {
			    display: block;
			    color: #9d9d9d;
			    margin-top: 40rpx;
			}
	    }
	    .bottom {
	        border-radius: 80rpx;
	        margin: 70rpx 50rpx;
	        font-size: 35rpx;
	    }
</style>
