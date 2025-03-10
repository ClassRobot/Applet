<template>
	<uv-popup ref="popup" z-index="99999" :closeOnClickOverlay="false" :customStyle="{ backgroundColor: 'transparent' }">
		<view class="privacyPopup">
			<view class="icon">
				<image src="/static/image/PrivacyAgreementPoup/icon.png" 
				mode=""></image>
			</view>
			<view class="title">
				<view>协议与隐私政策</view>
			</view>
			<view class="content_pri">
				<view class="text">
					欢迎来到酒店布草!我们根据最新的法律法规、监管政策要求，更新了《用户协议》和《隐私政策》,请您认真阅读。
				</view>
			</view>
			<view class="config">
				<uv-checkbox-group v-model="checkboxValue" shape="circle">
					<view class="content">
						<view style="display: flex;">
							<!-- <uv-checkbox size="30rpx" :name="1"></uv-checkbox> -->
							同意<text @click="goToPrivacy">《酒店布草隐私政策》</text>
						</view>
						<view class="">
							以及<text @click="goToPrivacy">《用户协议》</text>
						</view>
					</view>
				</uv-checkbox-group>
			</view>
			<view class="pri_btn">
				<button class="confuse_btn" @click="confusePrivacy">拒绝</button>
				<button 
				class="confirm_btn" id="agree-btn" 
				open-type="agreePrivacyAuthorization"
				@agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
			</view>
		</view>
	</uv-popup>
</template>

<script>
	export default {
		name: 'PrivacyAgreementPoup',
		data() {
			return {
				resolvePrivacyAuthorization: {},
				checkboxValue : false
			}
		},
		mounted() {
			if(wx.getPrivacySetting){
				wx.getPrivacySetting({
					success: res => {
						console.log(res)
						if (res.needAuthorization) {
							// 需要弹出隐私协议
							this.init()
						}
					},
					fail: () => {}
				})
			}
		},
		methods: {

			//初始化
			init(resolve) {
				this.$refs.popup.open('center')
				this.resolvePrivacyAuthorization = resolve
			},

			// 打开隐私协议
			goToPrivacy() {
				wx.openPrivacyContract({
					success: () => {
						console.log('打开成功');
					}, // 打开成功
					fail: () => {
						uni.showToast({
							title: '打开失败，稍后重试',
							icon: 'none'
						})
					} // 打开失败
				})
			},

			// 拒绝
			confusePrivacy() {
				this.$refs.popup.close()
				// this.resolvePrivacyAuthorization({
				// 	event: 'disagree'
				// })
			},

			// 同意
			handleAgreePrivacyAuthorization() {
				// 告知平台用户已经同意，参数传同意按钮的id
				// this.resolvePrivacyAuthorization({
				// 	buttonId: 'agree-btn',
				// 	event: 'agree'
				// })
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.privacyPopup {
		width: 90%;
		margin: 0rpx auto;
		background: white;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 40rpx 30rpx;
		
		.icon{
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 30rpx;
			image{
				width: 90rpx;
				height: 90rpx;
			}
		}

		.title {
			text-align: center;
			font-size: 36rpx;
		}

		.content_pri {
			padding: 30rpx 0rpx;
			font-size: 28rpx;
		}

		.config {
			font-size: 28rpx;
			text-align: center;
			line-height: 40rpx;
			margin-bottom: 30rpx;

			text {
				color: $uni-color;
			}
			
			.content{
				display: flex;
			}
		}

		.pri_btn {
			display: flex;
			.confuse_btn{
				background-color: #F2F2F2;
				color: #BDBDBD;
			}
			button {
				margin: 10rpx;
				flex: 1;
				background: $uni-color;
				outline: none;
				color: white;
				font-size: 30rpx;
			}

		}
	}
</style>