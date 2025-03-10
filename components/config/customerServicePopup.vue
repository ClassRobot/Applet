<template>
	<!-- 联系客服弹框 -->
	<uv-popup ref="popup" 
	:safeAreaInsetBottom="false"
	:round="30">
		<view class="warp">
			<view class="rect" @tap.stop>
				<view class="title">联系{{ bTitle || title }}</view>
				<view class="center">确定拨打{{ bTitle || title }}电话?</view>
				<view class="bottom">
					<view class="btn1"
					@click="close">
						取消
					</view>
					<view class="btn2"
					@click="confirm">
						确定
					</view>
				</view>
			</view>
		</view>
	</uv-popup>
</template>

<script>
	export default {
		data() {
			return {
				phone:'',
				title : '客服',
				bPhone : '',
				bTitle : '',
			}
		},
		mounted() {
			this.getCustomPhone()
		},
		methods: {
			getCustomPhone(){
				this.$api('customUser', {}, res => {
					this.phone = res.result.phone
				})
			},
			open(phone, title) {
				this.bPhone = phone || this.phone
				this.bTitle = title || this.title
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			// 拨打电话
			confirm() {
				this.$refs.popup.close()
				uni.makePhoneCall({
					phoneNumber: this.bPhone || this.phone,
					success() {
						console.log('安卓拨打成功');
					},
					fail() {
						console.log('安卓拨打失败');
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;

	}

	.rect {
		width: 600rpx;
		height: 300rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;

		.title {
			padding: 10rpx 0 0 15rpx;
			background-color: $uni-color;
			color: #FFF;
			text-align: left;
			width: 100%;
			height: 18%;
			font-size: 36rpx;
		}

		.center {
			height: 40%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 36rpx;
		}

		.bottom {
			display: flex;
			justify-content: center;
			gap: 50rpx;
			view{
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 50rpx;
				border-radius: 30rpx;
			}
			.btn1{
				background-color: #fff;
			}
			.btn2{
				background-color: $uni-color;
				color: #fff;
			}
		}
	}
</style>