<template>
  <view class="page">
    <view class="content-wrap" v-if="detail.id">
      <view class="detail-card">
        <view class="detail-badge">
          <icon-comp name="bell" :size="36" color="#E74860" />
        </view>
        <text class="detail-title">{{ detail.title }}</text>
        <view class="detail-meta">
          <text class="meta-tag">官方公告</text>
          <text class="detail-date">{{ formatDate(detail.createdAt) }}</text>
        </view>
        <view class="divider"></view>
        <text class="detail-content">{{ detail.content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import IconComp from '@/components/icon.vue'
import { getAnnouncementDetail } from '@/api/index.js'

const detail = ref({})

onLoad(async (options) => {
  if (options.id) {
    await loadDetail(options.id)
  }
})

async function loadDetail(id) {
  try {
    uni.showLoading({ title: '加载中' })
    const res = await getAnnouncementDetail(id)
    detail.value = res.data || {}
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.substring(0, 16).replace('T', ' ')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
  padding: 24rpx;
  box-sizing: border-box;
}

.content-wrap {
  padding-bottom: 40rpx;
}

.detail-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.05);
}

.detail-badge {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: #FFF0F2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.detail-title {
  font-size: 38rpx;
  font-weight: bold;
  color: #1A1A1A;
  line-height: 1.5;
  display: block;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 20rpx;
}

.meta-tag {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  background: #FFF0F2;
  color: #E74860;
  font-size: 22rpx;
}

.detail-date {
  font-size: 24rpx;
  color: #BFBFBF;
}

.divider {
  height: 1rpx;
  background: linear-gradient(90deg, #F0F0F0 0%, rgba(240, 240, 240, 0) 100%);
  margin: 32rpx 0;
}

.detail-content {
  font-size: 30rpx;
  color: #4A4A4A;
  line-height: 2;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
