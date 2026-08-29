<template>
  <view class="page">
    <view class="top-banner">
      <view class="banner-deco banner-deco-1"></view>
      <view class="banner-deco banner-deco-2"></view>
      <view class="banner-content">
        <view class="banner-icon">
          <icon-comp name="bell" :size="48" color="#E74860" />
        </view>
        <view class="banner-text">
          <text class="banner-title">商城动态</text>
          <text class="banner-subtitle">活动通知 · 上新资讯 · 服务说明</text>
        </view>
      </view>
    </view>

    <view class="announcement-list" v-if="list.length > 0">
      <view
        class="announcement-card"
        v-for="(item, index) in list"
        :key="item.id"
        @click="goDetail(item)"
      >
        <view class="card-icon" :class="'theme-' + (index % 3)">
          <icon-comp name="bell" :size="40" :color="themeColors[index % 3]" />
        </view>
        <view class="card-body">
          <view class="card-top">
            <text class="card-title">{{ item.title }}</text>
            <view v-if="isNew(item.createdAt)" class="new-badge">NEW</view>
          </view>
          <text class="card-preview">{{ getPreview(item.content) }}</text>
          <view class="card-footer">
            <text class="card-date">{{ formatDate(item.createdAt) }}</text>
            <view class="card-more">
              <text class="card-more-text">查看详情</text>
              <icon-comp name="arrow" :size="24" color="#E74860" />
            </view>
          </view>
        </view>
      </view>

      <view class="list-footer">
        <text class="footer-text">{{ hasMore ? '上拉加载更多' : '— 已经到底啦 —' }}</text>
      </view>
    </view>

    <view v-else-if="loading" class="loading-wrap">
      <text class="loading-text">加载中...</text>
    </view>

    <empty-state v-else text="暂无公告，敬请期待" icon="bell" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'
import IconComp from '@/components/icon.vue'
import EmptyState from '@/components/empty-state.vue'
import { getAnnouncementList } from '@/api/index.js'

const list = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)

const themeColors = ['#E74860', '#FAAD14', '#409EFF']

onShow(() => {
  page.value = 1
  hasMore.value = true
  loadList(true)
})

onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    loadList(false)
  }
})

async function loadList(reset) {
  if (reset) {
    page.value = 1
    hasMore.value = true
  }
  if (!hasMore.value) return
  loading.value = true
  try {
    const res = await getAnnouncementList(page.value, pageSize)
    const d = res.data || {}
    const data = d.list || d || []
    if (reset) {
      list.value = data
    } else {
      list.value = [...list.value, ...data]
    }
    if (data.length < pageSize) {
      hasMore.value = false
    }
    page.value++
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const text = dateStr.substring(0, 16).replace('T', ' ')
  const date = new Date(text.replace(/-/g, '/'))
  if (Number.isNaN(date.getTime())) return text
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = (today - target) / (24 * 60 * 60 * 1000)
  if (diff === 0) return `今天 ${text.slice(11, 16)}`
  if (diff === 1) return `昨天 ${text.slice(11, 16)}`
  return text
}

function getPreview(content) {
  if (!content) return '点击查看公告详情'
  const text = content.replace(/\s+/g, ' ').trim()
  return text.length > 48 ? `${text.slice(0, 48)}...` : text
}

function isNew(dateStr) {
  if (!dateStr) return false
  const date = new Date(dateStr.replace(/-/g, '/').replace('T', ' '))
  if (Number.isNaN(date.getTime())) return false
  const diff = Date.now() - date.getTime()
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000
}

function goDetail(item) {
  uni.navigateTo({ url: '/pages/announcement/detail?id=' + item.id })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 40rpx;
}

.top-banner {
  position: relative;
  margin: 24rpx 24rpx 8rpx;
  padding: 32rpx 28rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #FFF0F2 0%, #FFFFFF 55%, #FFF7E6 100%);
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(231, 72, 96, 0.08);
}

.banner-deco {
  position: absolute;
  border-radius: 50%;
  opacity: 0.35;
}

.banner-deco-1 {
  width: 160rpx;
  height: 160rpx;
  right: -40rpx;
  top: -50rpx;
  background: rgba(231, 72, 96, 0.15);
}

.banner-deco-2 {
  width: 100rpx;
  height: 100rpx;
  left: -20rpx;
  bottom: -30rpx;
  background: rgba(250, 173, 20, 0.18);
}

.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.banner-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(231, 72, 96, 0.12);
}

.banner-title {
  display: block;
  font-size: 34rpx;
  font-weight: bold;
  color: #1A1A1A;
}

.banner-subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #8C8C8C;
}

.announcement-list {
  padding: 8rpx 0 20rpx;
}

.announcement-card {
  display: flex;
  gap: 20rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  margin: 20rpx 24rpx 0;
  padding: 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.card-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.theme-0 {
  background: #FFF0F2;
}

.theme-1 {
  background: #FFF7E6;
}

.theme-2 {
  background: #E6F4FF;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-top {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.card-title {
  flex: 1;
  font-size: 30rpx;
  color: #1A1A1A;
  font-weight: bold;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.new-badge {
  flex-shrink: 0;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #FF6B81, #E74860);
  color: #FFFFFF;
  font-size: 20rpx;
  font-weight: bold;
  line-height: 1.4;
}

.card-preview {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #8C8C8C;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid #F5F5F5;
}

.card-date {
  font-size: 22rpx;
  color: #BFBFBF;
}

.card-more {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.card-more-text {
  font-size: 22rpx;
  color: #E74860;
}

.list-footer {
  padding: 32rpx 0 12rpx;
  text-align: center;
}

.footer-text {
  font-size: 24rpx;
  color: #C0C4CC;
}

.loading-wrap {
  padding: 120rpx 0;
  text-align: center;
}

.loading-text {
  font-size: 28rpx;
  color: #8C8C8C;
}
</style>
