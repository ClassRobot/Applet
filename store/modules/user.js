import api from '@/api/api.js'

export default {
	state: {
		userInfo: {},
	},
	mutations: {
		setUser(state, user) {
			state.userInfo = user
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
		getUserInfo(state, fn) {
			api('getUserInfo').then(res => {
				if(res.code == 200) {
					state.userInfo = res.data
					fn && fn(state)
				}
			})
		},
		logout(state, flag){
			state.userInfo = {}
			uni.removeStorageSync('token')
			uni.$emit('logout')
		},
	},
	getters: {
		userInfo: state => state.userInfo
	}
}