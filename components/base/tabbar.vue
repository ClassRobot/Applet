<template>
	<view class="tabbar-box">
		<view class="tabbar">
			<view :class="{ 'tabbar-active' : select == item.key}" v-for="(item, index) in list" :key="index"
				v-if="!item.isNotShop" @click="toPath(item, index)" class="tabbar-item">
				<view class="tabbar-icon">
					<image :src="select == item.key ? 
					item.selectedIconPath : 
					item.iconPath" class="tabbar-icon-image" mode="aspectFill"></image>
				</view>
				<view class="tabbar-title">
					{{ item.title }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tabbar",
		props: ['select'],
		computed: {
		},
		data() {
			return {
				list: [{
						"selectedIconPath": "/static/image/tabbar/home-a.png",
						"iconPath": "/static/image/tabbar/home.png",
						"pagePath": "/pages/index/index",
						"title": "首页",
						key: 'home',
					},
					{
						"selectedIconPath": "/static/image/tabbar/category-a.png",
						"iconPath": "/static/image/tabbar/category.png",
						"pagePath": "/pages/index/category",
						"title": "商品列表",
						key: 'category',
					},
					{
						"selectedIconPath": "/static/image/tabbar/order-a.png",
						"iconPath": "/static/image/tabbar/order.png",
						"pagePath": "/pages/index/order",
						"title": "订单",
						key: 'order',
					},
					{
						"selectedIconPath": "/static/image/tabbar/cart-a.png",
						"iconPath": "/static/image/tabbar/cart.png",
						"pagePath": "/pages/index/cart",
						"title": "购物车",
						key: 'cart',
					},
					{
						"selectedIconPath": "/static/image/tabbar/center-a.png",
						"iconPath": "/static/image/tabbar/center.png",
						"pagePath": "/pages/index/center",
						"title": "我的",
						key: 'center',
					}
				]
			};
		},
		methods: {
			toPath(item, index) {
				if (item.key == this.select) {
					return
				}
				uni.reLaunch({
					url: item.pagePath
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.tabbar-box {
		height: 120rpx;
		padding-bottom: env(safe-area-inset-bottom);

		.tabbar {
			position: fixed;
			width: 750rpx;
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
			height: 120rpx;
			padding-bottom: env(safe-area-inset-bottom);
			z-index: 999999;
			bottom: 0;
			left: 0;
			color: #BCBCBC;

			.tabbar-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.tabbar-icon {
					width: 54rpx;
					height: 54rpx;

					.tabbar-icon-image {
						width: 54rpx;
						height: 54rpx;
					}
				}

				.tabbar-title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					-o-text-overflow: ellipsis;
					font-size: 23rpx;
					line-height: 35rpx;
				}
			}

			.tabbar-active {
				color: $uni-color !important;
			}
		}
	}
</style>