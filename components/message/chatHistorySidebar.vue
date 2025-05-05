<template>
    <view class="chat-history-sidebar">
        <uv-popup ref="popup" mode="left" :mask-close-able="true" :customStyle="{ width: '75vw', height: '100vh' }">
            <view class="sidebar-container">
                <!-- 标题区域 -->
                <view class="sidebar-header">
                    <text class="sidebar-title">聊天记录</text>
                    <view class="header-actions">
                        <uv-icon name="search" size="60rpx" color="#666" @click="onSearch"></uv-icon>
                        <uv-icon name="plus-circle" size="50rpx" color="#2797ff" @click="onNewChat"
                            class="new-chat-btn"></uv-icon>
                    </view>
                </view>

                <!-- 搜索框区域 (条件显示) -->
                <view class="search-box" v-if="showSearch">
                    <view class="search-input">
                        <uv-icon name="search" size="32rpx" color="#999"></uv-icon>
                        <input type="text" v-model="searchKeyword" placeholder="搜索聊天记录" confirm-type="search"
                            @confirm="searchHistory" />
                        <uv-icon v-if="searchKeyword" name="close-circle" size="32rpx" color="#999"
                            @click="clearSearch"></uv-icon>
                    </view>
                </view>

                <!-- 历史记录列表区域 -->
                <scroll-view scroll-y class="history-list" :class="{ 'history-list-with-search': showSearch }"
                    @scrolltolower="loadMoreHistory">
                    <view class="history-item" v-for="(item, index) in filteredHistoryList" :key="index"
                        @click="selectConversation(item)"
                        :class="{ 'history-item-active': activeConversationId === item.id }">
                        <view class="history-icon">
                            <uv-icon name="chat-fill" size="44rpx" color="#2797ff"></uv-icon>
                        </view>
                        <view class="history-content">
                            <view class="history-title text-ellipsis">{{ getTitleFromContent(item) }}</view>
                            <view class="history-preview text-ellipsis">{{ getPreviewFromContent(item) }}</view>
                        </view>
                        <view class="history-time">{{ formatTime(item.lastUpdateTime) }}</view>
                    </view>

                    <!-- 暂无数据提示 -->
                    <view class="no-data" v-if="filteredHistoryList.length === 0">
                        <uv-icon name="empty-list" size="80rpx" color="#e0e0e0"></uv-icon>
                        <text>暂无聊天记录</text>
                    </view>

                    <!-- 加载更多 -->
                    <view class="load-more" v-if="hasMoreData && filteredHistoryList.length > 0">
                        <text>加载更多...</text>
                    </view>
                </scroll-view>

                <!-- 底部区域 -->
                <view class="sidebar-footer">
                    <view class="footer-btn" @click="clearAllHistory">
                        <uv-icon name="trash" size="36rpx" color="#666"></uv-icon>
                        <text>清空历史</text>
                    </view>
                    <view class="footer-btn" @click="closePanel">
                        <uv-icon name="close" size="36rpx" color="#666"></uv-icon>
                        <text>关闭</text>
                    </view>
                </view>
            </view>
        </uv-popup>
    </view>
</template>

