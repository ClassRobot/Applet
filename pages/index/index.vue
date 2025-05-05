<template>
	<view class="page chat-page">
		<navbar title="言夕Ai" />

		<!-- 通知栏 -->
		<!-- <NotificationBar>
			<view> 参加家校群调研，大礼等你来拿参加家校群调研，大礼等你来拿 </view>
		</NotificationBar> -->
		
		<!-- 聊天消息列表区域 -->
		<scroll-view 
			scroll-y 
			class="chat-container" 
			:scroll-top="scrollTop" 
			@scrolltoupper="loadMore"
			scroll-anchoring
			:scroll-into-view="scrollIntoViewId"
		>
			<messageList :messageList="messageList" />
			<view id="message-bottom" style="height: 2rpx;"></view>
		</scroll-view>

		<!-- 底部输入区域 -->
		<chatInputBox 
			:canRegenerate="canRegenerate" 
			:isGenerating="isGenerating"
			@send="handleSendMessage"
			@regenerate="regenerateLastResponse"
			@clear="clearChat"
			@help="showHelp"
			@new="startNewConversation"
		/>

		<loginPopup ref="loginPopup" @login="" />

		<PrivacyAgreementPoup />
	</view>
</template>

<script>
	import NotificationBar from "@/components/notification/NotificationBar.vue";
	import loginPopup from "@/components/config/loginPopup.vue";
	import messageList from '@/components/message/messageList.vue';
	import chatInputBox from '@/components/message/chatInputBox.vue';
	
	export default {
		components: {
			NotificationBar,
			loginPopup,
			messageList,
			chatInputBox
		},

		data() {
			return {
				messageList: [],
				scrollTop: 0,
				scrollIntoViewId: '',
				queryParams: {
					pageNum: 1,
					pageSize: 100,
				},
				total: 0,
				canRegenerate: false,
				isGenerating: false,
			};
		},
		
		beforeDestroy() {
			uni.$off('sendMessage:detailType:private', this.handledrMessage)
		},
		
		onLoad() {
			this.queryParams.pageNum = 1
			
			if (uni.getStorageSync("token")) {
				this.$store.commit("initSocket");
				this.$store.commit('getUserInfo', () => {
					this.getMessageList()
				})
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

			// 处理发送消息
			handleSendMessage(messages) {
				if (!messages || messages.length === 0) return;
				
				// 创建用户消息并直接添加到列表
				const userMessage = {
					id: Date.now(),
					isSelf: true,
					data: JSON.parse(JSON.stringify(messages))
				};
				
				
				
				// 启用重新生成
				this.canRegenerate = true;
				this.isGenerating = true;

				// 发送到API
				this.$api('sendPrivateMessage', {
					messages
				}).then(response => {
					this.isGenerating = false;
				}).catch(error => {
					this.isGenerating = false;
				});
			},

			// 滚动到底部
			scrollToBottom() {
				// 方法1：使用scrollTop
				this.scrollTop = this.scrollTop === 999999999 ? 100000000 : 999999999;
				
				// 方法2：使用scroll-into-view
				this.scrollIntoViewId = 'message-bottom';
				
				// 确保在下一帧再次尝试滚动
				setTimeout(() => {
					this.scrollTop = this.scrollTop === 999999999 ? 100000000 : 999999999;
				}, 50);
			},

			// 加载更多历史消息
			loadMore() {
				console.log("加载更多历史消息");
				
				if(this.queryParams.pageNum * this.queryParams.pageSize > this.total){
					return
				}
				
				this.queryParams.pageNum++
				
				this.getMessageList()
			},
			
			getMessageList(){
				this.$api('getMessage', this.queryParams)
				.then(res => {
					if(res.code == 200){
						
						res.rows.forEach(messgae => {
							messgae.data = JSON.parse(messgae.data)
							messgae.isSelf = messgae.userId == this.userInfo.userId
							this.messageList.unshift(messgae)
						})
						
						this.total = res.total
                        
                        // 滚动到底部
                        this.$nextTick(() => {
                            // 等待 DOM 更新完成后执行滚动操作
                            this.scrollToBottom();
                        });
					}
				})
			},

			// 页面加载完成后滚动到底部
			onReady() {
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			},

			regenerateLastResponse() {
				if (this.isGenerating) return;
				
				this.isGenerating = true;
				
				// 找到最后一条AI回复
				const lastAiMessageIndex = [...this.messageList].reverse()
					.findIndex(msg => !msg.isSelf);
				
				if (lastAiMessageIndex !== -1) {
					const actualIndex = this.messageList.length - 1 - lastAiMessageIndex;
					// 标记为"重新生成中..."
					const originalMessage = JSON.parse(JSON.stringify(this.messageList[actualIndex]));
					
					// 设置重新生成中的状态
					this.$set(this.messageList[actualIndex].data[0].data, 'text', '重新生成中...');
					
					// 调用API重新生成
					// 这里假设使用相同的发送API
					const userMessageIndex = actualIndex - 1;
					if (userMessageIndex >= 0 && this.messageList[userMessageIndex].isSelf) {
						const userMessages = this.messageList[userMessageIndex].data;
						
						this.$api('sendPrivateMessage', {
							messages: userMessages,
							regen: true
						}).then(response => {
							// 更新AI响应
							if (!response || response.code !== 200) {
								this.$set(this.messageList[actualIndex].data[0].data, 'text', '抱歉，重新生成失败，请稍后再试。');
							} else {
								if (response.data && response.data.text) {
									this.$set(this.messageList[actualIndex].data[0].data, 'text', response.data.text);
								} else {
									this.$set(this.messageList[actualIndex].data[0].data, 'text', originalMessage.data[0].data.text);
								}
							}
							this.isGenerating = false;
						}).catch(error => {
							this.$set(this.messageList[actualIndex].data[0].data, 'text', '抱歉，重新生成时发生错误，请稍后再试。');
							this.isGenerating = false;
						});
					} else {
						setTimeout(() => {
							this.$set(this.messageList[actualIndex].data[0].data, 'text', originalMessage.data[0].data.text + ' (重新生成)');
							this.isGenerating = false;
						}, 1500);
					}
				} else {
					this.isGenerating = false;
				}
			},

			clearChat() {
				this.messageList = [];
				this.canRegenerate = false;
				// 可以在这里调用API清空服务器端对话历史
				this.$api('clearConversation').then(res => {
					uni.showToast({
						title: '对话已清空',
						icon: 'success'
					});
				}).catch(err => {
					console.error('清空对话失败:', err);
				});
			},

			showHelp() {
				// 创建一个帮助消息
				const helpMessage = {
					id: Date.now(),
					isSelf: false,
					data: [{
						type: 'text',
						data: {
							text: `**可用命令列表**\n\n` + 
								`- **/clear**: 清空对话历史\n` +
								`- **/regen**: 重新生成上一条回复\n` +
								`- **/help**: 显示所有命令\n` +
								`- **/mode**: 切换AI模式\n` +
								`- **/image**: 生成图片模式\n` +
								`- **/search**: 搜索相关信息\n` +
								`- **/new**: 开始新对话`
						}
					}]
				};
				
				this.messageList.push(helpMessage);
				
				// 滚动到底部
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			},

			startNewConversation() {
				uni.showModal({
					title: '新对话',
					content: '开始新对话将清空当前会话，是否继续？',
					success: res => {
						if (res.confirm) {
							this.clearChat();
							// 可以在这里添加其他新对话初始化逻辑
							uni.showToast({
								title: '已开始新对话',
								icon: 'success'
							});
						}
					}
				});
			}
		},
	};
</script>

<style scoped lang="scss">
	.chat-page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f9f9f9;
		position: relative;
	}

	.chat-container {
		flex: 1;
		padding: 20rpx;
		overflow: hidden;
		box-sizing: border-box;
	}
</style>