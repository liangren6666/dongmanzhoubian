<template>
  <view class="tabbar" :style="{ paddingBottom: safeBottom + 'px' }">
    <view
      v-for="(tab, index) in tabs"
      :key="index"
      class="tabbar-item"
      @click="switchTab(index)"
    >
      <view class="tabbar-icon-wrap">
        <icon-comp :name="current === index ? tab.activeIcon : tab.icon" :size="36" :color="current === index ? '#E74860' : '#8C8C8C'" />
        <view v-if="index === 2 && cartCount > 0" class="tabbar-badge">
          <text class="tabbar-badge-text">{{ cartCount > 99 ? '99+' : cartCount }}</text>
        </view>
      </view>
      <text class="tabbar-text" :style="{ color: current === index ? '#E74860' : '#8C8C8C' }">
        {{ tab.text }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import IconComp from '@/components/icon.vue'

const props = defineProps({
  current: { type: Number, default: 0 }
})

const store = useStore()
const cartCount = computed(() => store.state.cartCount)

const safeBottom = ref(0)
uni.getSystemInfo({
  success(res) {
    safeBottom.value = (res.safeAreaInsets && res.safeAreaInsets.bottom) || 0
  }
})

const tabs = [
  { text: '首页', url: '/pages/index/index', icon: 'home', activeIcon: 'home-fill' },
  { text: '分类', url: '/pages/category/category', icon: 'grid', activeIcon: 'grid-fill' },
  { text: '购物车', url: '/pages/cart/cart', icon: 'bag', activeIcon: 'bag-fill' },
  { text: '我的', url: '/pages/profile/profile', icon: 'user', activeIcon: 'user-fill' }
]

function switchTab(index) {
  if (index === props.current) return
  uni.switchTab({ url: tabs[index].url })
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 14rpx;
  border-top: 1rpx solid #EAEAEA;
  z-index: 999;
}
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  position: relative;
}
.tabbar-icon-wrap {
  position: relative;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tabbar-text {
  font-size: 20rpx;
  line-height: 1;
}
.tabbar-badge {
  position: absolute;
  top: -8rpx;
  right: -16rpx;
  min-width: 28rpx;
  height: 28rpx;
  background-color: #E74860;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}
.tabbar-badge-text {
  color: #FFFFFF;
  font-size: 18rpx;
  line-height: 1;
}
</style>
