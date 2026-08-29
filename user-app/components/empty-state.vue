<template>
  <view class="empty-state">
    <text class="empty-emoji">{{ emoji }}</text>
    <text class="empty-text">{{ text }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '暂无数据'
  },
  icon: {
    type: String,
    default: 'default'
  }
})

const emojiMap = {
  cart: '🛒',
  order: '📋',
  search: '🔍',
  address: '📍',
  bell: '📢',
  default: '📦'
}

const emoji = computed(() => emojiMap[props.icon] || emojiMap.default)
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}
.empty-emoji {
  font-size: 120rpx;
  line-height: 1.2;
}
.empty-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #8C8C8C;
}
</style>
