
// #ifdef H5
import jWeixin from './lib/jweixin-module.js'
// #endif

/**
 * 调用微信支付
 * @param {Object} res - 支付参数对象，包含appId、timeStamp、nonceStr等必要信息
 * @param {Function} successCallback - 支付成功的回调函数
 * @param {Function} failCallback - 支付失败的回调函数
 * @param {Function} optionCallback - 配置失败的回调函数
 */
export function wxPay(res, successCallback, failCallback, optionCallback) {
	// 配置微信JSSDK
	jWeixin.config({
		debug: false,
		appId: res.result.appId, //必填，公众号的唯一标识
		jsApiList: ['chooseWXPay'] //必填，需要使用的JS接口列表
	});

	// JSSDK配置成功后的回调
	jWeixin.ready(function() {
		// 调用微信支付接口
		jWeixin.chooseWXPay({
			appId: res.result.appId,
			timestamp: res.result.timeStamp, // 支付签名时间戳
			nonceStr: res.result.nonceStr, // 支付签名随机串
			package: res.result.packageValue, // 统一支付接口返回的prepay_id参数值
			signType: res.result.signType, // 签名类型，默认为MD5
			paySign: res.result.paySign, // 支付签名
			success: function() {
				successCallback && successCallback();
			},
			fail: function(error) {
				failCallback && failCallback();
			},
			cancel : function(){
				failCallback && failCallback();
			}
		});
	});

	// JSSDK配置失败处理
	jWeixin.error(function(res) {
		optionCallback && optionCallback()
	});
}
