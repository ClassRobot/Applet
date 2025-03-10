// 此方法适用于web
// import OSS from "ali-oss"
import config from '@/config.js'

/**
 * 生成一个随机的Key
 */
function storeKey() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

/**
 * 根据当天日期在OSS端生成文件夹
 */
function storeFolder() {
  const date = new Date();
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(formatNumber).join('-')
}


export function uploadFileToOSS(file) {
	
	uni.showLoading({
	    title: '上传中...'
	});
	
	return new Promise((resolve,reject) => {
		// 创建OSS实例
		const client = new OSS(config.aliOss.config);
		
		// 设置文件名和文件目录
		const suffix = '.' + file.name.split('.').pop();
		let key = storeFolder()
		if(key[key.length - 1] != '/') key += '/'
		const fileName = key + storeKey() + suffix; // 注意：文件名需要是唯一的  
		
		// 使用put接口上传文件  
		client.multipartUpload(fileName, file, {
			headers: {
			  'Content-Disposition': 'inline',
			  'Content-Type': file.type
			}
		}).then(res => {
			uni.hideLoading();
			resolve(config.aliOss.url + res.name);
		}).catch(err => {
			uni.hideLoading();
			reject(err)
		})
	})
}