/**
 * 阿里云OSS工具类
 */
import OSSConfig from "@/utils/oss-upload/oss/OSSConfig.js"

import ossConfig from '@/config.js'

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

/**
 * 阿里云OSS上传文件, 所有具体功能的工具函数均基于此
 * 注意, resolve时一定为上传成功, 返回OSS上的Key
 * @param filePath 待上传文件的URI
 * @param key 存储桶中的目标文件名
 * @param folder 存储桶中的目标文件夹
 */
export function ossUpload(filePath, key = storeKey(), folder = storeFolder()) {
	return new Promise((resolve, reject) => {
		if (folder && folder?.length > 0) {
			if (folder[0] == "/") folder = folder.slice(1, folder.length)
			if (folder[folder.length - 1] != "/") folder += "/"
			key = folder + key
		}
		const filePrefixArr = filePath.split(".")
		key += `.${filePrefixArr[filePrefixArr.length - 1]}`
		let config = {
			url: OSSConfig.host,
			name: 'file',
			filePath,
			formData: {
				key,
				policy: OSSConfig.policyBase64,
				OSSAccessKeyId: OSSConfig.accessid,
				success_action_status: '200',
				signature: OSSConfig.signature,
			},
			success(res) {
				if (res.errMsg.includes("uploadFile:ok")) {
					resolve(ossConfig.aliOss.url + key)
				} else {
					reject(res)
				}
			},
			fail(err) {
				reject(err)
			}
		}
		uni.uploadFile(config)
	})
}

/**
 * 阿里云OSS上传图片
 * @param {compressed, key, folder, success, fail} compressed: 是否压缩 key: 存储桶中的目标文件名 folder: 存储桶中的目标文件夹
 */
export function ossUploadImage({
	key,
	folder,
	compressed = true, //是否压缩
	success, //成功时的回调
	fail //失败时的回调
}) {
	const sizeType = [compressed ? 'compressed' : 'original']
	uni.chooseImage({
		count: 1,
		sizeType,
		success(res) {
			ossUpload(res.tempFilePaths[0], key, folder).then(success).catch(fail)
		},
		fail
	})
}

/**
 * 阿里云OSS上传视频
 * @param { key, folder, sourceType, compressed, maxDuration, camera, success, fail} 
 * key: 存储桶中的目标文件名 folder: 存储桶中的目标文件夹 其它参数同uni.chooseVideo(mpWeixin) 
 */
export function ossUploadVideo({
	key,
	folder,
	sourceType = ['album', 'camera'], //album 从相册选视频, camera 使用相机拍摄
	compressed = true, //是否压缩所选的视频源文件
	maxDuration = 60, //拍摄视频最长拍摄时间, 单位秒。最长支持 60 秒
	camera = 'back', //调用相机方向, 'front'、'back', 默认'back'
	success, //成功时的回调
	fail //失败时的回调
}) {
	uni.chooseVideo({
		sourceType,
		compressed,
		maxDuration,
		camera,
		success(res) {
			ossUpload(res.tempFilePath, key, folder).then(success).catch(fail)
		},
		fail
	})
}
const OSS = {
	ossUploadVideo,
	ossUploadImage,
	ossUpload
}
export default OSS;