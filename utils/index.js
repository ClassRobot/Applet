
import Vue from 'vue'

import util from './utils.js'
import time from './timeUtils.js'
import authorize from './authorize.js'


import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import md5 from './lib/md5.js'


// #ifdef H5
import jWeixin from './lib/jweixin-module.js'
import { wxPay }  from './pay.js'
Vue.prototype.$jWeixin = jWeixin
Vue.prototype.$wxPay = wxPay
// #endif

dayjs.locale('zh-cn')

import Oss from '@/utils/oss-upload/oss/index.js'
import { handleTree } from './tree.js'

Vue.prototype.$handleTree = handleTree
Vue.prototype.$Oss = Oss
Vue.prototype.$dayjs = dayjs
Vue.prototype.$authorize = authorize

Vue.prototype.$timeUtils = time
Vue.prototype.$utils = util
Vue.prototype.$md5 = md5


Vue.prototype.previewImage = (urls, current) => {
	uni.previewImage({
		urls,
		current,
	})
}
Vue.prototype.openLocation = (latitude, longitude) => {
	if(!latitude || !longitude){
		return
	}
	uni.openLocation({
		latitude : Number(latitude),
		longitude : Number(longitude),
	})
}


// 封装微信支付
uni.requestPaymentWxPay = function(res){
	return new Promise((success, error) => {
		uni.requestPayment({
			provider: 'wxpay', // 服务提提供商
			timeStamp: res.result.timeStamp, // 时间戳
			nonceStr: res.result.nonceStr, // 随机字符串
			package: res.result.packageValue,
			signType: res.result.signType, // 签名算法
			paySign: res.result.paySign, // 签名
			success: function (res) {
				console.log('支付成功',res);
				success(res)
			},
			fail: function (err) {
				console.log('支付失败',err);
				error(err)
				uni.showToast({
					icon:'none',
					title:"支付失败"
				})
			}
		});
	})
}