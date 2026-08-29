<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-inner">
        <view class="nav-back" @click="goBack">
          <text class="nav-back-icon">‹</text>
        </view>
        <view class="search-box">
          <text class="search-icon-text">🔍</text>
          <input class="search-input" v-model="keyword" placeholder="搜索手办、服饰、周边..." placeholder-class="search-placeholder" confirm-type="search" @confirm="doSearch" />
        </view>
        <view class="search-btn" @click="doSearch">
          <text class="search-btn-text">搜索</text>
        </view>
      </view>
    </view>

    <!-- 搜索前：历史 + 热搜 -->
    <view class="search-body" v-if="!hasSearched">
      <!-- 搜索历史 -->
      <view class="history-section" v-if="history.length > 0">
        <view class="section-head">
          <text class="section-head-title">搜索历史</text>
          <view class="clear-btn" @click="clearHistory">
            <icon-comp name="close" :size="28" color="#BFBFBF" />
          </view>
        </view>
        <view class="tag-list">
          <view class="tag-item" v-for="(item, idx) in history" :key="idx" @click="clickTag(item)">
            <text class="tag-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view class="hot-section">
        <view class="section-head">
          <text class="section-head-title">热门搜索</text>
        </view>
        <view class="tag-list">
          <view class="tag-item" v-for="(item, idx) in hotList" :key="idx" @click="clickTag(item)">
            <text class="tag-text">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索后：结果 -->
    <view class="search-results" v-else>
      <view class="product-grid" v-if="products.length > 0">
        <product-card v-for="item in products" :key="item.id" :product="item" />
      </view>
      <empty-state v-else-if="!loading" icon="search" text="未找到相关商品" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onReachBottom } from '@dcloudio/uni-app'
import IconComp from '@/components/icon.vue'
import { getProductList } from '@/api/index.js'
import ProductCard from '@/components/product-card.vue'
import EmptyState from '@/components/empty-state.vue'

const HISTORY_KEY = 'searchHistory'
const MAX_HISTORY = 10

const statusBarHeight = ref(0)
const keyword = ref('')
const history = ref([])
const hasSearched = ref(false)
const products = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)

const hotList = ['路飞手办', '鬼灭之刃', '原神周边', '皮卡丘', '咒术回战', '进击的巨人', '龙猫', '你的名字']

function init() {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
  loadHistory()
}

init()

function loadHistory() {
  try {
    const raw = uni.getStorageSync(HISTORY_KEY)
    history.value = raw ? JSON.parse(raw) : []
  } catch (e) {
    history.value = []
  }
}

function saveHistory() {
  uni.setStorageSync(HISTORY_KEY, JSON.stringify(history.value))
}

function addHistory(kw) {
  const trimmed = kw.trim()
  if (!trimmed) return
  history.value = history.value.filter(h => h !== trimmed)
  history.value.unshift(trimmed)
  if (history.value.length > MAX_HISTORY) {
    history.value = history.value.slice(0, MAX_HISTORY)
  }
  saveHistory()
}

function clearHistory() {
  history.value = []
  uni.removeStorageSync(HISTORY_KEY)
}

function clickTag(tag) {
  keyword.value = tag
  doSearch()
}

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) {
    uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
    return
  }
  addHistory(kw)
  hasSearched.value = true
  page.value = 1
  hasMore.value = true
  await loadProducts(true)
}

onReachBottom(() => {
  if (hasSearched.value && hasMore.value && !loading.value) {
    loadProducts(false)
  }
})

async function loadProducts(reset) {
  if (reset) {
    page.value = 1
    hasMore.value = true
  }
  if (!hasMore.value) return
  loading.value = true
  try {
    const res = await getProductList({ keyword: keyword.value.trim(), page: page.value, pageSize })
    const d = res.data || {}
    const list = d.list || d || []
    if (reset) {
      products.value = list
    } else {
      products.value = [...products.value, ...list]
    }
    if (list.length < pageSize) {
      hasMore.value = false
    }
    page.value++
  } catch (e) {
    uni.showToast({ title: '搜索失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/index/index' }) })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.nav-bar {
  background: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 20rpx;
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-back-icon {
  font-size: 48rpx;
  color: #1A1A1A;
  font-weight: bold;
  line-height: 1;
}

.search-box {
  flex: 1;
  height: 64rpx;
  background: #F5F5F5;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}

.search-icon-text {
  font-size: 28rpx;
  flex-shrink: 0;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #1A1A1A;
  height: 64rpx;
}

.search-placeholder {
  color: #BFBFBF;
  font-size: 28rpx;
}

.search-btn {
  margin-left: 16rpx;
  flex-shrink: 0;
}

.search-btn-text {
  font-size: 28rpx;
  color: #E74860;
  font-weight: 500;
}

.search-body {
  padding: 32rpx 24rpx;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-head-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1A1A1A;
}

.clear-btn {
  padding: 8rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 12rpx 24rpx;
}

.tag-text {
  font-size: 24rpx;
  color: #4A4A4A;
}

.hot-section {
  margin-top: 48rpx;
}

.history-section {
  margin-bottom: 0;
}

.search-results {
  padding: 20rpx 24rpx;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.product-grid > view,
.product-grid > .product-card {
  width: calc(50% - 8rpx);
}
</style>
