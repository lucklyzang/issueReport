<template>
	<view class="container">
		<view class="content-title">
			我是问题上报页
		</view>
		<view class="content-details">
			<button type="default" @click="takePhoto">拍照</button>
			<button type="primary" @click="choosePhoto">从相册中选择</button>
			<view>预览</view>
			<image mode="widthFix" v-for="(item,index) in chooseImgList" :src="item"></image>
		</view>
		<view class="content-botom">
			我是底部内容
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				 chooseImgList: []
			}
		},
		onLoad: function (option) {
			console.log(option.id)
		},
		methods: {
			takePhoto() {
				let _this = this;
				uni.chooseImage({
				    count: 6, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['camera'], //拍照
				    success: function (res) {
						let tempImg = res.tempFilePaths[0];
						_this.urlTobase64(tempImg)
				    }
				});
			},
			
			choosePhoto() {
				let _this = this;
				uni.chooseImage({
				    count: 6, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: function (res) {
						let tempImg = res.tempFilePaths;
						_this.urlTobase64(tempImg)
				    }
				})
			},
			
			asyncFunc (item) {
				let _this = this;
			    return new Promise(function(resolve, reject) {
			        uni.getFileSystemManager().readFile({
			        	filePath: item, //选择图片返回的相对路径
			        	encoding: 'base64', //编码格式
			        	success: res => { //成功的回调
			        		let base64 = 'data:image/jpeg;base64,' + res.data //不加上这串字符，在页面无法显示的哦
			        		_this.chooseImgList.push(base64);
			        		console.log(_this.chooseImgList);
							resolve()
			        	}
			        })
			    });
			},
			
			async urlTobase64(url) {
				this.chooseImgList = [];
				for (var i = 0; i < url.length; i++) {
					await this.asyncFunc(url[i])
				}
			},
			
			
		}
	}
</script>

<style lang="scss">
 @import "~@/common/stylus/variable.scss";
	.container {
		@include content-wrapper;
		.content-title {
			height: 30px;
			width: 100%;
			line-height: 30px;
			text-align: center;
			color: pink;
			font-size: 20px
		};
		.content-details {
			flex: 1;
			padding: 20px;
			box-sizing: border-box;
			text-align: center
		};
		.content-botom {
			height: 30px;
			line-height: 30px
		}
	}
</style>
