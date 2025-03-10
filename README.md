# 商城项目文档

## 项目概述
本项目是一个基于uni-app开发的商城小程序，采用Vue框架开发，集成了完整的商城功能模块。

## 目录结构
```
├── api                 # API接口目录
│   ├── api.js          # API统一出口
│   ├── http.js         # HTTP请求封装
│   └── model           # 业务模块API
├── components          # 公共组件
├── mixins              # 混入文件
├── pages              # 页面文件
├── static             # 静态资源
├── store              # Vuex状态管理
├── utils              # 工具函数
└── uni_modules        # uni-app插件模块
```

## 分包结构说明

### pages_order分包
分包是小程序优化加载性能的重要手段，pages_order作为独立分包，包含以下模块：

```
├── auth                # 认证相关页面
│   ├── loginAndRegisterAndForgetPassword.vue  # 登录注册
│   ├── wxLogin.vue     # 微信登录
│   └── wxUserInfo.vue  # 微信用户信息
├── components          # 分包内公共组件
│   ├── address/        # 地址选择组件
│   ├── areaSelector/   # 区域选择器
│   └── product/        # 商品相关组件
├── home                # 首页相关
│   ├── addEnterprise.vue  # 添加企业
│   ├── contact.vue     # 联系我们
│   ├── introduce.vue   # 介绍页面
│   ├── journalism.vue  # 新闻资讯
│   └── notice.vue      # 公告
├── mine                # 我的模块
│   ├── address.vue     # 收货地址
│   ├── balance.vue     # 余额
│   ├── commission.vue  # 佣金
│   ├── coupon.vue      # 优惠券
│   ├── memberCenter.vue # 会员中心
│   └── more...         # 更多功能页面
├── order               # 订单模块
│   ├── createOrder.vue # 创建订单
│   ├── orderDetail.vue # 订单详情
│   └── giftList.vue    # 礼品列表
├── product             # 商品模块
│   └── productDetail.vue # 商品详情
└── static              # 分包静态资源
    ├── address/        # 地址相关图片
    ├── auth/           # 认证相关图片
    ├── coupon/         # 优惠券图片
    └── more...         # 其他静态资源
```

**分包特点：**
- 静态资源就近原则：分包相关的图片等静态资源存放在分包目录下，避免主包体积过大
- 模块化组织：按功能模块划分目录，便于维护和管理
- 组件复用：分包内的通用组件集中管理，提高代码复用性

## 配置文件说明

### config.js
项目核心配置文件，包含以下配置：

**1. 环境配置**
```javascript
// 当前环境
const type = 'prod'

// 环境配置
const config = {
  dev: {
    baseUrl: 'http://h5.xzaiyp.top/jewelry-admin',
  },
  prod: {
    baseUrl: 'https://jewelry-admin.hhlm1688.com/jewelry-admin',
  }
}
```

**2. 默认配置**
```javascript
const defaultConfig = {
  // 腾讯地图Key
  mapKey: 'XMBBZ-BCPCV-SXPPQ-5Y7MY-PHZXK-YFFVU',
  // 阿里云OSS配置
  aliOss: {
    url: 'https://image.hhlm1688.com/',
    config: {
      region: 'oss-cn-guangzhou',
      accessKeyId: '***',
      accessKeySecret: '***',
      bucket: 'hanhaiimage',
      endpoint: 'oss-cn-shenzhen.aliyuncs.com',
    }
  }
}
```

**3. UI框架配置**
```javascript
uni.$uv.setConfig({
  config: {
    unit: 'rpx'  // 设置默认单位
  },
})

// UI文档地址 https://www.uvui.cn/
```

## 核心模块详解

### 1. Mixins 混入

#### 1.1 list.js - 列表数据加载混入
提供列表数据的加载、分页、下拉刷新、上拉加载更多等功能。

**主要功能：**
- 统一的分页参数处理
- 下拉刷新和上拉加载更多
- 数据加载状态管理

**使用示例：**
```javascript
// 在页面中使用list混入
import listMixin from '@/mixins/list.js'

export default {
  mixins: [listMixin],
  data() {
    return {
      // 指定API接口
      mixinsListApi: 'productList'
    }
  }
}
```

#### 1.2 configList.js - 全局配置混入
已全局引入的配置管理混入，无需手动引入即可使用。

**主要功能：**
- 统一的分享配置
- 全局配置管理
- 用户信息关联

**配置参数：**
```javascript
// 分享配置示例
this.Gshare.title = '分享标题'
this.Gshare.path = '分享路径'
```

### 2. API 模块

#### 2.1 http.js - 请求封装
统一的HTTP请求处理，包含：
- 请求拦截器
- 响应拦截器
- 统一的错误处理
- Token管理

#### 2.2 api.js - 接口管理
统一管理API接口，支持模块化组织。API模块采用分层结构，便于维护和扩展。

