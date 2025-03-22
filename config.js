
import Vue from 'vue'
import api from '@/api/api.js'
import utils from './utils/utils.js'

import uvUI from '@/uni_modules/uv-ui-tools'
Vue.use(uvUI);

// 当前环境
const type = 'dev'


// 环境配置
const config = {
	dev : {
		baseUrl : 'http://127.0.0.1:8080',
		socketUrl : 'ws://127.0.0.1:8080/onebot',
	},
	prod : {
		baseUrl : 'http://xxx.xxx.xxx/xxx',
		socketUrl : 'http://127.0.0.1:8080',
	}
}


// 默认配置
const defaultConfig = {
	mapKey : '',
	clientid : 'd2595ef506e20b1f727ded83b46a41c5',
	appid : 'wxe7ae8cbe1673834c',
	aliOss: {
		url: '',
		config: {
			//桶的地址
			region: '',
			//id
			accessKeyId: '',
			//密钥
			accessKeySecret: '',
			//桶的名字
			bucket: '',
			endpoint: '',
		}
	},
}


uni.$uv.setConfig({
	// 修改$uv.config对象的属性
	config: {
		// 修改默认单位为rpx，相当于执行 uni.$uv.config.unit = 'rpx'
		unit: 'rpx'
	},
})

Vue.prototype.$config = utils.deepMergeObject(defaultConfig, config[type])

Vue.prototype.$api = api

export default Vue.prototype.$config