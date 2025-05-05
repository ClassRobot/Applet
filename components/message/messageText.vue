<template>
	<view class="message-text">
		<uaMarkdown :source="data.text" v-if="data.text" />
	</view>
</template>

<script>
	import uaMarkdown from '../ua2-markdown/ua-markdown.vue'
	export default {
		props : ['data'],
		components : {
			uaMarkdown,
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.message-text {
	line-height: 1.6;
	
	:deep(p) {
		margin: 8rpx 0;
		font-size: 30rpx;
	}
	
	:deep(pre) {
		margin: 16rpx 0;
		border-radius: 10rpx;
		background-color: rgba(0, 0, 0, 0.04);
		padding: 16rpx;
		overflow-x: auto;
	}
	
	:deep(code) {
		font-family: 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
		font-size: 26rpx;
	}
	
	:deep(a) {
		color: #2797ff;
		text-decoration: none;
	}
	
	:deep(ul), :deep(ol) {
		padding-left: 30rpx;
		margin: 16rpx 0;
	}
	
	:deep(li) {
		margin: 8rpx 0;
		font-size: 30rpx;
	}
	
	:deep(img) {
		max-width: 100%;
		border-radius: 8rpx;
	}
	
	:deep(blockquote) {
		border-left: 6rpx solid #e0e0e0;
		padding-left: 16rpx;
		margin: 16rpx 0;
		color: #666;
	}
}
</style>