**目录结构：**
```
api/
├── api.js          # API统一出口
├── http.js         # HTTP请求封装
└── model/          # 业务模块API
    ├── product.js  # 商品相关接口
    ├── order.js    # 订单相关接口
    └── user.js     # 用户相关接口
```

**接口定义示例：**
```javascript
// api/model/product.js
export default {
  // GET请求示例
  list: {
    url: '/api/product/list',
    method: 'GET',
    loading: true // 显示加载提示
  },
  
  // POST请求示例
  create: {
    url: '/api/product/create',
    method: 'POST',
    loading: true // 显示加载提示
	auth : true,//效验登录
	debounce : 1000,//接口防抖，1s
	limit : 500,//接口限流，0.5s
  },
}
```

**调用接口示例：**
```javascript
// 第一种写法：callback方式处理响应
this.$api('product.list', {
  pageNo: 1,
  pageSize: 10,
  categoryId: '123'
}, res => {
  // 处理列表数据
})

// 第二种写法：Promise方式处理响应
this.$api('product.create', {
  name: '商品名称',
  price: 99.99,
  description: '商品描述'
}).then(res => {
  if (res.code === 200) {
    // 创建成功
    uni.showToast({ title: '创建成功' })
  }
})
```


### 3. 公共代码

#### 3.1 工具函数 (utils)
- authorize.js: 授权处理
- pay.js: 微信网页支付相关
- utils.js: 通用工具函数
- timeUtils.js: 时间处理
- position.js: 定位与位置计算
- oss-upload: 阿里云OSS上传模块


**使用示例：**
```javascript

// 授权处理
async preservationImg(img) {
	await this.$authorize('scope.writePhotosAlbum')
	//在执行$authorize之后，await下面的代码都是确保授权完成的情况下执行
},

// 时间格式化
const formattedTime = this.$timeUtils.formatTime(new Date())

// 项目中在Vue集成了dayjs >>，可以直接使用
// 在utils/index中Vue.prototype.$dayjs
this.$dayjs()

// 微信网页支付调用
import { wxPay } from '@/utils/pay'
wxPay(orderData)
```

#### 3.2 公共组件
- navbar.vue: 自定义导航栏
- tabbar.vue: 底部导航栏

**使用示例：**
```html
<template>
  <view>
    <navbar title="商品列表" />
  </view>
</template>
```


#### 3.3 OSS上传模块

**配置说明：**
项目使用阿里云OSS进行文件存储，相关配置位于config.js中：


**使用示例：**

1. 单文件上传
```javascript
export default {
  methods: {
    onUpload(file) {
		this.$Oss.ossUpload(file.path).then(url => {
			this.filePath = url
		})
    }
  }
}
```

2. 在uv-upload组件中使用
```html
<template>
  <uv-upload
    :fileList="fileList"
    @afterRead="afterRead"
    @delete="deleteImage"
    name="1"
    multiple
    :maxCount="maxCount"
  ></uv-upload>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      maxCount: 9
    }
  },
  methods: {
    // 新增图片
    afterRead(e) {
		e.file.forEach(file => {
			this.$Oss.ossUpload(file.url).then(url => {
				this.fileList.push({
					url
				})
			})
		})
	},
    // 删除图片
    deleteImage(e) {
		this.fileList.splice(e.index, 1)
	},
  }
}
</script>
```

**注意事项：**
1. 上传前请确保OSS配置正确
2. 建议对上传文件大小进行限制
3. 支持的文件类型：图片、视频、文档等
4. 上传失败时会抛出异常，请做好错误处理

## 最佳实践

### 1. 列表页面开发
```javascript
// pages/product/list.vue
import listMixin from '@/mixins/list.js'

export default {
  mixins: [listMixin],
  data() {
    return {
      mixinsListApi: 'productList',
    }
  },
  methods: {
    // 分类切换
    onCategoryChange(categoryId) {
      this.queryParams.categoryId = categoryId
      this.getData()
    }
  }
}
```

### 2. 详情页面开发
```javascript
// pages/product/detail.vue
import configMixin from '@/mixins/configList.js'

export default {
  mixins: [configMixin],
  data() {
    return {
      productId: '',
      detail: {}
    }
  },
  onLoad(options) {
    this.productId = options.id
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.$api('productDetail', {
        id: this.productId
      }, res => {
        this.detail = res.result
        // 设置分享信息
        this.Gshare.title = this.detail.name
        this.Gshare.path = `/pages/product/detail?id=${this.productId}`
      })
    }
  }
}
```

## 注意事项
1. 使用mixins时注意命名冲突
2. API调用建议统一使用this.$api方式
3. 页面开发建议继承相应的混入来复用通用功能

## 常见问题
1. 列表加载失败
   - 检查mixinsListApi是否正确配置
   - 确认网络请求是否正常
   - 查看请求参数格式是否正确

