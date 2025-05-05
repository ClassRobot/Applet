<script>
export default {
    onLaunch: function () { },
    onShow: function () {
        // this.$store.commit('initConfig')
    },
    onHide: function () { },
};
</script>

<style>
@import url("common.scss");

/*每个页面公共css */
body {
    background-color: #f7f7f7;
    font-size: 30rpx;
}

.page {
    padding-top: var(--window-top);
}
</style>
