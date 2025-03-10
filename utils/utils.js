/**
 * 将数据转换为数组格式
 * @param {any} data - 需要转换的数据
 * @returns {Array} 转换后的数组
 */
function toArray(data) {
	if (!data) return []
	if (data instanceof Array){
		return data
	} else {
		return [data]
	}
}

/**
 * 生成UUID
 * @returns {string} 生成的UUID字符串
 */
function generateUUID() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 生成随机颜色
 * @returns {string} 生成的十六进制颜色值
 */
function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * 生成浅色系的随机颜色
 * @returns {string} 生成的RGB格式颜色值
 */
function generateLightRandomColor() {
  const min = 150; 
  const range = 105;
  const r = Math.floor(Math.random() * range + min);
  const g = Math.floor(Math.random() * range + min);
  const b = Math.floor(Math.random() * range + min);
  const color = 'rgb(' + r + ',' + g + ',' + b + ')';
  return color;
}

/**
 * 表单数据验证
 * @param {Object} data - 需要验证的表单数据
 * @param {Object} msg - 验证失败时的提示信息
 * @returns {boolean} 验证结果，true表示验证失败，false表示验证通过
 */
function verificationAll(data, msg){
	
	if (!msg){
		console.log(msg);
		return false
	}
	
	if (!data){
		uni.showToast({
			title: '表单数据未填写',
			icon: "none"
		})
	}
	
	for (let key in msg) {
	    if (!data[key]) {
			uni.showToast({
				title: msg[key],
				icon: "none"
			})
			return true
	    }
	}
	return false
}

/**
 * 验证手机号是否合法
 * @param {string} phone - 需要验证的手机号
 * @returns {boolean} 验证结果，true表示合法，false表示不合法
 */
function verificationPhone(phone){
	if(!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phone)){
		return false
	}
	return true
}

//获取url中参数的方法
/**
 * 获取URL中指定参数的值
 * @param {string} name - 参数名称
 * @returns {string} 参数值，如果不存在则返回空字符串
 */
export function getHrefParams(name) {
	var url = window.location.href;
	try {
		var cs = url.split('?')[1]; //获取?之后的参数字符串
		var cs_arr = cs.split('&'); //参数字符串分割为数组
		for (var i = 0; i < cs_arr.length; i++) { //遍历数组，拿到json对象
			if (cs_arr[i].split('=')[0] == name) {
				return cs_arr[i].split('=')[1];
			}
		}
		return "";
	} catch {
		return "";
	}
}

/**
 * 深度合并两个对象，相同属性b会覆盖a
 * @param {Object} a - 目标对象
 * @param {Object} b - 源对象
 * @returns {Object} 合并后的新对象
 */
export function deepMergeObject(a, b){
	let data = JSON.parse(JSON.stringify(a))
	function mergeObject(obj1, obj2){
		for(let key in obj2){
			if(typeof obj1[key] == 'object'){
				obj1[key] = mergeObject(obj1[key], obj2[key])
			}else{
				obj1[key] = obj2[key]
			}
		}
		return obj1
	}
	return mergeObject(data, b)
}

/**
 * 复制文本到剪贴板
 * @param {string} content - 要复制的内容
 */
export function copyText(content) {
	uni.setClipboardData({
		data: content,
		success: () => {
			uni.showToast({
				title: '复制成功',
				icon: 'none'
			})
		}
	})
}

/**
 * 将字符串中的文本格式化为HTML
 * @param {string} str - 需要格式化的字符串
 * @returns {string} 格式化后的HTML字符串
 */
export function stringFormatHtml(str){
	return str && str.replace(/\n/gi, '<br>')
	.replace(/ /gi, ' ')
}

/**
 * 处理页面导航参数
 * @param {string|Object} url - 页面路径或导航参数对象
 * @returns {Object} 处理后的导航参数对象
 */
function params(url){
	if(typeof url == 'object'){
		return url
	}
	
	let data = {
		url
	}
	
	if(!data.url.includes('/pages')){
		data.url = '/pages' + data.url
	}
	
	return data
}

/**
 * 页面导航方法
 * @param {...any} args - 导航参数
 */
export function navigateTo(...args){
	uni.navigateTo(params(...args))
}

/**
 * 返回上一页
 * @param {number} num - 返回的页面数，默认为-1
 */
export function navigateBack(num = -1){
	uni.navigateBack(num)
}

/**
 * 重定向到指定页面
 * @param {...any} args - 导航参数
 */
export function redirectTo(...args){
	uni.redirectTo(params(...args))
}

/**
 * 登录跳转函数，防止短时间内多次调用
 * @returns {Function} 节流处理后的登录跳转函数
 */
export const toLogin = function(){
	let time = 0
	return () => {
		if(new Date().getTime() - time < 1000){
			return
		}
		time = new Date().getTime()
		uni.navigateTo({
			url: '/pages_order/auth/wxLogin'
		})
	}
}()

export default {
	toArray,
	generateUUID,
	verificationAll,
	generateRandomColor,
	generateLightRandomColor,
	verificationPhone,
	getHrefParams,
	deepMergeObject,
	navigateTo,
	navigateBack,
	redirectTo,
	copyText,
	stringFormatHtml,
	toLogin
}