<script>
export default {
    name: 'ChatHistorySidebar',
    data() {
        return {
            historyList: [],
            filteredHistoryList: [],
            activeConversationId: null,
            page: 1,
            pageSize: 20,
            total: 0,
            hasMoreData: false,
            showSearch: false,
            searchKeyword: ''
        };
    },
    methods: {
        // 打开侧边栏
        open() {
            this.$refs.popup.open();
            this.loadHistoryList();
        },

        // 关闭侧边栏
        closePanel() {
            this.$refs.popup.close();
        },

        // 加载历史记录列表
        loadHistoryList() {
            // 模拟API调用，实际使用时替换为真实接口调用
            // this.$api('getConversationList', { page: this.page, pageSize: this.pageSize })
            //   .then(res => {
            //     if(res.code == 200) {
            //       this.historyList = this.page === 1 ? res.data.rows : [...this.historyList, ...res.data.rows];
            //       this.filteredHistoryList = [...this.historyList];
            //       this.total = res.data.total;
            //       this.hasMoreData = this.historyList.length < this.total;
            //     }
            //   });

            // 模拟数据
            setTimeout(() => {
                const mockData = Array(10).fill(0).map((_, i) => ({
                    id: i + 1,
                    content: `对话内容示例 ${i + 1}`,
                    lastMessage: `这是最后一条消息的预览 ${i + 1}`,
                    lastUpdateTime: new Date(Date.now() - i * 3600000).getTime()
                }));

                this.historyList = this.page === 1 ? mockData : [...this.historyList, ...mockData];
                this.filteredHistoryList = [...this.historyList];
                this.total = 30;
                this.hasMoreData = this.historyList.length < this.total;
            }, 300);
        },

        // 加载更多历史记录
        loadMoreHistory() {
            if (!this.hasMoreData) return;
            this.page++;
            this.loadHistoryList();
        },

        // 选择一个会话
        selectConversation(item) {
            this.activeConversationId = item.id;
            this.$emit('select', item);
            this.closePanel();
        },

        // 新建聊天
        onNewChat() {
            uni.showModal({
                title: '新建聊天',
                content: '确定要开始一个新的对话吗？当前对话将会保存。',
                success: (res) => {
                    if (res.confirm) {
                        this.$emit('new');
                        this.closePanel();
                    }
                }
            });
        },

        // 清空所有历史
        clearAllHistory() {
            uni.showModal({
                title: '清空历史',
                content: '确定要清空所有聊天记录吗？此操作无法撤销！',
                success: (res) => {
                    if (res.confirm) {
                        // 实际应用中调用API
                        // this.$api('clearAllConversations').then(res => {
                        //   if(res.code == 200) {
                        //     this.historyList = [];
                        //     this.filteredHistoryList = [];
                        //     uni.showToast({ title: '已清空所有记录', icon: 'success' });
                        //   }
                        // });

                        // 模拟清空
                        this.historyList = [];
                        this.filteredHistoryList = [];
                        uni.showToast({ title: '已清空所有记录', icon: 'success' });
                    }
                }
            });
        },

        // 显示搜索框
        onSearch() {
            this.showSearch = !this.showSearch;
            if (!this.showSearch) {
                this.searchKeyword = '';
                this.filteredHistoryList = [...this.historyList];
            }
        },

        // 清除搜索
        clearSearch() {
            this.searchKeyword = '';
            this.filteredHistoryList = [...this.historyList];
        },

        // 搜索历史记录
        searchHistory() {
            if (!this.searchKeyword.trim()) {
                this.filteredHistoryList = [...this.historyList];
                return;
            }

            const keyword = this.searchKeyword.toLowerCase();
            this.filteredHistoryList = this.historyList.filter(item =>
                this.getTitleFromContent(item).toLowerCase().includes(keyword) ||
                this.getPreviewFromContent(item).toLowerCase().includes(keyword)
            );
        },

        // 从内容中获取标题
        getTitleFromContent(item) {
            // 根据实际数据结构调整
            return item.content || '新对话';
        },

        // 从内容中获取预览
        getPreviewFromContent(item) {
            // 根据实际数据结构调整
            return item.lastMessage || '无消息内容';
        },

        // 格式化时间
        formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();

            // 今天的消息显示时间
            if (date.toDateString() === now.toDateString()) {
                return this.formatTimeOnly(date);
            }

            // 昨天的消息
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) {
                return '昨天';
            }

            // 一周内的消息显示星期几
            const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
            const dayDiff = Math.floor((now - date) / (24 * 60 * 60 * 1000));
            if (dayDiff < 7) {
                return `星期${weekDays[date.getDay()]}`;
            }

            // 更早的消息显示日期
            return `${date.getMonth() + 1}月${date.getDate()}日`;
        },

        // 格式化时间（仅时分）
        formatTimeOnly(date) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    }
};
</script>

<style lang="scss" scoped>
.chat-history-sidebar {
    .sidebar-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #f9f9f9;
    }

    .sidebar-header {
        padding: calc(var(--status-bar-height) + 60rpx) 30rpx 20rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eaeaea;
        background-color: #fff;

        .sidebar-title {
            font-size: 36rpx;
            font-weight: 600;
            color: #333;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 20rpx;

            .new-chat-btn {
                margin-left: 30rpx;
            }
        }
    }

    .search-box {
        padding: 20rpx 30rpx;
        background-color: #fff;

        .search-input {
            display: flex;
            align-items: center;
            background-color: #f5f5f5;
            border-radius: 36rpx;
            padding: 12rpx 20rpx;

            input {
                flex: 1;
                margin: 0 10rpx;
                height: 60rpx;
                font-size: 28rpx;
            }
        }
    }

    .history-list {
        flex: 1;
        overflow: hidden;
        background-color: #fff;

        &-with-search {
            height: calc(100vh - 300rpx);
        }
    }

    .history-item {
        display: flex;
        padding: 24rpx 30rpx;
        border-bottom: 1px solid #f5f5f5;
        position: relative;

        &-active {
            background-color: #f0f9ff;
        }

        &:active {
            background-color: #f5f5f5;
        }

        .history-icon {
            margin-right: 20rpx;
            display: flex;
            align-items: center;
        }

        .history-content {
            flex: 1;
            overflow: hidden;

            .history-title {
                font-size: 30rpx;
                font-weight: 500;
                color: #333;
                margin-bottom: 8rpx;
            }

            .history-preview {
                font-size: 26rpx;
                color: #999;
            }
        }

        .history-time {
            font-size: 24rpx;
            color: #bbb;
            position: absolute;
            top: 24rpx;
            right: 30rpx;
        }
    }

    .no-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 100rpx 0;

        text {
            font-size: 28rpx;
            color: #999;
            margin-top: 20rpx;
        }
    }

    .load-more {
        text-align: center;
        padding: 20rpx 0;

        text {
            font-size: 26rpx;
            color: #999;
        }
    }

    .sidebar-footer {
        padding: 20rpx 30rpx;
        padding-bottom: calc(20rpx + constant(safe-area-inset-bottom)); /* iOS 11.0 以下 */
        padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); /* iOS 11.2 以上 */
        display: flex;
        justify-content: space-around;
        border-top: 1px solid #eaeaea;
        background-color: #fff;

        .footer-btn {
            display: flex;
            flex-direction: column;
            align-items: center;

            text {
                font-size: 24rpx;
                color: #666;
                margin-top: 8rpx;
            }

            &:active {
                opacity: 0.7;
            }
        }
    }

    .text-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>