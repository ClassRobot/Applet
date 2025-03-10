<template>
	<view class="login">
		<view class="logo">
			<!-- <image src="/static/image/login/logo.png" mode=""></image> -->
		</view>
		<view class="title">
			欢迎使用酒店桌布租赁平台
		</view>
		<view class="btn mt"
			@click="wxLogin">
			<view class="icon">
				<image src="../static/auth/wx.png" mode=""></image>
			</view>
			<view class="">
				微信授权登录
			</view>
		</view>
		<!-- <view class="btn b2">
			使用短信验证登录
		</view> -->
		<view class="btn b2"
		@click="qux">
			取消登录
		</view>
		
		
		
		<view class="config">
			<uv-checkbox-group
				v-model="checkboxValue"
				shape="circle">
				<view class="content">
					<view
					style="display: flex;">
						
						<uv-checkbox
							size="40rpx"
							icon-size="30rpx"
							activeColor="#FD5100"
							:name="1"
						></uv-checkbox>
						阅读并同意我们的<text @click="$refs.popup.open('getPrivacyPolicy')">“服务协议与隐私条款”</text>
					</view>
					<view class="">
						以及<text @click="$refs.popup.open('getUserAgreement')">个人信息保护指引</text>
					</view>
				</view>
			</uv-checkbox-group>
		</view>
		
		<configPopup ref="popup"></configPopup>
		
	</view>
</template>

<script>
	export default {
		name : 'Login',
		data() {
			return {
				checkboxValue : []
			}
		},
		methods: {
			wxLogin(){
				if(!this.checkboxValue.length){
					return uni.showToast({
						title: '请先同意隐私协议',
						icon:'none'
					})
				}
				this.$store.commit('login')
			},
			qux(){
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
.login{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 80vh;
	flex-direction: column;
	position: relative;
	.logo{
		height: 140rpx;
		width: 140rpx;
		background-color: #ddd;
		border-radius: 30rpx;
		image{
			height: 140rpx;
			width: 140rpx;
			border-radius: 30rpx;
		}
		margin-bottom: 20rpx;
	}
	.title{
		position: relative;
		font-weight: 900;
		font-size: 45rpx;
		&::after{
			content: '';
			position: absolute;
			left: 0;
			top: 100%;
			display: block;
			height: 8rpx;
			width: 210rpx;
			background: linear-gradient(to right,$uni-color, #fff);
		}
	}
	.btn{
		width: 80%;
		height: 100rpx;
		background-color: $uni-color;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20rpx 0;
		border-radius: 20rpx;
		.icon{
			margin-right: 10rpx;
			image{
				width: 40rpx;
				height: 35rpx;
			}
		}
	}
	.b2{
		background-color: rgba($uni-color, 0.2);
		color: $uni-color;
	}
	.mt{
		margin-top: 200rpx;
	}
	
	.config{
		position: absolute;
		bottom: 0;
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
		text{
			color: $uni-color;
		}
	}
}
</style>
