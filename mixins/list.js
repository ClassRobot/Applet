/**
 * 处理查询参数
 * @param {Object} self - 组件实例
 * @param {Object} queryParams - 额外的查询参数
 * @returns {Object} 合并后的查询参数
 */
function query(self, queryParams){
	// 深度合并对象
	return self.$utils.deepMergeObject(
		self.$utils.deepMergeObject(self.queryParams,
		(self.beforeGetData && self.beforeGetData()) || {}),
		queryParams)
}

/**
 * 列表数据加载混入
 * 提供列表数据的加载、分页、下拉刷新、上拉加载更多等功能
 */
export default {
	data() {
		return {
			queryParams: {
				pageNo: 1,
				pageSize: 10,
			},
			total : 0,
			list : [],
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.getData()
	},
	// 上拉加载更多
	onReachBottom() {
		this.loadMoreData()
	},
	// 页面显示时加载数据
	onShow() {
		this.getData()
	},
	methods: {
		/**
		 * 获取列表数据
		 * @param {Object} queryParams - 查询参数
		 * @returns {Promise} 返回Promise对象
		 */
		getData(queryParams){
			return new Promise((success, error) => {
				if(!this.mixinsListApi){
					return console.error('mixinsListApi 缺失');
				}
				this.$api(this.mixinsListApi, 
				query(this, queryParams), res => {
					uni.stopPullDownRefresh()
					if(res.code == 200){
						success(res.result)
						// 更新列表数据
						this[this.mixinsListKey || 'list'] = res.result.records || res.result
						// 更新总数
						this.total = res.result.total || res.result.length
						// 调用数据加载完成的回调
						this.getDataThen && this.getDataThen(res.result.records, res.result.total, res.result)
					}
				})
			})
		},
		/**
		 * 加载更多数据
		 */
		loadMoreData(){
			if(this.queryParams.pageSize < this.total){
				this.queryParams.pageSize += 10
				this.getData()
			}
		},
	}
}