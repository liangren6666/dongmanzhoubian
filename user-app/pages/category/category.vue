<template>
  <view class="category-page">
    <!-- 搜索栏 -->
    <view class="search-bar" @click="goSearch">
      <view class="search-inner">
        <icon-comp class="search-icon" name="search" :size="32" color="#BFBFBF" />
        <text class="search-placeholder">搜索你想要的商品</text>
      </view>
    </view>

    <!-- 主体区域 -->
    <view class="main-area">
      <!-- 左侧分类栏 -->
      <scroll-view scroll-y class="sidebar" :show-scrollbar="false">
        <view
          class="sidebar-item"
          :class="{ active: currentCategoryId === null }"
          @click="selectCategory(null)"
        >
          <view class="sidebar-icon-wrap all-icon">
            <icon-comp name="grid" :size="28" :color="currentCategoryId === null ? '#E74860' : '#8C8C8C'" />
          </view>
          <text class="sidebar-text" :class="{ active: currentCategoryId === null }">全部</text>
        </view>
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="sidebar-item"
          :class="{ active: currentCategoryId === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <view class="sidebar-icon-wrap">
            <image class="sidebar-icon" :src="fixImageUrl(cat.icon)" mode="aspectFill" />
          </view>
          <text class="sidebar-text" :class="{ active: currentCategoryId === cat.id }">{{ cat.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧商品区 -->
      <scroll-view
        scroll-y
        class="content-area"
        :show-scrollbar="false"
        enable-flex
        @scrolltolower="loadMore"
        :scroll-top="scrollTop"
      >
        <!-- 排序栏 -->
        <view class="sort-bar">
          <view
            v-for="s in sortOptions"
            :key="s.field"
            class="sort-item"
            :class="{ active: sortField === s.field }"
            @click="changeSort(s.field)"
          >
            <text class="sort-text" :class="{ active: sortField === s.field }">{{ getSortLabel(s) }}</text>
            <view v-if="sortField === s.field" class="sort-underline"></view>
          </view>
          <text class="result-count">{{ products.length }}件</text>
        </view>

        <!-- 商品列表 -->
        <view class="product-grid" v-if="products.length">
          <view class="product-col" v-for="item in products" :key="item.id">
            <product-card :product="item" compact />
          </view>
          <view class="product-col product-col-placeholder" v-if="products.length % 2 === 1"></view>
        </view>

        <!-- 加载中 / 没有更多 -->
        <view class="load-status" v-if="products.length">
          <text class="load-text">{{ loadingMore ? '加载中...' : (noMore ? '没有更多了' : '') }}</text>
        </view>

        <!-- 空状态 -->
        <empty-state v-if="!loading && !products.length" text="暂无相关商品" icon="search" />
      </scroll-view>
    </view>

    <custom-tabbar :current="1" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import IconComp from '@/components/icon.vue'
import { getCategoryList, getProductList } from '@/api/index.js'
import ProductCard from '@/components/product-card.vue'
import EmptyState from '@/components/empty-state.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'
import { fixImageUrl } from '@/utils/image.js'

const categories = ref([])
const currentCategoryId = ref(null)
const products = ref([])
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const loadingMore = ref(false)
const noMore = ref(false)
const scrollTop = ref(0)

const sortField = ref('default')
const sortOrder = ref('desc')

const sortOptions = [
  { field: 'default', label: '综合' },
  { field: 'sales', label: '销量' },
  { field: 'price', label: '价格' }
]

function getSortLabel(s) {
  if (s.field === 'price' && sortField.value === 'price') {
    return sortOrder.value === 'asc' ? '价格↑' : '价格↓'
  }
  return s.label
}

onLoad(() => {
  loadCategories()
  loadProducts()
})

function loadCategories() {
  getCategoryList().then(res => {
    categories.value = res.data || []
  }).catch(() => {})
}

function selectCategory(id) {
  currentCategoryId.value = id
  resetAndLoad()
}

function changeSort(field) {
  if (sortField.value === field) {
    if (field === 'price') {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    }
  } else {
    sortField.value = field
    sortOrder.value = field === 'price' ? 'asc' : 'desc'
  }
  resetAndLoad()
}

function resetAndLoad() {
  page.value = 1
  noMore.value = false
  products.value = []
  scrollTop.value = 0
  loadProducts()
}

function loadProducts() {
  if (loading.value) return
  loading.value = true

  const params = {
    page: page.value,
    pageSize: pageSize
  }
  if (currentCategoryId.value) {
    params.categoryId = currentCategoryId.value
  }
  if (sortField.value !== 'default') {
    params.sortField = sortField.value
    params.sortOrder = sortOrder.value
  }

  getProductList(params).then(res => {
    const d = res.data || {}
    const list = d.list || d || []
    if (page.value === 1) {
      products.value = list
    } else {
      products.value = [...products.value, ...list]
    }
    if (list.length < pageSize) {
      noMore.value = true
    }
  }).catch(() => {}).finally(() => {
    loading.value = false
    loadingMore.value = false
  })
}

function loadMore() {
  if (noMore.value || loadingMore.value) return
  loadingMore.value = true
  page.value++
  loadProducts()
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}
</script>

<style scoped>
.category-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #F7F7F8;
  box-sizing: border-box;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.search-bar {
  flex-shrink: 0;
  padding: 12rpx 24rpx 16rpx;
  background-color: #FFFFFF;
}

.search-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #F5F5F5;
  border-radius: 32rpx;
  padding: 14rpx 24rpx;
  border: 1rpx solid #EEEEF0;
}

.search-icon {
  margin-right: 12rpx;
  flex-shrink: 0;
}

.search-placeholder {
  font-size: 26rpx;
  color: #BFBFBF;
}

.main-area {
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.sidebar {
  flex-shrink: 0;
  width: 168rpx;
  background-color: #FFFFFF;
  height: 100%;
  padding: 8rpx 10rpx 24rpx;
  box-sizing: border-box;
}

.sidebar-item {
  min-height: 108rpx;
  padding: 12rpx 6rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 14rpx;
  margin-bottom: 6rpx;
}

.sidebar-item.active {
  background-color: #FFF0F3;
}

.sidebar-icon-wrap {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #F7F7F8;
  overflow: hidden;
}

.sidebar-item.active .sidebar-icon-wrap {
  background-color: #FFFFFF;
}

.sidebar-icon {
  width: 100%;
  height: 100%;
}

.all-icon {
  overflow: visible;
}

.sidebar-text {
  width: 100%;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #4A4A4A;
  text-align: center;
}

.sidebar-text.active {
  color: #E74860;
  font-weight: bold;
}

.content-area {
  flex: 1;
  width: 0;
  min-width: 0;
  height: 100%;
  padding: 12rpx 16rpx 0;
  box-sizing: border-box;
}

.sort-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 70rpx;
  padding: 0 18rpx;
  gap: 26rpx;
  background-color: #FFFFFF;
  border-radius: 14rpx;
  margin-bottom: 12rpx;
  flex-shrink: 0;
}

.sort-item {
  position: relative;
  height: 70rpx;
  display: flex;
  align-items: center;
}

.sort-text {
  font-size: 24rpx;
  color: #4A4A4A;
}

.sort-text.active {
  color: #E74860;
  font-weight: bold;
}

.sort-underline {
  position: absolute;
  bottom: 5rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 32rpx;
  height: 4rpx;
  background-color: #E74860;
  border-radius: 2rpx;
}

.result-count {
  margin-left: auto;
  font-size: 20rpx;
  color: #B0B0B0;
}

.product-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 16rpx;
}

.product-col {
  width: 48%;
  margin-bottom: 14rpx;
  box-sizing: border-box;
}

.product-col-placeholder {
  height: 0;
  margin-bottom: 0;
  visibility: hidden;
}

.load-status {
  padding: 20rpx 0 36rpx;
  text-align: center;
}

.load-text {
  font-size: 24rpx;
  color: #BFBFBF;
}
</style>
