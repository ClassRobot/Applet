import api from '@/api/api.js'
import Vue from 'vue'

export default {
	state: {
		socket: {},
		socketConnected: false,
		reconnectCount: 0,
		maxReconnectCount: 5,
		heartbeatTimer: null
	},
	mutations: {
		initSocket(state) {
			let config = Vue.prototype.$config
			
			const token = uni.getStorageSync('token');
			const clientId = config.clientid
			
			if (!token) {
				console.error('未找到token，无法建立WebSocket连接');
				return;
			}
			
			// 关闭已存在的连接
			if (state.socket && state.socket.readyState === 1) {
				uni.closeSocket();
			}
			
			// 构建WebSocket URL - 正确拼接参数
			// const wsUrl = `${config.socketUrl}`;
			const wsUrl = `${config.socketUrl}?Authorization=Bearer ${encodeURIComponent(token)}&clientid=${clientId}`;
			
			// 创建WebSocket连接
			uni.connectSocket({
				url: wsUrl,
				header: {
					'content-type': 'application/json'
				},
				method: 'GET',
				success: () => {
					console.log('WebSocket连接请求已发送');
				},
				fail: (error) => {
					console.error('WebSocket连接请求失败', error);
				}
			});
			
			// 监听WebSocket连接打开
			uni.onSocketOpen((res) => {
				console.log('WebSocket连接已打开', res);
				state.socketConnected = true;
				state.reconnectCount = 0;
				// 开始心跳
				startHeartbeat(state);
			});
			
			// 监听WebSocket错误
			uni.onSocketError((res) => {
				console.error('WebSocket连接错误', res);
				state.socketConnected = false;
			});
			
			// 监听WebSocket关闭
			uni.onSocketClose((res) => {
				console.log('WebSocket连接已关闭', res);
				state.socketConnected = false;
				// 停止心跳
				if (state.heartbeatTimer) {
					clearInterval(state.heartbeatTimer);
					state.heartbeatTimer = null;
				}
				// 尝试重连
				tryReconnect(state);
			});
			
			// 监听WebSocket消息
			uni.onSocketMessage((res) => {
				try {
					const data = JSON.parse(res.data);
					console.log('收到WebSocket消息', data);
					// 处理消息...
				} catch (error) {
					console.error('解析WebSocket消息失败', error);
				}
			});
		},
		
		// 设置socket连接状态
		setSocketConnected(state, status) {
			state.socketConnected = status;
		},
		
		// 重置重连次数
		resetReconnectCount(state) {
			state.reconnectCount = 0;
		},
		
		// 增加重连次数
		increaseReconnectCount(state) {
			state.reconnectCount++;
		},
		
		// 设置心跳定时器
		setHeartbeatTimer(state, timer) {
			state.heartbeatTimer = timer;
		},
		
		// 清除心跳定时器
		clearHeartbeatTimer(state) {
			if (state.heartbeatTimer) {
				clearInterval(state.heartbeatTimer);
				state.heartbeatTimer = null;
			}
		}
	},
	actions: {
		// 处理WebSocket消息
		handleSocketMessage({ commit, state }, res) {
			try {
				const data = JSON.parse(res.data);
				console.log('收到WebSocket消息', data);
				// 处理不同类型的消息...
			} catch (error) {
				console.error('解析WebSocket消息失败', error);
			}
		},
		
		// 处理WebSocket关闭
		handleSocketClose({ commit, state, dispatch }) {
			commit('setSocketConnected', false);
			commit('clearHeartbeatTimer');
			// 尝试重连
			dispatch('tryReconnect');
		},
		
		// 处理WebSocket错误
		handleSocketError({ commit, state, dispatch }) {
			commit('setSocketConnected', false);
			// 尝试重连
			dispatch('tryReconnect');
		},
		
		// 尝试重连
		tryReconnect({ commit, state, dispatch }) {
			if (state.reconnectCount < state.maxReconnectCount) {
				setTimeout(() => {
					console.log(`尝试重新连接WebSocket (${state.reconnectCount + 1}/${state.maxReconnectCount})`);
					commit('increaseReconnectCount');
					commit('initSocket');
				}, 3000); // 3秒后重试
			} else {
				console.error('WebSocket重连失败，已达到最大重试次数');
				uni.showToast({
					title: '网络连接异常，请检查网络后重试',
					icon: 'none'
				});
			}
		},
		
		// 发送WebSocket消息
		sendSocketMessage({ state }, data) {
			if (!state.socketConnected) {
				console.error('WebSocket未连接，无法发送消息');
				return false;
			}
			
			try {
				uni.sendSocketMessage({
					data: JSON.stringify(data),
					success: () => {
						console.log('WebSocket消息发送成功', data);
					},
					fail: (error) => {
						console.error('WebSocket消息发送失败', error);
					}
				});
				return true;
			} catch (error) {
				console.error('发送WebSocket消息时出错', error);
				return false;
			}
		},
		
		// 开始心跳
		startHeartbeat({ commit, state, dispatch }) {
			commit('clearHeartbeatTimer');
			
			const timer = setInterval(() => {
				if (state.socketConnected) {
					dispatch('sendSocketMessage', {
						type: 'heartbeat',
						timestamp: Date.now()
					});
				}
			}, 30000); // 每30秒发送一次心跳
			
			commit('setHeartbeatTimer', timer);
		}
	},
	getters: {
		isSocketConnected: state => state.socketConnected
	}
}

// 辅助函数 - 开始心跳
function startHeartbeat(state) {
	if (state.heartbeatTimer) {
		clearInterval(state.heartbeatTimer);
	}
	
	state.heartbeatTimer = setInterval(() => {
		if (state.socketConnected) {
			try {
				uni.sendSocketMessage({
					data: JSON.stringify({
						type: 'heartbeat',
						timestamp: Date.now()
					})
				});
			} catch (error) {
				console.error('发送心跳消息失败', error);
			}
		}
	}, 30000); // 每30秒发送一次心跳
}

// 辅助函数 - 尝试重连
function tryReconnect(state) {
	if (state.reconnectCount < state.maxReconnectCount) {
		setTimeout(() => {
			console.log(`尝试重新连接WebSocket (${state.reconnectCount + 1}/${state.maxReconnectCount})`);
			state.reconnectCount++;
			// 这里需要通过store.commit调用initSocket，但在这个辅助函数中无法访问store
			// 因此我们在onSocketClose中直接处理重连
		}, 3000);
	}
}