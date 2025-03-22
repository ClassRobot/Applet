<template>
	<view class="page chat-page">
		<navbar title="言夕" />
		
		<!-- 通知栏 -->
		<NotificationBar>
            <view>
                参加家校群调研，大礼等你来拿参加家校群调研，大礼等你来拿
            </view>
        </NotificationBar>
		
		<!-- 聊天消息列表区域 -->
		<scroll-view scroll-y class="chat-container" :scroll-top="scrollTop" @scrolltoupper="loadMore">
			<view class="chat-list">
				<view v-for="(item, index) in messageList" :key="index" class="chat-item" :class="{'chat-item-self': item.isSelf}">
					<!-- 头像 -->
					<view class="avatar">
						<image :src="item.avatar" mode="aspectFill"></image>
					</view>
					<!-- 消息内容 -->
					<view class="message-content">
						<!-- 文本消息 -->
						<view v-if="item.type === 'text'" class="message-bubble">
							<text>{{item.content}}</text>
						</view>
						<!-- 图片消息 -->
						<view v-else-if="item.type === 'image'" class="message-bubble image-bubble">
							<!-- 单图片显示 -->
							<image v-if="!Array.isArray(item.content)" 
							:src="item.content" mode="widthFix" 
							@tap="previewImage([item.content], 0)"></image>
							
							<!-- 多图片宫格显示 -->
							<view v-else class="image-grid" :class="[`image-grid-${item.content.length > 9 ? 9 : item.content.length}`]">
								<view 
									v-for="(img, imgIndex) in item.content.slice(0, 9)" 
									:key="imgIndex" 
									class="grid-item"
									@tap="previewImage(item.content, imgIndex)"
								>
									<image :src="img" mode="aspectFill"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部输入区域 -->
		<view class="chat-footer">
			<view class="input-box">
				<input type="text" v-model="inputMessage" placeholder="请输入消息..." confirm-type="send" @confirm="sendMessage"/>
				<view class="action-buttons">
					<view class="upload-btn" @tap="chooseImage">
						<uv-icon name="photo" size="46rpx" color="#666"></uv-icon>
					</view>
					<view class="send-btn" @tap="sendMessage">
						<text>发送</text>
					</view>
				</view>
			</view>
		</view>
		
		<loginPopup ref="loginPopup" @login=""/>
		
		<PrivacyAgreementPoup/>
	</view>
</template>

<script>
	import NotificationBar from '@/components/notification/NotificationBar.vue';
	import loginPopup from '@/components/config/loginPopup.vue'
	export default {
		components: {
			NotificationBar,
			loginPopup,
		},
		data() {
			return {
				messageList: [
					{
						isSelf: false,
						avatar: '/static/image/center/1.jpg',
						type: 'text',
						content: '你好，我是机器人助手！'
					},
					{
						isSelf: true,
						avatar: '/static/image/center/avatar.png',
						type: 'text',
						content: '你好，请问有什么可以帮助我的？'
					}
				],
				inputMessage: '',
				scrollTop: 0
			}
		},
		computed: {
		},
		onLoad() {
			if(uni.getStorageSync('token')){
				this.$store.commit('initSocket')
			}else{
				this.$refs.loginPopup.open()
			}
		},
		methods: {
			// 发送文本消息
			sendMessage() {
				if (!this.inputMessage.trim()) return;
				
				// 添加自己的消息
				this.addMessage({
					isSelf: true,
					avatar: '/static/image/center/avatar.png',
					type: 'text',
					content: this.inputMessage
				});
				
				// 清空输入框
				this.inputMessage = '';
				
				// 模拟机器人回复
				setTimeout(() => {
					this.addMessage({
						isSelf: false,
						avatar: '/static/image/center/1.jpg',
						type: 'text',
						content: '我收到了你的消息：' + this.messageList[this.messageList.length - 1].content
					});
				}, 500);
			},
			
			// 选择并上传图片
			chooseImage() {
				
				this.uploadImage({})
				.then(urls => {
					// 检查返回的是单张图片还是多张图片数组
					// uploadImage返回的是图片路径数组
					this.addMessage({
						isSelf: true,
						avatar: '/static/image/center/avatar.png',
						type: 'image',
						content: urls
					});
					
					// 模拟机器人回复
					setTimeout(() => {
						this.addMessage({
							isSelf: false,
							avatar: '/static/image/center/1.jpg',
							type: 'text',
							content: '我收到了你发送的图片！'
						});
					}, 500);
				})
				
			},
			// 图片上传
			uploadImage({
				compressed = true,
			}){
				return new Promise((success, error) => {
					const sizeType = [compressed ? 'compressed' : 'original']
					uni.chooseImage({
						count: 9,
						sizeType,
						success(res) {
							// 直接返回图片路径数组，而不是拼接成字符串
							success(res.tempFilePaths.length == 1 ? res.tempFilePaths[0] : res.tempFilePaths)
						},
						fail : error,
					})
				})
			},
			
			// 添加消息到列表
			addMessage(message) {
				this.messageList.push(message);
				// 滚动到底部
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			},
			
			// 滚动到底部
			scrollToBottom() {
				// 使用一个很大的值确保滚动到底部
				this.scrollTop = this.scrollTop === 999999999 ? 100000000 : 999999999;
			},
			
			// 加载更多历史消息
			loadMore() {
				// 这里可以实现加载更多历史消息的逻辑
				console.log('加载更多历史消息');
			},
			
			// 预览图片
			previewImage(urls, current) {
				uni.previewImage({
					urls: urls,
					current
				});
			},
		},
		// 页面加载完成后滚动到底部
		onReady() {
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		}
	}
</script>

<style scoped lang="scss">
.chat-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
}

.chat-container {
	flex: 1;
	padding: 20rpx;
	overflow: hidden;
    box-sizing: border-box;
}

.chat-list {
	padding-bottom: 20rpx;
}

.chat-item {
	display: flex;
	margin-bottom: 30rpx;
	
	&-self {
		flex-direction: row-reverse;
		
		.message-bubble {
			background-color: #a0e75a; /* 绿色气泡 */
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
	background-color: #ffffff; /* 白色气泡 */
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
	background: transparent !important;
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
		
		&-2, &-4 {
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
		
		&-3, &-5, &-6, &-7, &-8, &-9 {
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

.chat-footer {
	padding: 20rpx;
	background-color: #f8f8f8;
	border-top: 1rpx solid #e0e0e0;
}

.input-box {
	display: flex;
	align-items: center;
	background-color: #ffffff;
	border-radius: 10rpx;
	padding: 10rpx 20rpx;
	
	input {
		flex: 1;
		height: 70rpx;
		font-size: 28rpx;
	}
	
	.action-buttons {
		display: flex;
		align-items: center;
		
		.upload-btn {
			padding: 10rpx 20rpx;
		}
		
		.send-btn {
			background-color: #07c160;
			color: #ffffff;
			padding: 10rpx 30rpx;
			border-radius: 8rpx;
			margin-left: 10rpx;
			
			text {
				font-size: 28rpx;
			}
		}
	}
}
</style>
