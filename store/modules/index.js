import api from '@/api/api.js'

export default {
	state: {
		userMessage: [
			{
				id: '1',
				username: '微信支付',
				newNum: 199,
				time: new Date(),
				message: '微信到账五百万元',
				svg: '<svg t="1697702756205" class="userMessageImage" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7434" width="200" height="200"><path d="M853.333333 42.666667H170.666667a128 128 0 0 0-128 128v682.666666a128 128 0 0 0 128 128h682.666666a128 128 0 0 0 128-128V170.666667a128 128 0 0 0-128-128z m-341.333333 719.701333a366.08 366.08 0 0 1-100.224-13.866667c-9.301333 1.706667-18.432 4.437333-27.136 8.106667l-61.525333 38.613333c-18.218667 12.202667-24.106667 7.594667-17.749334-13.781333l13.653334-48.213333a77.056 77.056 0 0 0-2.474667-28.373334c-74.24-49.493333-122.026667-126.464-122.026667-212.608 0-148.778667 142.634667-270.122667 317.482667-270.122666 106.666667 0 201.344 45.141333 258.986667 114.133333l-295.978667 140.544c-20.394667 12.288-40.789333 14.848-61.184-3.84l-47.189333-42.453333c-21.546667-6.4-29.184 0.426667-22.954667 20.565333l50.986667 124.757333c11.477333 18.730667 28.373333 25.002667 57.386666 3.84l343.296-209.066666c21.802667 36.608 34.133333 77.909333 34.133334 121.6 0 148.821333-142.634667 270.165333-317.482667 270.165333z" fill="#59B64C" p-id="7435"></path></svg>',
				pinned: 0,
			},
			{
				id: '2',
				headImage: 'http://www.gcosc.fun/public/wx/static/icon.png',
				username: '微信团队',
				newNum: 1,
				time: new Date(),
				message: '登录操作通知',
				pinned: 0,
			},
			{
				id: '3',
				headImage: '/static/image/1231203.jpg',
				username: 'kitten',
				newNum: 1,
				time: new Date(),
				message: '你好',
				pinned: 1,
			},
		]
	},
	mutations: {
		setUserMessage(state, messages) {
			state.userMessage = messages
		}
	},
	getters: {
		index_getUserMessage(state) {
			return state.userMessage.sort((a, b) => b.pinned - a.pinned)
		}
	}
}