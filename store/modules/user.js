import api from '@/api/api.js'
import Vue from 'vue'

export default {
	state: {
		userInfo: {},
	},
	mutations: {
        login(state, fn){
            console.log('登录中...')
            if(this._loginPromise) {
                return this._loginPromise;
            }
            
            this._loginPromise = new Promise((resolve, reject) => {
                uni.login({
                    success : (res) => {
                        if (res.errMsg != "login:ok") {
                            reject();
                            return;
                        }
                
                        let data = {
                            xcxCode: res.code,
                            appid : Vue.prototype.$config.appid,
                            clientId : Vue.prototype.$config.clientid,
                            grantType : 'xcx',
                        }
                        
                        if (uni.getStorageSync('shareId')) {
                            data.shareId = uni.getStorageSync('shareId')
                        }
                
                        api('wxLogin', data)
                        .then(res => {
                            uni.hideLoading()
                
                            if (res.code != 200) {
                                reject();
                                return;
                            }
                            
                            this.commit('setUserInfo', res.data.userInfo)
                
                            uni.setStorageSync('token', res.data.access_token)
    
                            fn && fn(state)
                            
                            uni.$emit('login:success')
    
                            this.commit("initSocket");
                            
                            resolve();
                        })
                        .catch(err => {
                            reject();
                        })
                    }
                })
            });
            
            return this._loginPromise.catch(err => {
                console.log('登录失败', err)
                this._loginPromise = null
            });
        },
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