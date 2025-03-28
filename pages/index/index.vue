<template>
	<view class="page chat-page">
		<navbar title="言夕Ai" />

		<!-- 通知栏 -->
		<NotificationBar>
			<view> 参加家校群调研，大礼等你来拿参加家校群调研，大礼等你来拿 </view>
		</NotificationBar>
		<!-- 聊天消息列表区域 -->
		
		<scroll-view scroll-y class="chat-container" :scroll-top="scrollTop" @scrolltoupper="loadMore">
			<messageList :messageList="messageList" />
		</scroll-view>

		<!-- 底部输入区域 -->
		<view class="chat-footer">
			<view class="input-box">
				<input type="text" v-model="inputMessage" placeholder="请输入消息..." confirm-type="send"
					@confirm="sendMessage" />
				<!-- 发送按钮 -->
				<view class="action-buttons">
					<view class="send-btn" @tap="sendMessage">
						<text>发送</text>
					</view>

					<!-- 更多按钮 -->
					<view class="more-btn" @click="toggleMenu">
						<text>+</text>
					</view>
					<!-- 底部弹出菜单 -->
					<view class="bottom-menu" v-if="isMenuVisible">
						<!-- 菜单内容 -->
						<view class="up-item">
							<!-- 收起菜单栏 -->
							<text @click="UntoggleMenu">收起</text>
						</view>
						<!-- 上传图片按钮 -->
						<view class="menu-item" @tap="chooseImage">
							<uv-icon name="photo" size="60rpx" color="#666"></uv-icon>
						</view>
						<!-- 上传文件按钮 -->
						<view class="menu-item" @tap="chooseFile">
							<uv-icon name="file-text" size="60rpx" color="#666"></uv-icon>
						</view>
						<!-- 导航功能按钮 -->
						<view class="menu-item" @tap="chooseFile">
							<uv-icon name="map" size="60rpx" color="#666"></uv-icon>
						</view>
					</view>
				</view>
			</view>
		</view>

		<loginPopup ref="loginPopup" @login="" />

		<PrivacyAgreementPoup />
	</view>
</template>

