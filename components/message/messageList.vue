<template>
	<view class="chat-list">
		<view v-for="(message, index) in messageList" :key="message.id" class="chat-item"
			:class="{ 'chat-item-self': message.isSelf }">
			<!-- 消息内容 -->
			<view class="message-content">
				<view class="" v-for="(item, it) in message.data"
				:key="it">
					<!-- 文本消息 -->
					<view v-if="item.type == 'text'" class="message-bubble">
						<!-- <text>{{ item.data.text }}</text> -->
						<messageText :data="item.data"/>
					</view>
					<!-- 图片消息 -->
					<view v-else-if="item.type == 'image'" class="message-bubble image-bubble">
						<!-- 单图片显示 -->
						<image v-if="!Array.isArray(item.data.file_url)" :src="item.data.file_url" mode="widthFix"
							@tap="previewImage([item.data.file_url], 0)"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import messageText from './messageText.vue'
	export default {
		props : ['messageList'],
		components : {
			messageText
		},
		data() {
			return {
				
			}
		},
		methods: {

			// 预览图片
			/**
			 * 预览图片
			 * @param {string[]} urls - 图片的 URL 数组
			 * @param {string} current - 当前预览的图片 URL
			 */
			previewImage(urls, current) {
				uni.previewImage({
					urls: urls,
					current,
				});
			},
			
		}
	}
</script>

<style scoped lang="scss">
.chat-list {
	padding-bottom: 20rpx;
}

.chat-item {
	display: flex;
	margin-bottom: 30rpx;
	justify-content: flex-start;

	&-self {
		flex-direction: row-reverse;
		justify-content: flex-start;

		.message-bubble {
			background-color: #2797ff; /* 豆包AI风格的蓝色气泡 */
			color: #ffffff;
			border-radius: 18rpx 4rpx 18rpx 18rpx;
			margin-right: 0;
		}
	}
}

.message-content {
	max-width: 70%;
	margin: 0;
}

.message-bubble {
	padding: 20rpx 24rpx;
	background-color: #f0f0f0; /* 豆包AI风格的灰色气泡 */
	border-radius: 4rpx 18rpx 18rpx 18rpx;
	word-break: break-all;
	box-shadow: none; /* 移除阴影 */

	text {
		font-size: 30rpx;
		line-height: 1.6;
	}
}

.image-bubble {
	padding: 0;
	border-radius: 10rpx;
	overflow: hidden;
	background: transparent !important;
	box-shadow: none;

	image {
		max-width: 400rpx;
		border-radius: 10rpx;
	}
}
</style>
