<template>
    <uv-popup ref="loginPopup" 
        mode="center" 
        :round="20" 
        :closeable="false" 
        :maskClick="false"
		:safeAreaInsetBottom="false"
        
        :customStyle="{backgroundColor: '#fff', padding: 0}"
        overlayOpacity="0.8">
		
		<!-- :closeOnClickOverlay="false" -->
		
        <view class="login-card">
            <view class="login-title">登录后即可体验完整服务</view>
            <view class="login-content">
                <!-- <image :src="logo_image" mode="aspectFit" class="login-image"></image> -->
                <button class="login-btn" @click="handleLogin">
                    微信一键登录
                </button>
            </view>
        </view>
    </uv-popup>
</template>

<script>
import Vue from 'vue'
export default {
	data(){
		return {
		}
	},
	created() {
		uni.$on('logout', this.open)
	},
	beforeDestroy() {
		uni.$off('logout', this.open)
	},
    methods: {
        open(){
            this.$refs.loginPopup.open()
        },
        close(){
            this.$refs.loginPopup.close()
        },
        
        // 处理登录
        handleLogin() {
            this.$store.commit('login', (state) => {
                this.close()
                this.$emit('login')
            })
        },
    }
}
</script>

<style lang="scss" scoped>

.login-card {
    width: 600rpx;
    padding: 40rpx;
    text-align: center;
    
    .login-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 40rpx;
    }
    
    .login-content {
        .login-image {
            width: 300rpx;
            height: 300rpx;
            margin-bottom: 40rpx;
        }
        
        .login-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            width: 80%;
            height: 88rpx;
            background: #07C160;
            color: #fff;
            border-radius: 44rpx;
            font-size: 32rpx;
            
            .wechat-icon {
                width: 48rpx;
                height: 48rpx;
                margin-right: 10rpx;
            }
        }
    }
}
</style>