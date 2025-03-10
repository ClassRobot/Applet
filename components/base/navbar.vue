<template>
<!-- 	<view class="navbar"
	:style="{backgroundColor : bgColor}"> -->
		<view class="title"
		:style="{backgroundColor : bgColor,color}">
			<view class="left">
				
				<uv-icon name="home"
				v-if="leftClick && length == 1"
				@click="toHome"
				:color="color"  size="46rpx"></uv-icon>
				
				<uv-icon name="arrow-left"
				v-else-if="leftClick"
				@click="$emit('leftClick')"
				:color="color"  size="46rpx"></uv-icon>
			</view>
			<view>{{ title }}</view>
			<view class="icon">
				
				<uv-icon name="search"
				v-if="isSearch"
				:color="color"  size="58rpx"></uv-icon>
				
				<uv-icon name="plus-circle" :color="color"  
				v-if="isPlus"
				@click="plusCircleShow = true"
				size="46rpx" style="margin-left: 30rpx;"></uv-icon>
				
				<view v-if="moreClick" style="margin-left: 30rpx;">
					<uv-icon name="more-dot-fill" :color="color" 
					v-if="!moreText"
					@click="moreClick()"
					size="46rpx"></uv-icon>
					<view v-else @click="moreClick"
					style="font-weight: 400;font-size: 30rpx;">
						{{ moreText }}
					</view>
				</view>
			</view>
		</view>
		
	<!-- </view> -->
</template>

<script>
	export default {
		name:"navbar",
		props : {
			title : {
				type : String,
				default : ''
			},
			leftClick : {
				type : Boolean,
			},
			moreClick : {
				type : Function,
			},
			isSearch : {
				type : Boolean,
				default : false,
			},
			isPlus : {
				type : Boolean,
				default : false,
			},
			moreText : {
				
			},
			bgColor : {
				default : '#fff'
			},
			color : {
				default : '#333'
			}
		},
		created() {
		},
		beforeDestroy() {
		},
		data() {
			return {
				length : getCurrentPages().length
			};
		},
		methods : {
			toHome(){
				if(this.length != 1){
					return
				}
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>


<style lang="scss" scoped>
// .navbar{
// 	width: 100%;
// 	height: 120rpx;
// 	padding-top: var(--status-bar-height);
// }
.title{
	position: sticky;
	top: 0;
	left: 0;
	padding-top: calc(var(--status-bar-height) + 20rpx);
	width: 100%;
	height: 100rpx;
	background-color: #fff;
	display: flex;
	justify-content: center;
	font-size: 32rpx;
	align-items: center;
	z-index: 999;
	.left{
		position: absolute;
		left: 40rpx;
		display: flex;
		justify-content: flex-start;
	}
	.icon{
		position: absolute;
		right: 40rpx;
		display: flex;
		justify-content: flex-end;
	}
}


@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>