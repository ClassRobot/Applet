<template>
	<view class="notification-bar" v-if="show" @tap="handleClick">
		<view class="notification-content">
			<view class="notification-icon">
				<uv-icon name="bell" size="40rpx" color="#fff"></uv-icon>
			</view>
			<view class="notification-text">
				<text>{{ text }}</text>
			</view>
		</view>
		<view class="notification-close" @tap.stop="close">
			<uv-icon name="close" size="32rpx" color="#fff"></uv-icon>
		</view>
		
		<uv-popup ref="popup" 
        mode="center" 
        :round="10" 
		:safeAreaInsetBottom="false"
        :closeOnClickOverlay="true">
			<view class="notification-popup">
				<view class="popup-title">{{ popupTitle }}</view>
				<view class="popup-content">
					<slot></slot>
				</view>
				<view class="popup-footer">
					<view class="popup-btn" @tap="closePopup">知道了</view>
				</view>
			</view>
		</uv-popup>
	</view>
</template>

<script>
export default {
	name: 'NotificationBar',
	props: {
		// 通知文本内容
		text: {
			type: String,
			default: '参加家校群调研，大礼等你来拿'
		},
		// 弹窗标题
		popupTitle: {
			type: String,
			default: '活动详情'
		},
		// 是否自动关闭
		autoClose: {
			type: Boolean,
			default: false
		},
		// 自动关闭时间（毫秒）
		duration: {
			type: Number,
			default: 3000
		}
	},
	data() {
		return {
			show: true
		}
	},
	mounted() {
		if (this.autoClose) {
			setTimeout(() => {
				this.show = false
			}, this.duration)
		}
	},
	methods: {
		// 关闭通知
		close() {
			this.show = false
			this.$emit('close')
		},
		// 点击通知
		handleClick() {
			this.$refs.popup.open()
			this.$emit('click')
		},
		// 关闭弹窗
		closePopup() {
			this.$refs.popup.close()
		}
	}
}
</script>

<style lang="scss" scoped>
.notification-bar {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background-color: rgba(0, 0, 0, 0.7);
	color: #fff;
	font-size: 28rpx;
	z-index: 999;
	border-radius: 16rpx;
	margin: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
	transition: all 0.3s ease;

	&:active {
		transform: scale(0.98);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}
}

.notification-content {
	display: flex;
	align-items: center;
	flex: 1;
}

.notification-icon {
	margin-right: 20rpx;
}

.notification-text {
	flex: 1;
}

.notification-close {
	padding: 10rpx;
}

.notification-popup {
	width: 600rpx;
	padding: 30rpx;
    color: #333;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 30rpx;
}

.popup-content {
	padding: 20rpx 0;
	min-height: 100rpx;
}

.popup-footer {
	display: flex;
	justify-content: center;
	margin-top: 30rpx;
}

.popup-btn {
	background-color: #07c160;
	color: #fff;
	padding: 20rpx 60rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
}
</style>