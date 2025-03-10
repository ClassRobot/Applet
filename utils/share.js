import api from '@/api/api.js'
import config from "../config.js"
import jWeixin from './lib/jweixin-module.js'

function share() { //微信分享
	//获取签名
	let data = {
		url: import.meta.env.VITE_REDIRECT_URI + '/#/'
	}
	api('getVipShareSign', data, res => {
		if (res.code == 200) {
			let {
				appId,
				nonceStr,
				signature,
				timestamp
			} = res.result
			jWeixin.config({
				debug: false,
				appId: appId,
				nonceStr: nonceStr,
				signature: signature,
				timestamp: timestamp,
				jsApiList: [
					'updateTimelineShareData',
					'updateAppMessageShareData',
					'onMenuShareWeibo',
					'getLocation'
				]
			});

			jWeixin.ready(function() {
				// 微信分享的数据
				var shareData = {
					"link": addQueryParams(data.url),
					"desc": "泰柔到家",
					"title": "泰柔到家，温柔呵护每一刻！",
					imgUrl : import.meta.env.VITE_REDIRECT_URI + '/static/share/logo.png',
					success: function() {
						//分享成功可以做相应的数据处理
						// uni.showToast({
						// 	mask: true,
						// 	duration: 1000,
						// 	title: '注册分享成功',
						// });
					}
				};
				//分享微信朋友圈内容设置
				jWeixin.updateTimelineShareData(shareData);
				//分享给朋友内容设置
				jWeixin.updateAppMessageShareData(shareData);
				//分享到微博内容设置
				jWeixin.onMenuShareWeibo(shareData);
			});
			
			jWeixin.error(function(err){
				console.error(err);
			  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			})
		}
	})
}

function addQueryParams(url) {
	if (url) {
		//获取用户id
		let userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
		if(userInfo){
			url += `?vid=${userInfo.id}`
		}
	}
	return url
}

export default share