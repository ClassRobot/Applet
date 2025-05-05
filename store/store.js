// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);//vue的插件机制

import index from './modules/index.js'
import user from './modules/user.js'
import websocket from './modules/websocket.js'
import getters from './getters'

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	modules: {
		index,
		user,
		websocket,
	},
	getters
})


export default store
