<template>
	<view class="chat-footer">
		<!-- 常用问题建议区域 -->
		<view class="command-suggestions" v-if="showSuggestions">
			<scroll-view scroll-x class="suggestions-scroll">
				<view class="suggestion-item" v-for="(item, index) in commandSuggestions" :key="index" @tap="useCommandSuggestion(item)">
					<text>{{item.text}}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 复合消息预览区域 -->
		<view class="message-preview" v-if="previewItems.length > 0">
			<scroll-view scroll-x class="preview-scroll">
				<view style="display: flex; align-items: center;">
					
                    <view class="preview-item" v-for="(item, index) in previewItems" :key="index">
                        <!-- 图片预览 -->
                        <view v-if="item.type === 'image'" class="preview-content preview-image">
                            <image :src="item.data.file_url" mode="aspectFill"></image>
                        </view>
                        
                        <!-- 文件预览 -->
                        <view v-else-if="item.type === 'file'" class="preview-content preview-file">
                            <view class="file-icon">
                                <uv-icon name="file-text-fill" size="40rpx" color="#666"></uv-icon>
                            </view>
                            <text class="file-name">{{item.data.file_name}}</text>
                        </view>
                        
                        <!-- 位置预览 -->
                        <view v-else-if="item.type === 'location'" class="preview-content preview-location">
                            <view class="location-icon">
                                <uv-icon name="map-fill" size="40rpx" color="#2797ff"></uv-icon>
                            </view>
                            <view class="location-info">
                                <text class="location-name">{{item.data.name}}</text>
                                <text class="location-address" v-if="item.data.address">{{item.data.address.substring(0, 10)}}{{item.data.address.length > 10 ? '...' : ''}}</text>
                            </view>
                        </view>
                        
                        <!-- 删除按钮 -->
                        <view class="preview-delete" @tap="removePreviewItem(index)">
                            <text>×</text>
                        </view>
                    </view>
                    
				</view>
			</scroll-view>
		</view>

		<view class="input-box">
			<!-- 命令提示区域 -->
			<view class="command-prompt" v-if="inputMessage.startsWith('/') && filteredCommands.length > 0">
				<view class="command-item" v-for="(cmd, idx) in filteredCommands" :key="idx" @tap="selectCommand(cmd)">
					<text class="command-name">/{{cmd.name}}</text>
					<text class="command-desc">{{cmd.description}}</text>
				</view>
			</view>
			
			<!-- 输入框区域 -->
			<input 
				type="text" 
				v-model="inputMessage" 
				:placeholder="placeholder" 
				confirm-type="send"
				@confirm="sendMessage" 
				@input="handleInput" 
				@focus="onInputFocus"
				@blur="onInputBlur"
			/>
			
			<!-- 功能按钮区 -->
			<view class="action-buttons">
				<!-- 发送按钮 -->
				<view class="send-btn" @tap="sendMessage" v-if="inputMessage.trim() || previewItems.length > 0">
					<text>发送</text>
				</view>

				<!-- 更多按钮 - 始终显示 -->
				<view class="more-btn" @click="toggleMenu">
					<text>+</text>
				</view>
			</view>
		</view>
		
		<!-- 底部滑动菜单 -->
		<view class="menu-container" :class="{ 'menu-visible': isMenuVisible }">
			<view class="menu-header">
				<view class="menu-handle"></view>
				<view class="menu-close" @tap="toggleMenu">
					<text>收起</text>
				</view>
			</view>
			
			<scroll-view scroll-x class="menu-scroll-view">
				<view class="menu-content">
					<!-- 上传图片按钮 -->
					<view class="menu-item" @tap="chooseImage">
						<view class="menu-icon">
							<uv-icon name="photo" size="60rpx" color="#2797ff"></uv-icon>
						</view>
						<text class="menu-text">图片</text>
					</view>
					
					<!-- 上传文件按钮 -->
					<view class="menu-item" @tap="chooseFile">
						<view class="menu-icon">
							<uv-icon name="file-text" size="60rpx" color="#2797ff"></uv-icon>
						</view>
						<text class="menu-text">文件</text>
					</view>
					
					<!-- 位置按钮 -->
					<view class="menu-item" @tap="chooseLocation">
						<view class="menu-icon">
							<uv-icon name="map" size="60rpx" color="#2797ff"></uv-icon>
						</view>
						<text class="menu-text">位置</text>
					</view>
					
					<!-- 重新生成按钮 -->
					<!-- <view class="menu-item" @tap="regenerateLastResponse" v-if="canRegenerate && !isGenerating">
						<view class="menu-icon">
							<uv-icon name="reload" size="60rpx" color="#2797ff"></uv-icon>
						</view>
						<text class="menu-text">重新生成</text>
					</view> -->
					
					<!-- 清空对话按钮 -->
					<view class="menu-item" @tap="clearChat">
						<view class="menu-icon">
							<uv-icon name="trash" size="60rpx" color="#2797ff"></uv-icon>
						</view>
						<text class="menu-text">清空对话</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ChatInputBox',
		props: {
			canRegenerate: {
				type: Boolean,
				default: false
			},
			isGenerating: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: '输入消息或 / 使用命令...'
			}
		},
		data() {
			return {
				inputMessage: "",
				isMenuVisible: false,
				showSuggestions: true,
				commandSuggestions: [
					{ text: '介绍一下你自己' },
					{ text: '写一篇文章' },
					{ text: '帮我分析这段代码' },
					{ text: '用Python写一个简单的爬虫' },
					{ text: '帮我优化这段文字' },
					{ text: '讲个笑话' },
					{ text: '写一首诗' }
				],
				commands: [
					{ name: 'clear', description: '清空对话历史' },
					{ name: 'regen', description: '重新生成上一条回复' },
					{ name: 'help', description: '显示所有命令' },
					{ name: 'mode', description: '切换AI模式' },
					{ name: 'image', description: '生成图片模式' },
					{ name: 'search', description: '搜索相关信息' },
					{ name: 'new', description: '开始新对话' }
				],
				filteredCommands: [],
				previewItems: [] // 存储待发送的复合消息项
			};
		},
		methods: {
			sendMessage() {
				// 如果没有文本输入且没有预览项，则不发送
				if (!this.inputMessage.trim() && this.previewItems.length === 0) return;
				
				// 处理命令
				if (this.inputMessage.startsWith('/')) {
					const commandText = this.inputMessage.slice(1).split(' ')[0];
					const command = this.commands.find(cmd => cmd.name === commandText);
					
					if (command) {
						this.selectCommand(command);
						return;
					}
				}

				// 构建消息对象数组
				let messages = [];
				
				// 如果有文本输入，添加文本消息
				if (this.inputMessage.trim()) {
					messages.push({
						type: 'text',
						data: {
							text: this.inputMessage
						}
					});
				}
				
				// 添加所有预览项到消息数组
				if (this.previewItems.length > 0) {
					messages = messages.concat(this.previewItems);
				}

				// 发送消息事件
				this.$emit('send', messages);
				
				// 清空输入框和预览区
				this.inputMessage = "";
				this.previewItems = [];
				this.showSuggestions = true;
			},
			
			// 添加图片到预览区
			addImagePreview(imageUrls) {
				if (!imageUrls) return;
				
				if (Array.isArray(imageUrls)) {
					// 多张图片，每张添加为单独的预览项
					imageUrls.forEach(url => {
						this.previewItems.push({
							type: 'image',
							data: {
								file_url: url
							}
						});
					});
				} else {
					// 单张图片
					this.previewItems.push({
						type: 'image',
						data: {
							file_url: imageUrls
						}
					});
				}
			},
			
			// 添加文件到预览区
			addFilePreview(fileUrl) {
				if (!fileUrl) return;
				
				const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
				this.previewItems.push({
					type: 'file',
					data: {
						file_url: fileUrl,
						file_name: fileName
					}
				});
			},
			
			// 添加位置到预览区
			addLocationPreview(location) {
				if (!location) return;
				
				this.previewItems.push({
					type: 'location',
					data: location
				});
			},
			
			// 移除预览项
			removePreviewItem(index) {
				this.previewItems.splice(index, 1);
			},
			
			toggleMenu() {
				this.isMenuVisible = !this.isMenuVisible;
			},
			
			chooseImage() {
				this.uploadImage({}).then(urls => {
					this.addImagePreview(urls);
				}).catch(err => {
					console.error('选择图片失败:', err);
					uni.showToast({
						title: '选择图片失败',
						icon: 'none'
					});
				});
				this.isMenuVisible = false;
			},
			
			uploadImage({ compressed = true }) {
				return new Promise((success, error) => {
					// 根据 compressed 参数决定图片选择时的尺寸类型
					const sizeType = [compressed ? "compressed" : "original"];

					uni.chooseImage({
						count: 9, // 最多可选择 9 张图片
						sizeType,
						success(res) {
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
			
			chooseFile() {
				// 选择文件并上传
				// 注意：某些平台可能不支持此接口，需根据实际情况调整
				// #ifdef APP-PLUS || H5
				uni.chooseFile({
					count: 1,
					success: (res) => {
						if (res.tempFilePaths && res.tempFilePaths.length > 0) {
							this.addFilePreview(res.tempFilePaths[0]);
						}
					},
					fail: (err) => {
						console.error('选择文件失败:', err);
						uni.showToast({
							title: '选择文件失败',
							icon: 'none'
						});
					}
				});
				// #endif
				
				// #ifdef MP
				uni.showToast({
					title: '小程序暂不支持此功能',
					icon: 'none'
				});
				// #endif
				
				this.isMenuVisible = false;
			},
			
			chooseLocation() {
				uni.chooseLocation({
					success: (res) => {
						const location = {
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						};
						this.addLocationPreview(location);
					},
					fail: (err) => {
						console.error('选择位置失败:', err);
						if (err.errMsg !== 'chooseLocation:fail cancel') {
							uni.showToast({
								title: '选择位置失败',
								icon: 'none'
							});
						}
					}
				});
				this.isMenuVisible = false;
			},
			
			handleInput() {
				if (this.inputMessage.startsWith('/')) {
					const query = this.inputMessage.slice(1).toLowerCase();
					this.filteredCommands = this.commands.filter(cmd => 
						cmd.name.toLowerCase().includes(query) || 
						cmd.description.toLowerCase().includes(query)
					);
				} else {
					this.filteredCommands = [];
				}
			},

			regenerateLastResponse() {
				if (this.isGenerating) return;
				this.$emit('regenerate');
			},

			clearChat() {
				uni.showModal({
					title: '清空对话',
					content: '确定要清空当前所有对话吗？',
					success: (res) => {
						if (res.confirm) {
							this.$emit('clear');
						}
					}
				});
			},

			selectCommand(command) {
				this.inputMessage = '/' + command.name;
				
				// 立即执行命令
				switch (command.name) {
					case 'clear':
						this.clearChat();
						this.inputMessage = '';
						break;
					case 'regen':
						this.regenerateLastResponse();
						this.inputMessage = '';
						break;
					case 'help':
						this.$emit('help');
						this.inputMessage = '';
						break;
					case 'new':
						this.$emit('new');
						this.inputMessage = '';
						break;
					case 'mode':
					case 'image':
					case 'search':
						// 保留在输入框，用户可能需要添加参数
						break;
				}
			},

			useCommandSuggestion(suggestion) {
				this.inputMessage = suggestion.text;
				this.sendMessage();
			},
			
			onInputFocus() {
				this.showSuggestions = false;
			},
			
			onInputBlur() {
				if (!this.inputMessage.trim()) {
					this.showSuggestions = true;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.chat-footer {
		padding: 20rpx;
		background-color: #f8f8f8;
		border-top: 1rpx solid #eaeaea;
		position: relative;
	}

	.input-box {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 36rpx;
		padding: 10rpx 20rpx;
		position: relative;
		margin-top: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		input {
			flex: 1;
			height: 70rpx;
			font-size: 30rpx;
			padding-left: 10rpx;
		}

		.action-buttons {
			display: flex;
			align-items: center;

			.more-btn {
				width: 70rpx;
				height: 70rpx;
				background-color: #f0f0f0;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 10rpx;

				text {
					font-size: 40rpx;
					color: #666;
				}
			}

			.send-btn {
				background-color: #2797ff;
				color: #ffffff;
				padding: 12rpx 30rpx;
				border-radius: 36rpx;
				margin-left: 10rpx;

				text {
					font-size: 28rpx;
				}
			}
		}
	}

	/* 底部滑动菜单样式 */
	.menu-container {
		max-height: 0;
		overflow: hidden;
		background-color: #ffffff;
		border-top: 1px solid #f0f0f0;
		margin-top: 16rpx;
		border-radius: 20rpx 20rpx 0 0;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
		transition: max-height 0.3s ease-in-out;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 100%; /* 定位到输入框下方 */
		z-index: 100;
		
		&.menu-visible {
			max-height: 420rpx; /* 展开时的最大高度 */
		}
		
		.menu-header {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			padding: 20rpx 0;
			
			.menu-handle {
				width: 80rpx;
				height: 8rpx;
				background-color: #e0e0e0;
				border-radius: 4rpx;
			}
			
			.menu-close {
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				
				text {
					color: #999;
					font-size: 24rpx;
				}
			}
		}
		
		.menu-scroll-view {
			white-space: nowrap;
			overflow-x: auto;
			padding: 20rpx 0 40rpx;
			
			.menu-content {
				display: inline-flex;
				padding: 0 20rpx;
				min-width: 100%;
				
				.menu-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					min-width: 160rpx;
					margin-right: 20rpx;
					
					.menu-icon {
						width: 100rpx;
						height: 100rpx;
						background-color: #f5f5f5;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: 16rpx;
					}
					
					.menu-text {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
		}
	}

	.command-suggestions {
		width: 100%;
		background-color: transparent;
		padding: 10rpx 0;
		animation: fadeIn 0.3s ease;
		
		.suggestions-scroll {
			white-space: nowrap;
			overflow-x: auto;
			
			.suggestion-item {
				display: inline-block;
				padding: 12rpx 24rpx;
				margin-right: 16rpx;
				border: 1px solid #e6e6e6;
				border-radius: 36rpx;
				background-color: #ffffff;
				transition: all 0.2s ease;
				
				&:active {
					background-color: #f0f0f0;
				}
				
				text {
					font-size: 26rpx;
					color: #333;
				}
			}
		}
	}
	
	/* 复合消息预览区域样式 */
	.message-preview {
		width: 100%;
		background-color: transparent;
		padding: 16rpx 0;
		margin-top: 10rpx;
		
		.preview-scroll {
			display: flex;
			align-items: center;
			overflow-x: auto;
			
			.preview-item {
                width: fit-content;
				position: relative;
				margin-right: 16rpx;
				flex-shrink: 0;
				
				.preview-delete {
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					width: 36rpx;
					height: 36rpx;
					background-color: rgba(0, 0, 0, 0.5);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 10;
					
					text {
						color: #fff;
						font-size: 24rpx;
						font-weight: bold;
					}
				}
				
				.preview-content {
					width: 160rpx;
					height: 120rpx;
					border-radius: 10rpx;
					overflow: hidden;
					box-sizing: border-box;
				}
				
				.preview-image {
					image {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
				
				.preview-file {
					background-color: #f5f5f5;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 10rpx;
					
					.file-name {
						font-size: 20rpx;
						color: #666;
						margin-top: 10rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 140rpx;
					}
				}
				
				.preview-location {
					background-color: #f5f5f5;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-start;
					padding: 10rpx;
					
					.location-icon {
						flex-shrink: 0;
						margin-right: 8rpx;
					}
					
					.location-info {
						flex: 1;
						overflow: hidden;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;
					}
					
					.location-name {
						font-size: 20rpx;
						color: #333;
						font-weight: bold;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 100%;
					}
					
					.location-address {
						font-size: 16rpx;
						color: #999;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 100%;
						margin-top: 4rpx;
					}
				}
			}
		}
	}

	.command-prompt {
		position: absolute;
		top: -220rpx;
		left: 20rpx;
		right: 20rpx;
		background-color: #fff;
		border: 1px solid #e0e0e0;
		border-radius: 16rpx;
		padding: 10rpx;
		z-index: 1000;
		max-height: 200rpx;
		overflow-y: auto;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		
		.command-item {
			display: flex;
			flex-direction: column;
			padding: 16rpx;
			border-bottom: 1px solid #f0f0f0;
			transition: all 0.2s ease;
			
			&:active {
				background-color: #f5f5f5;
			}
			
			&:last-child {
				border-bottom: none;
			}
			
			.command-name {
				font-size: 28rpx;
				font-weight: bold;
				color: #2797ff;
			}
			
			.command-desc {
				font-size: 24rpx;
				color: #666;
				margin-top: 4rpx;
			}
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style> 