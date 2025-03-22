
import Vue from 'vue'
import utils from '../utils/utils.js'
import crypto from '../utils/encrypt/crypto'
import jsencrypt from '../utils/encrypt/jsencrypt.js'

const encryptHeader = 'encrypt-key';


function http(uri, data, callback, method = 'GET', showLoading, title, req) {
	
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
	
	let header = {
		'X-Access-Token': uni.getStorageSync('token'),
		'Content-Type' : 'application/json',
		clientid : Vue.prototype.$config.clientid,
	}
	
	if(req.encrypt){
		const aesKey = crypto.generateAesKey();
		header[encryptHeader] = jsencrypt.encrypt(crypto.encryptBase64(aesKey));
		data = typeof data === 'object' ? 
		crypto.encryptWithAes(JSON.stringify(data), aesKey) 
		: crypto.encryptWithAes(data, aesKey);
	}
	
	uni.request({
		url: Vue.prototype.$config.baseUrl + uri,
		data,
		method,
		header,
		success: (res) => {
			
			if(showLoading){
				uni.hideLoading();
			}
			
			if(res.statusCode == 401){
				uni.removeStorageSync('token')
				console.error('登录过期');
				utils.toLogin()
			}
			
			if(res.statusCode == 200 && res.data.code != 200){
				uni.showToast({
					mask: true,
					duration: 1000,
					title: res.data.msg,
					icon:'none'
				});
			}
			
			callback && callback(res.data)
			resolve(res.data)
		},
		
		fail: err => {
			reject()
			uni.showLoading({})
			
			console.log(err);
			
			uni.showToast({icon:"none", title:"网络异常"})
			
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