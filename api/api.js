import http from './http.js'
import utils from '../utils/utils.js'


let limit = {}
let debounce = {}

const models = ['login', 'index', 'vip', 'info']

const config = {
}


export function api(key, data, callback, loadingTitle) {
	let req = config[key]

	if (!req) {
		console.error('无效key' + key);
		return Promise.reject()
	}

	if (typeof callback == 'string') {
		loadingTitle = callback
	}

	if (typeof data == 'function') {
		callback = data
		data = {}
	}

	// 接口限流
	if (req.limit) {
		let storageKey = req.url
		let storage = limit[storageKey]
		if (storage && new Date().getTime() - storage < req.limit) {
			return Promise.reject()
		}
		limit[storageKey] = new Date().getTime()
	}

	//必须登录
	if (req.auth) {
		if (!uni.getStorageSync('token')) {
			utils.toLogin()
			console.error('需要登录', req.url)
			return Promise.reject()
		}
	}
	
	// 接口防抖
	if(req.debounce){
		
		let storageKey = req.url
		let storage = debounce[storageKey]
		
		if (storage) {
			clearTimeout(storage)
		}
		
		debounce[storageKey] = setTimeout(() => {
			
			clearTimeout(storage)
			
			delete debounce[storageKey]
			
			http.http(req.url, data, callback, req.method,
				loadingTitle || req.showLoading, loadingTitle || req.loadingTitle)
		}, req.debounce)
		
		return Promise.reject()
	}

	return http.http(req.url, data, callback, req.method,
		loadingTitle || req.showLoading, loadingTitle || req.loadingTitle)
}


function addApiModel(model, key){
	for(let k in model){
		if(config[`${k}`]){
			console.error(`重名api------model=${key},key=${k}`);
			uni.showModal({
				title: `重名api`,
				content: `model=${key},key=${k}`
			})
			continue
		}
		config[`${k}`] = model[k]
		// config[`${key}_${k}`] = model[k]
	}
}

models.forEach(key => {
	addApiModel(require(`./model/${key}.js`).default, key)
})


export default api