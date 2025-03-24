import { mapState } from "vuex";
export default {
  data() {
    return {
      // 默认的全局分享内容
      Gshare: {
        title: "三只青蛙",
        path: "/pages/index/index", // 全局分享的路径，比如 首页
        // imageUrl: '/static/image/login/logo.png',    // 全局分享的图片(可本地可网络)
      },
    };
  },
  computed: {
    ...mapState(["configList", "userInfo", "riceInfo"]),
  },
  // 定义全局分享
  // 1.发送给朋友
  onShareAppMessage(res) {
    let o = {
      title: this.configList.logo_name,
      ...this.Gshare,
    };
    if (this.userInfo.id) {
      if (this.Gshare.path.includes("?")) {
        o.path += "&shareId=" + this.userInfo.id;
      } else {
        o.path += "?shareId=" + this.userInfo.id;
      }
    }
    return o;
  },
  //2.分享到朋友圈
  onShareTimeline(res) {
    let o = {
      ...this.Gshare,
      title: this.configList.logo_name,
    };
    if (this.userInfo.id) {
      o.path = this.Gshare.path + "?shareId=" + this.userInfo.id;
    }
    return o;
  },
  methods: {},
};