<script>
	import NotificationBar from "@/components/notification/NotificationBar.vue";
	import loginPopup from "@/components/config/loginPopup.vue";
	import messageList from '@/components/message/messageList.vue'
	//import listmx from "@/mixins/list.js";
	export default {
		components: {
			NotificationBar,
			loginPopup,
			messageList,
		},

		// mixins: [listmx],
		data() {
			return {
				// mixinsListApi: "getxxx",
				messageList: [],
				inputMessage: "",
				scrollTop: 0,
				isMenuVisible: false,
				selectedImages: [],
			};
		},
		computed: {},
		beforeDestroy() {
			uni.$off('sendMessage:detailType:private', this.handledrMessage)
		},
		onLoad() {
			if (uni.getStorageSync("token")) {
				this.$store.commit("initSocket");
				this.$store.commit('getUserInfo')
			} else {
				this.$refs.loginPopup.open();
			}

			uni.$on('sendMessage:detailType:private', this.handledrMessage)
		},
		methods: {
			// 处理接收到的聊天信息
			handledrMessage(messgae) {
				messgae.data = JSON.parse(messgae.data)
				
				messgae.isSelf = messgae.userId == this.userInfo.userId
				
				this.messageList.push(messgae)
				// 滚动到底部
				this.$nextTick(() => {
					// 等待 DOM 更新完成后执行滚动操作
					this.scrollToBottom();
				});
			},
			//打开菜单栏
			toggleMenu() {
				this.isMenuVisible = !this.isMenuVisible;
			},

			// 收起菜单栏
			UntoggleMenu() {
				this.isMenuVisible = false;
			},
			//判断图片是否存在
			hasImages() {
				return this.selectedImages.length > 0;
			},

			chooseImage() {
				this.uploadImage({}).then((urls) => {
					this.selectedImages = urls;
					this.UntoggleMenu();
				});
			},

			chooseFile() {
				// 处理选择文件的逻辑
				console.log("选择文件");
			},

			// 发送文本消息
			sendMessage() {
				if (!this.inputMessage.trim()) return;

				let messages = []

				messages.push({
					type: 'text',
					data: {
						text: this.inputMessage
					}
				})

				this.$api('sendPrivateMessage', {
					messages
				})

				// 清空输入框
				this.inputMessage = "";

			},

			// 图片上传
			/**
			 * 选择图片并返回所选图片的临时文件路径
			 * @param {Object} options - 上传图片的配置选项
			 * @param {boolean} options.compressed - 是否对图片进行压缩，默认为 true
			 * @returns {Promise<string|string[]>} - 当选择一张图片时返回图片路径字符串，选择多张图片时返回图片路径数组
			 */
			uploadImage({
				compressed = true
			}) {
				return new Promise((success, error) => {
					// 根据 compressed 参数决定图片选择时的尺寸类型
					const sizeType = [compressed ? "compressed" : "original"];

					uni.chooseImage({
						count: 9, // 最多可选择 9 张图片
						sizeType,
						success(res) {
							// 直接返回图片路径数组，而不是拼接成字符串
							// 如果输入框为空，则提示输入内容，可以选择不输入直接发送图片
							// 这里可以添加输入框判断逻辑，例如：

							// 选择成功后，根据选择图片的数量返回不同格式的数据
							success(
								res.tempFilePaths.length == 1 ?
								res.tempFilePaths[0] :
								res.tempFilePaths
							);
						},
						fail: error,
					});
				});
			},

			// 添加消息到列表
			/**
			 * 将消息添加到消息列表中，并滚动到列表底部
			 * @param {any} message - 要添加的消息内容
			 */
			addMessage(message) {
				this.messageList.push(message);
				// 滚动到底部
				this.$nextTick(() => {
					// 等待 DOM 更新完成后执行滚动操作
					this.scrollToBottom();
				});
			},

			// 滚动到底部
			/**
			 * 滚动消息列表到底部
			 */
			scrollToBottom() {
				// 使用一个很大的值确保滚动到底部
				// 这里使用一个简单的逻辑来交替设置一个很大的值，以触发滚动
				this.scrollTop = this.scrollTop === 999999999 ? 100000000 : 999999999;
			},

			// 加载更多历史消息
			/**
			 * 加载更多历史消息的逻辑
			 */
			loadMore() {
				// 这里可以实现加载更多历史消息的逻辑
				// 示例逻辑：
				// 1. 发送请求到后端获取更多历史消息
				// 2. 将获取到的消息添加到 messageList 数组的前面
				// 3. 可以根据需要更新一些状态，如是否还有更多消息等
				console.log("加载更多历史消息");
				// 示例代码：
				// uni.request({
				//   url: 'your-api-url',
				//   data: {
				//     // 传递必要的参数，如当前消息的起始位置等
				//     start: this.messageList.length
				//   },
				//   success: (res) => {
				//     if (res.data.length > 0) {
				//       this.messageList = res.data.concat(this.messageList);
				//     } else {
				//       uni.showToast({
				//         title: '没有更多历史消息了',
				//         icon: 'none'
				//       });
				//     }
				//   },
				//   fail: (err) => {
				//     console.error('加载历史消息失败', err);
				//   }
				// });
			},

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

			// 页面加载完成后滚动到底部
			/**
			 * 页面初次渲染完成后执行的生命周期钩子，用于滚动消息列表到底部
			 */
			onReady() {
				this.$nextTick(() => {
					// 等待 DOM 更新完成后执行滚动操作
					this.scrollToBottom();
				});
			},
		},
	};
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
				padding: 5rpx 20rpx;
			}

			.more-btn {
				background-color: #e8ecef;
				color: #ffffff;
				padding: 5rpx 20rpx;
				border-radius: 8rpx;
				margin-left: 10rpx;

				text {
					font-size: 40rpx;
				}
			}

			.send-btn {
				background-color: #22a6f1;
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

	.bottom-menu {
		position: fixed;
		bottom: 55px;
		left: 0;
		right: 0;
		background-color: #f6f5f5;
		border-top: 1px solid #ede7e7;
		padding: 10px;
		display: flex;
		/* 允许子元素换行排列 */
		flex-wrap: wrap;
	}

	.menu-item {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		margin: 30px 0px 10px 43px;
		padding: 10px;
		background-color: #fff;
		border-radius: 20%;
		cursor: pointer;
	}

	.up-item {
		position: absolute;
		left: 50%;
		top: 10;
		transform: translate(-10%);
		width: 100px;
		height: 100px;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>