import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import './uni.promisify.adaptor'

Vue.config.productionTip = false

App.mpType = 'app'

import store from '@/store/store'

import './config'
import './utils/index.js'

import mixinConfigList from '@/mixins/configList.js'

Vue.mixin(mixinConfigList)

//组件注册
import configPopup from '@/components/config/configPopup.vue'
import navbar from '@/components/base/navbar.vue'

Vue.component('configPopup',configPopup)
Vue.component('navbar',navbar)

const app = new Vue({
	...App,
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif