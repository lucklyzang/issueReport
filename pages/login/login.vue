<template>
	<view class="container">
		<ourLoading isFullScreen :active="showLoadingHint"  :translateY="50" text="登录中···" color="#fff" textColor="#fff" background-color="rgb(143 143 143)"/>
		<u-modal v-model="modalShow" :content="modalContent" title=""
		 :show-cancel-button="true" @confirm="sureCancel" @cancel="cancelSure">
		</u-modal>
		<view class="container-content">
			<view class="title">中央运送</view>
			<view class="form-box">
				<u-form :model="form" ref="uForm">
					<u-form-item label="账号" right-icon="account-fill" :label-style="{'font-size':'15px'}" :right-icon-style="{'font-size':'20px'}">
						<u-input v-model="form.userName" placeholder="请输入账号"/>
					</u-form-item>
					<u-form-item label="密码" right-icon="lock-fill" :label-style="{'font-size':'15px'}" :right-icon-style="{'font-size':'20px'}">
						<u-input v-model="form.password" placeholder="请输入密码" type="password"/>
					</u-form-item>
				</u-form>
			</view>
			<view class="form-btn">
				<button type="primary" @click="sure">确认</button>
				<button type="primary" @click="cancel">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import {logIn} from '@/api/login.js'
	import { setCache, getCache } from '@/common/js/utils'
	export default {
	components: {
	 },
		data() {
			return {
				form: {
					userName: '',
					password: ''
				},
				modalShow: false,
				modalContent: '',
				showLoadingHint: false
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
			...mapMutations([
				'storeUserInfo'
			]),
			// 确认事件
			sure () {
				uni.switchTab({
				    url: '/pages/index/index'
				});
				let loginMessage = {
					  username: this.form.userName,
					  password: this.form.password
				};
				this.showLoadingHint = true;
				// logIn(loginMessage).then((res)=>{
				// 	if (res) {
				// 		  if (res.data.code == 200) {
				// 				// 登录用户名密码及用户信息存入Locastorage
				// 				setCache('userName', this.username);
				// 				setCache('userPassword', this.password);
				// 				setCache('userInfo', res.data.data);
				// 				setCache('isLogin', true);
				// 				this.storeUserInfo(res.data.data);
				// 				uni.switchTab({
				// 					url: '/pages/index/index'
				// 				})
				// 		  } else {
				// 			 this.modalShow = true;
				// 			 this.modalContent = `${res.data.msg}`
				// 		  }
				// 	};
				// 	this.showLoadingHint = false
				//    })
				//   .catch((err) => {
				// 	   this.showLoadingHint = false;
				// 	   this.modalShow = true;
				// 	   this.modalContent = `${res.data.msg}`
				//   })
			},
			// 取消事件
			cancel () {
				uni.navigateTo({
				    url: '/pages/myInfo/myInfo'
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
		// #75b0f0
		@include content-wrapper;
		font-size: 14px;
		.container-content {
			flex: 1;
			background: #fff;
			position: relative;
			.title {
				width: 100%;
				height: 100px;
				line-height: 100px;
				text-align: center;
				color: black;
				font-size: 26px;
				margin-bottom: 50px;
			},
			.form-box {
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
			.form-btn {
				margin-top: 20px;
				padding: 10px;
				button {
					&:first-child {
						margin-bottom: 10px;
						background: #78d035
					};
					&:last-child {
						background: #fff;
						color: black
					}
				}
			}
		}
	}
</style>
