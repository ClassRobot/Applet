<template>
	<view class="login">
		<view class="title">
			酒店桌布租赁平台
		</view>
		<view class="title">
			申请获取你的头像、昵称
		</view>

		<button class="chooseAvatar" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			<view class="line">
				<view class="">
					头像
				</view>
				<view class="">
					<image :src="userInfo.headImage" v-if="userInfo.headImage" style="width: 60rpx;height: 60rpx;"
						mode=""></image>

					<image src="../static/auth/headImage.png" v-else style="width: 50rpx;height: 50rpx;" mode=""></image>
				</view>
			</view>
		</button>
		<view class="line">
			<view class="">
				昵称
			</view>
			<view class="">
				<input type="nickname" placeholder="请输入昵称" style="text-align: right;" id="nickName"
					v-model="userInfo.nickName" />
			</view>
		</view>
		<view class="btn" @click="submit">
			确认
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					headImage: '',
					nickName: '',
				}
			};
		},
		onShow() {},
		computed: {},
		methods: {
			onChooseAvatar(res) {
				let self = this
				self.$Oss.ossUpload(res.target.avatarUrl)
					.then(url => {
						self.userInfo.headImage = url
					})
			},
			submit() {
				let self = this

				uni.createSelectorQuery().in(this)
					.select("#nickName")
					.fields({
						properties: ["value"],
					})
					.exec((res) => {
						const nickName = res?.[0]?.value
						self.userInfo.nickName = nickName
						
						if (self.$utils.verificationAll(self.userInfo, {
								headImage: '请选择头像',
								nickName: '请填写昵称',
							})) {
							return
						}
						
						self.$api('updateInfo', self.userInfo, res => {
							if (res.code == 200) {
								uni.switchTab({
									url:'/pages/index/index'
								})
							}
						})
					})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 80vh;

		.title {
			line-height: 45rpx;
			font-weight: 900;
		}

		.line {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 80%;
			border-bottom: 1px solid #00000023;
			padding: 30rpx 0;
			margin: 0 auto;
		}

		.chooseAvatar {
			width: 100%;
			padding: 0;
			margin: 0;
			margin-top: 10vh;
			border: none;
		}

		.btn {
			// background: $uni-linear-gradient-btn-color;
			background: $uni-color;
			color: #fff;
			width: 80%;
			padding: 20rpx 0;
			text-align: center;
			border-radius: 15rpx;
			margin-top: 10vh;
		}
	}
</style>