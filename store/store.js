import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex); //vue的插件机制

import api from '@/api/api.js'

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: {
		configList: {}, //配置列表
		userInfo : {}, //用户信息
	},
	getters: {
	},
	mutations: {
		// 初始化配置
		initConfig(state){
			// api('getConfig', res => {
			// 	if(res.code == 200){
			// 		state.configList = res.result
			
				// res.result.forEach(n => {
				// 	state.configList[n.keyName] = n.keyContent
				// })
			// 	}
			// })
			
			let config = ['getPrivacyPolicy', 'getUserAgreement']
			config.forEach(k => {
				api(k, res => {
					if (res.code == 200) {
						state.configList[k] = res.result
					}
				})
			})
		},
		login(state){
			uni.showLoading({
				title: '登录中...'
			})
			uni.login({
				success(res) {
					if(res.errMsg != "login:ok"){
						return
					}
					
					api('wxLogin', {
						code : res.code
					}, res => {
						
						uni.hideLoading()
						
						if(res.code != 200){
							return
						}
						
						state.userInfo = res.result.userInfo
						uni.setStorageSync('token', res.result.token)
						
						if(!state.userInfo.nickName || !state.userInfo.headImage){
							uni.navigateTo({
								url: '/pages_order/auth/wxUserInfo'
							})
						}else{
							uni.navigateBack(-1)
						}
					})
				}
			})
		},
		getUserInfo(state){
			api('getInfo', res => {
				if(res.code == 200){
					state.userInfo = res.result
				}
			})
		},
		// 退出登录
		logout(state){
			uni.showModal({
				title: '确认退出登录吗',
				success(r) {
					if(r.confirm){
						state.userInfo = {}
						state.role = false
						uni.removeStorageSync('token')
						uni.reLaunch({
							url: '/pages/index/index'
						})
					}
				}
			})
		},
	},
	actions: {},
})

export default store