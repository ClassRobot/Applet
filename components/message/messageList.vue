<template>
	<view class="chat-list">
		<view v-for="(message, index) in messageList" :key="message.id" class="chat-item"
			:class="{ 'chat-item-self': message.isSelf }">
			<!-- 头像 -->
			
			<view class="avatar">
				<image :src="message.avatar" mode="aspectFill"></image>
			</view>
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
					
						<!-- 多图片宫格显示 -->
						<!-- <view v-else class="image-grid" :class="[
						  `image-grid-${
							item.content.length > 9 ? 9 : item.content.length
						  }`,
						]">
							<view v-for="(img, imgIndex) in item.content.slice(0, 9)" :key="imgIndex"
								class="grid-item" @tap="previewImage(item.content, imgIndex)">
								<image :src="img" mode="aspectFill"></image>
							</view>
						</view> -->
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

		&-self {
			flex-direction: row-reverse;

			.message-bubble {
				background-color: #a0e75a;
				/* 绿色气泡 */
				border-radius: 20rpx 0 20rpx 20rpx;
				margin-right: 20rpx;
			}
		}
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow: hidden;
		background-color: #e0e0e0;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.message-content {
		max-width: 70%;
		margin: 0 20rpx;
	}

	.message-bubble {
		padding: 20rpx;
		background-color: #ffffff;
		/* 白色气泡 */
		border-radius: 0 20rpx 20rpx 20rpx;
		word-break: break-all;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);

		text {
			font-size: 28rpx;
			line-height: 1.5;
		}
	}

	.image-bubble {
		padding: 0;
		// background: transparent !important;
		box-shadow: none;

		image {
			max-width: 400rpx;
			border-radius: 10rpx;
		}

		.image-grid {
			display: flex;
			flex-wrap: wrap;
			width: 400rpx;

			&-1 {
				.grid-item {
					width: 400rpx;
					height: 400rpx;
				}
			}

			&-2,
			&-4 {
				.grid-item {
					width: 195rpx;
					height: 195rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;

					&:nth-child(2n) {
						margin-right: 0;
					}
				}
			}

			&-3,
			&-5,
			&-6,
			&-7,
			&-8,
			&-9 {
				.grid-item {
					width: 126rpx;
					height: 126rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;

					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}

		.grid-item {
			overflow: hidden;
			border-radius: 8rpx;

			image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}
</style>
