<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="登录中,请稍候···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-modal v-model="modalShow" :content="modalContent"
		 :show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
		</u-modal>
		<u-toast ref="uToast" />
		<view class="container-content">
			<view class="title">
        <text>BLINK</text>
      </view>
			<view class="form-box">
				<u-form :model="form" ref="uForm">
					<u-form-item label="账号" right-icon="account-fill" :label-style="{'font-size':'15px'}" :right-icon-style="{'font-size':'20px'}">
						<u-input v-model="form.username" placeholder="请输入账号"/>
					</u-form-item>
					<u-form-item label="密码" right-icon="lock-fill" :label-style="{'font-size':'15px'}" :right-icon-style="{'font-size':'20px'}">
						<u-input v-model="form.password" placeholder="请输入密码" type="password"/>
					</u-form-item>
				</u-form>
			</view>
      <view class="remember-password">
        <view class="remember-password-content">
          <u-checkbox-group @change="checkboxGroupChange">
                <u-checkbox 
                  @change="checkboxChange"
                  shape="circle"
                  active-color="#78d035"
                  v-model="item.checked" 
                  v-for="(item, index) in list" :key="index" 
                  :name="item.name"
                >{{item.name}}</u-checkbox>
            </u-checkbox-group>
         </view>
      </view>
			<view class="form-btn">
				<button type="primary" @click="sure">登 录</button>
			</view>
     <!-- <view class="weixin-login">
        <u-divider border-color="#6d6d6d" color="#333">微信授权登陆</u-divider>
        <view class="image-wrapper" @click="weixinLoginEvent">
          <image src="/static/img/weixin.png">
        </view>
      </view> -->
			<!-- 隐私弹窗组件：会自动判断是否需要弹出 -->
			<privacy-agreement
				v-if="showPrivacy"
				@agree="onPrivacyAgree"
				@disagree="onPrivacyDisagree"
			/>
			<button
				class="phone-btn"
				open-type="getPhoneNumber"
				@getphonenumber="onGetPhoneNumber"
			>
				手机号一键登录
			</button>
      <view class="bottom-character">
        <text>内部系统,仅限医护进行下单使用</text>
      </view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { logIn, getPhoneNumberByPhoneCode } from '@/api/login.js'
	import { setCache, getCache, removeCache } from '@/common/js/utils'
	export default {
	components: {
	 },
		data() {
			return {
				form: {
					username: '',
					password: ''
				},
        list: [
          {
            name: '记住账户密码',
            checked: false,
            disabled: false
          }
        ],
				modalShow: false,
				modalContent: '',
				showLoadingHint: false,
				showPrivacy: false
			}
		},
		onReady () {
		},
		computed: {
			...mapGetters([
			])
		},
		onLoad () {
			if (wx.getPrivacySetting) {
			 wx.getPrivacySetting({
				 success: (res) => {
					 this.showPrivacy = res.needAuthorization
				 }
			 })
			};
			this.form.username = getCache('userName') ? getCache('userName') : '';
			this.form.password = getCache('userPassword') ? getCache('userPassword') : '';
		},
		methods: {
			...mapMutations([
				'storeUserInfo',
				'changeOverDueWay',
        'changeIsMedicalMan',
				'changeTemplateType',
				'changeIsLogin'
			]),
			
			onAgree() {
				this.showPrivacy = false;
			},
			
			onDisagree() {
				this.showPrivacy = false;
				uni.showToast({ title: '需同意隐私协议才能登录', icon: 'none' });
			},
      
      // 选中某个复选框时，由checkbox时触发
      checkboxChange(e) {
        console.log(this.list);
      },
      
      // 选中任一checkbox时，由checkbox-group触发
      checkboxGroupChange(e) {
        // console.log(e);
      },
			
			// 手机号一键登录
			async onGetPhoneNumber(e) {
				// 用户拒绝授权
				if (detail.errMsg && detail.errMsg.includes('no permission')) {
					this.showPrivacy = true;
					uni.showToast({ title: '请先同意隐私协议', icon: 'none' });
					return;
				};
				// 用户授权失败
				if (e.detail.errMsg && e.detail.errMsg !== 'getPhoneNumber:ok') {
					this.modalShow = true;
					this.modalContent = e.detail.errMsg || '未知错误';
					return;
				};
				// 获取到 code（注意：是 e.detail.code，不是 encryptedData）
				const code = e.detail.code;
				if (!code) {
					uni.showToast({ title: '获取手机号失败，请重试', icon: 'none' });
					return;
				};
				try {
					const res = await this.getPhoneNumberByPhoneCodeEvent(code);
					this.modalShow = true;
					this.modalContent = `${res}`;
				} catch (err) {
					this.modalShow = true;
					this.modalContent = `${err}`
				} finally {
					this.modalShow = false;
				}
			},
			
			// 根据phone code 获取手机号码
			getPhoneNumberByPhoneCodeEvent (code) {
				return new Promise((resolve,reject) => {
					this.showLoadingHint = true;
					getPhoneNumberByPhoneCode(code)
					.then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							resolve(res.data.data);
						} else {
							reject(res.data.msg);
							this.showLoadingHint = false;
							this.modalShow = true;
							this.modalContent = `${res.data.msg}`
						}
					})
					.catch((err) => {
						reject(err.message)
						this.showLoadingHint = false;
						this.modalShow = true;
						this.modalContent = `${err.message}`
					})
				})
			},
          
			// 账号密码事件
			sure () {
				// 账号密码不能为空
				if (this.form.username == '') {
					this.$refs.uToast.show({
						title: '请输入账号',
						position: 'bottom',
						type: 'warning'
					});
					return
				};
				if (this.form.password == '') {
					this.$refs.uToast.show({
						title: '请输入密码',
						position: 'bottom',
						type: 'warning'
					});
					return
				};
				if (this.form.username == '' && this.form.password == '') {
					this.$refs.uToast.show({
						title: '请输入账号密码',
						position: 'bottom',
						type: 'warning'
					});
					return
				};
				let loginMessage = {
				  username: this.form.username,
				  password: this.form.password
				};
				this.showLoadingHint = true;
				logIn(loginMessage).then((res) => {
					if (res) {
					  if (res.data.code == 200) {
						   this.changeOverDueWay(false);
						   setCache('storeOverDueWay',false); 
							// 登录用户名密码及用户信息存入Locastorage
              // 判断是否勾选记住用户名密码
              if (this.list[0]['checked']) {
                setCache('userName', this.form.username);
                setCache('userPassword', this.form.password);
              } else {
                removeCache('userName', this.form.username);
                removeCache('userPassword', this.form.password);
              };
							setCache('userInfo', res.data.data);
							this.changeIsLogin(true);
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
							})
					  } else {
						 this.modalShow = true;
						 this.modalContent = `${res.data.msg}`
					  }
					};
					this.showLoadingHint = false
				  })
				  .catch((err) => {
					   this.showLoadingHint = false;
					   this.modalShow = true;
					   this.modalContent = `${err.message}`
				  })
			},
      
      // 微信授权登录事件
      weixinLoginEvent () {
        uni.redirectTo({
            url: '/pages/weixinLogin/weixinLogin'
        })
      },
			
			// 弹框确定事件
			sureCancel () {},
			
			// 弹框取消事件
			cancelSure () {}
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	.container {
		@include content-wrapper;
		font-size: 14px;
		.container-content {
			flex: 1;
			background: #fff;
			position: relative;
			.title {
				width: 100%;
				height: 190px;
				line-height: 190px;
				text-align: center;
				color: black;
				font-size: 26px;
        color: #2c9af1;
        font-weight: bold;
        font-size: 50px;
          span {
            box-shadow: 0 8px 6px -6px black
          }
			};
			.form-box {
        width: 90%;
        margin: 0 auto;
				padding: 10px;
				/deep/ .u-input {
					background: #fff
				};
				text {
					display: inline-block;
					margin-bottom: 8px
				};
				.form-account {
				};
				.form-password {
					margin-top: 20px
				}
			};
      .remember-password {
        width: 100%;
        margin: 0 auto;
        height: 40px;
        position: relative;
        .remember-password-content {
          position: absolute;
          top: 0;
          right: 0
        }
      };
			.form-btn {
        width: 80%;
        margin: 0 auto;
        margin-top: 30px;
				::after {
					border-radius: 4px;
					border: none;
				};
				button {
          background-image: linear-gradient(to right, #37d5fc , #429afe);
          border-radius: 20px;
				}
			};
			.phone-btn {
			  width: 80%;
				margin-top: 30px;
			  height: 45px;
			  line-height: 45px;
			  background-color: #07c160;
			  color: #fff;
			  border-radius: 20px;
			  font-size: 18px;
			  border: none;
			};
      .weixin-login {
        width: 100%;
        margin: 0 auto;
        margin-top: 40px;
        .image-wrapper {
          width: 60px;
          height: 50px;
          margin: 0 auto;
          image {
            width: 100%;
            height: 100%
          }
        }
      }
      .bottom-character {
        width: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        bottom: 10px;
        color: #333;
        text {
          font-size: 12px;
          border-left: 1px solid #333;
          border-right: 1px solid #333;
          padding: 0 6px
        }
      }
		}
	}
</style>
