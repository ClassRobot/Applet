


function authorize(scope){
	return new Promise((success, error) => {
		uni.authorize({
			/* scope.writePhotosAlbum 类型是保存到相册 */
			scope,
			success,
			complete(res) {
				/* 判断如果没有授权就打开设置选项让用户重新授权 */
				uni.getSetting({
					success(res) {
						if (!res.authSetting[scope]) {
							setting()
						}
					}
				});
			}
		});
		
		function setting(){
			uni.showModal({
				title: '当前操作未授权，请授权！',
				content: '拒绝授权将影响本小程序部分功能的使用',
				confirmText: '授权',
				success(e) {
					if(!e.confirm){
						return error()
					}
					uni.openSetting({
						success(res) {
							if (!res.authSetting[scope]) {
								uni.showToast({
									title: '授权失败',
									icon: 'none',
								})
								return error()
							}
							success()
						}
					});
				}
			})
		}
	})
}





export default authorize