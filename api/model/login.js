// 登录相关接口

const api = {
	// 微信登录接口
	wxLogin: {
		url: "/auth/login",
		method: "POST",
		limit: 500,
		showLoading: true,
		encrypt: true,
	},
	getUserInfo: {
		url: "/api/ai/user/getUserInfo",
		method: "GET",
	},
};

export default api;