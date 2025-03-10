<template>
	<view class="configPopup">
		<uv-popup ref="popup" :round="30" :customStyle="{height: '50vh'}">
			<view class="content">
				<uv-parse :content="content"></uv-parse>
			</view>
		</uv-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: 'configPoup',
		data() {
			return {
				content : ''
			}
		},
		onShow(){
		},
		methods: {
			
			//打开配置信息菜单
			open(key){
				this.content = this.configList[key]
				this.$refs.popup.open('bottom');
			}
			
			
		},
		
		computed : {
			...mapState(['configList'])
		}
	}
</script>

<style lang="scss" scoped>
	.configPopup {
		.content{
			padding: 30rpx 20rpx;
			overflow: scroll;
			height: 100%;
			box-sizing: border-box;
		}
	}
</style>