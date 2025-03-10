function formatTime(timestamp) {
	const currentTime = new Date().getTime();
	const diff = (currentTime - timestamp) / 1000;

	if (diff < 60) {
		return `${Math.floor(diff)}秒钟前`;
	} else if (diff < 60 * 60) {
		return `${Math.floor(diff / 60)}分钟前`;
	} else if (diff < 60 * 60 * 24) {
		return `${Math.floor(diff / 60 / 60)}小时前`;
	} else {
		let date = new Date(timestamp);
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hours = date.getHours();
		let minutes = date.getMinutes();
		if(month<9) month = "0"+month;
		if(day<9) day = "0"+day;
		return `${month}-${day} ${hours}:${minutes}`;
	}
}

function formatTime2Date(timestamp) {
	if(!timestamp){
		return "1970年01月01日"
	}
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}年${month}月${day}日`;
}

export default {
	formatTime: formatTime,
	formatTime2Date: formatTime2Date
}