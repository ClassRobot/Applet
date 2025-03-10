
import Vue from 'vue'
import utils from '../utils/utils.js'
import store from '../store/store.js'

function http(uri, data, callback, method = 'GET', showLoading, title) {
	
	if(showLoading){
		uni.showLoading({
		    title: title || '加载中...'
		});
	}
	
	let reject, resolve;
	
	let promise = new Promise((res, rej) => {
		reject = rej
		resolve = res
	})
	
	uni.request({
		url: Vue.prototype.$config.baseUrl + uri,
		data,
		method: method,
		header: {
			'X-Access-Token': uni.getStorageSync('token'),
			'Content-Type' : 'application/x-www-form-urlencoded'
		},
		success: (res) => {
			// console.log(res,'res')
			if(showLoading){
				uni.hideLoading();
			}
			
			if(res.statusCode == 401 || 
			res.data.message == '操作失败，token非法无效!' || 
			res.data.message == '操作失败，用户不存在!'){
				store.commit('logout')
				console.error('登录过期');
				utils.toLogin()
			}
			
			if(res.statusCode == 200 && res.data.code != 200
			&& res.data.code != 902){
				uni.showToast({
					mask: true,
					duration: 1000,
					title: res.data.message,
					icon:'none'
				});
			}
			
			callback && callback(res.data)
			resolve(res.data)
		},
		
		fail: () => {
			reject('api fail')
			uni.showLoading({})
			setTimeout(()=>{
				uni.hideLoading()
				uni.showToast({icon:"none", title:"网络异常"})
			}, 3000)
			
			if(showLoading){
				uni.hideLoading();
			}
		}
	});
	
	return promise
}


export default {
	http: http,
}