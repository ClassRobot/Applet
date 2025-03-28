<template>
	<view>
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

</style>
