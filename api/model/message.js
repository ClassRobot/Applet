// 信息相关接口

const api = {
	// 发送私聊信息
	sendPrivateMessage: {
		url: "/api/ai/chat/sendPrivateMessage",
		method: "POST",
		limit: 500,
		showLoading: true,
	},
	// 查询聊天记录
	getMessage: {
		url: "/api/ai/chat/getMessage",
		method: "GET",
	},
};

export default api;