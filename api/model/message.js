// 信息相关接口

const api = {
	// 发送私聊信息
	sendPrivateMessage: {
		url: "/api/ai/chat/sendPrivateMessage",
		method: "POST",
		limit: 500,
		showLoading: true,
		encrypt: true,
	},
};

export default api;