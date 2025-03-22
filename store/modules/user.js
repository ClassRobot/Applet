import api from '@/api/api.js'

export default {
	state: {
		userInfo: {},
	},
	mutations: {
		setUser(state, user) {
			state.userInfo = user
		},
		getUserInfo(state) {
			api('getUserInfo').then(res => {
				if(res.code == 200) {
					state.userInfo = res.data
				}
			})
		}
	},
	getters: {
		getUserInfo: state => state.userInfo
	}
}