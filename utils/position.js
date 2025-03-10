import config from '../config.js'

/**
 * 计算两点之间的距离
 * @param {number} lat1 地点1精度
 * @param {number} lon1 地点1维度
 * @param {number} lat2 地点2精度
 * @param {number} lon2 地点2维度
 * @param {number} fixed 保留几位小数,默认0,单位km
 */
function calculateDistance(lat1, lon1, lat2, lon2, fixed = 0) { //计算两点距离
	let distance = 0
	if (!lat2 || !lon2) return distance
	//先强制转换一下(后端给的字符串)
	lat1 = parseFloat(lat1)
	lon1 = parseFloat(lon1)
	lat2 = parseFloat(lat2)
	lon2 = parseFloat(lon2)
	// 将角度转换为弧度
	const R = 6371; // 地球半径，单位公里  
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	lat1 = lat1 * Math.PI / 180;
	lat2 = lat2 * Math.PI / 180;
	// Haversine公式  
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	// 计算距离  
	distance = R * c;
	return distance.toFixed(fixed)
}

function getLocation(fn) { //获取用户经纬度
	wxGetLocation() //此方法只用于提示用户打开gps
	uni.getLocation({
		type: 'gcj02',
		isHighAccuracy: true,
		highAccuracyExpireTime: 1000,
		success: function(position) {
			fn(position)
		},
		fail: function() { //使用ip获取定位
			let key = config.mapKey; //腾讯地图key
			getUserAddressByIp(key).then(res => {
				fn(res.position) //返回经纬度
			})
		}
	})
}

function getLocationDetail() { //获取用户详细地址
	wxGetLocation()
	return new Promise((resolve, reject) => {
		let key = config.mapKey; //腾讯地图key
		uni.getLocation({
			type: 'gcj02',
			isHighAccuracy: true,
			highAccuracyExpireTime: 1000,
			success: function(position) {
				getUserAddress(position.latitude, position.longitude, key).then(res => {
					resolve(res)
				})
			},
			fail: function() { //使用ip获取定位
				getUserAddressByIp(key).then(res => {
					resolve(res)
				})
			}
		})
	})
}

function getUserAddress(latitude, longitude, key) { //通过经纬度获取用户详细地址
	return new Promise((resolve, reject) => {
		
		let url = `/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`
		
		// #ifndef H5
			url = `https://apis.map.qq.com` + url
		// #endif
		
		uni.request({
			url,
			success: (res) => {
				let {
					lat,
					lng
				} = res.data.result.ad_info.location;
				let data = {
					position: {
						latitude: lat,
						longitude: lng
					},
					addressDetail: res.data.result.ad_info
				}
				resolve(data)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

function getUserAddressByIp(key) { //根据IP获取当前用户位置
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://api.ipify.org?format=json',
			success: (ipInfo) => {
				
				let url = `/ws/location/v1/ip?ip=${ipInfo.data.ip}&key=${key}`
				
				// #ifndef H5
					url = `https://apis.map.qq.com` + url
				// #endif
				
				uni.request({
					url,
					success: (res) => {
						let {
							lat,
							lng
						} = res.data.result.location;
						let data = {
							addressDetail: res.data.result.ad_info,
							ip: res.data.result.ip,
							position: {
								latitude: lat,
								longitude: lng
							}
						}
						resolve(data)
					},
					fail(err) {
						reject(err)
					}
				})
			}
		})
	})
}

//打开地图让用户选择位置
function selectAddress(longitude, latitude, successCallback) {
	uni.chooseLocation({
		// longitude, //经度
		// latitude, //纬度
		success: function(res) {
			successCallback && successCallback(res)
		}
	});
}

//sdk自带获取位置方法(只支持微信环境),这里只当提示在用了(具体获取地址逻辑上面几个方法已完成)
function wxGetLocation(successCallback, failCallback) {
	// #ifdef MP-WEIXIN
	
	// #endif
	console.log('wx.getLocation');
	wx.getLocation({
		type: 'gcj02',
		isHighAccuracy: true,
		highAccuracyExpireTime: 2000,
		success(res) {},
		fail(err) {
			if(err.errMsg == 'getLocation:gps closed'){
				uni.showToast({
					title: '请打开GPS定位,否则定位不准确',
					icon: 'none'
				})
			}
		}
	})
}


export default {
	calculateDistance, //计算两点距离
	getLocationDetail, //获取用户详细地址
	getLocation, //获取用户经纬度
	selectAddress, //打开地图让用户选择位置
	wxGetLocation,
}