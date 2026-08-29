<template>
  <view class="index-page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content" :style="{ height: navBarHeight + 'px', paddingRight: capsuleRight + 'px' }">
        <text class="nav-title">ACG商城</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-section">
      <swiper class="banner-swiper" autoplay circular :interval="4000" indicator-dots indicator-active-color="#E74860" indicator-color="rgba(0,0,0,0.15)">
        <swiper-item v-for="(img, idx) in bannerList" :key="idx">
          <image class="banner-img" :src="fixImageUrl(img)" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </view>

    <!-- 公告栏 -->
    <view class="notice-bar" @click="goAnnouncement" v-if="announcement">
      <icon-comp class="notice-icon" name="bell" :size="36" color="#E74860" />
      <view class="notice-text-wrap">
        <text class="notice-text">{{ announcement }}</text>
      </view>
      <icon-comp class="notice-arrow" name="arrow" :size="28" color="#E74860" />
    </view>

    <!-- 分类导航 -->
    <scroll-view scroll-x class="category-scroll" v-if="categories.length">
      <view class="category-list">
        <view class="category-item" v-for="item in categories" :key="item.id" @click="goCategory(item)">
          <image class="category-icon" :src="fixImageUrl(item.icon)" mode="aspectFill" />
          <text class="category-name">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 限时特惠 -->
    <view class="section-header" v-if="dealProducts.length">
      <view class="section-title-wrap">
        <view class="section-bar section-bar-deal"></view>
        <text class="section-title">限时特惠</text>
      </view>
      <text class="section-tip">每日精选好价</text>
    </view>
    <view class="deal-list" v-if="dealProducts.length">
      <view class="deal-card" v-for="item in dealProducts" :key="item.id" @click="goProduct(item.id)">
        <image class="deal-image" :src="fixImageUrl(item.mainImage)" mode="aspectFill" />
        <view class="deal-info">
          <text class="deal-tag">{{ getDiscount(item) }}折</text>
          <text class="deal-name">{{ item.name }}</text>
          <view class="deal-price-row">
            <text class="deal-price">¥{{ item.price }}</text>
            <text class="deal-original">¥{{ item.originalPrice }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热销榜单 -->
    <view class="section-header" v-if="hotProducts.length">
      <view class="section-title-wrap">
        <view class="section-bar section-bar-hot"></view>
        <text class="section-title">热销榜单</text>
      </view>
      <text class="section-tip">大家都在买</text>
    </view>
    <view class="hot-list" v-if="hotProducts.length">
      <view class="hot-item" v-for="(item, index) in hotProducts" :key="item.id" @click="goProduct(item.id)">
        <text class="hot-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</text>
        <image class="hot-image" :src="fixImageUrl(item.mainImage)" mode="aspectFill" />
        <view class="hot-info">
          <text class="hot-name">{{ item.name }}</text>
          <text class="hot-sales">已售 {{ item.sales || 0 }} 件</text>
        </view>
        <text class="hot-price">¥{{ item.price }}</text>
      </view>
    </view>

    <!-- 最新发布 -->
    <view class="section-header" v-if="latestProducts.length">
      <view class="section-title-wrap">
        <view class="section-bar section-bar-new"></view>
        <text class="section-title">最新发布</text>
      </view>
      <view class="section-more" @click="goMore">
        <text class="section-more-text">查看更多</text>
        <icon-comp name="arrow" :size="28" color="#8C8C8C" />
      </view>
    </view>
    <scroll-view scroll-x class="latest-scroll" v-if="latestProducts.length">
      <view class="latest-list">
        <view class="latest-item" v-for="item in latestProducts" :key="item.id" @click="goProduct(item.id)">
          <view class="latest-img-wrap">
            <image class="latest-img" :src="fixImageUrl(item.mainImage)" mode="aspectFill" />
            <view class="latest-new-tag">NEW</view>
          </view>
          <text class="latest-name">{{ item.name }}</text>
          <text class="latest-price">¥{{ item.price }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 猜你喜欢 -->
    <view class="section-header">
      <view class="section-title-wrap">
        <view class="section-bar"></view>
        <text class="section-title">猜你喜欢</text>
      </view>
      <view class="section-more" @click="goMore">
        <text class="section-more-text">查看更多</text>
        <icon-comp name="arrow" :size="28" color="#8C8C8C" />
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-grid">
      <view class="product-col" v-for="item in recommendProducts" :key="item.id">
        <product-card :product="item" />
      </view>
    </view>

    <!-- 服务保障 -->
    <view class="service-panel">
      <view class="service-item">
        <icon-comp name="check_circle" :size="34" color="#E74860" />
        <view><text class="service-title">正品保障</text><text class="service-desc">品质周边</text></view>
      </view>
      <view class="service-item">
        <icon-comp name="truck" :size="34" color="#E74860" />
        <view><text class="service-title">快速发货</text><text class="service-desc">安心送达</text></view>
      </view>
      <view class="service-item">
        <icon-comp name="box" :size="34" color="#E74860" />
        <view><text class="service-title">售后无忧</text><text class="service-desc">贴心服务</text></view>
      </view>
    </view>

    <view class="bottom-space"></view>
    <custom-tabbar :current="0" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { getHomeData, getRecommendProducts, getLatestProducts, getCategoryList, getProductList } from '@/api/index.js'
import IconComp from '@/components/icon.vue'
import ProductCard from '@/components/product-card.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'
import { fixImageUrl } from '@/utils/image.js'
import { getNavBarInfo } from '@/utils/navbar.js'

const { statusBarHeight, navBarHeight, capsuleRight } = getNavBarInfo()

const bannerList = ref([
  '/static/banners/banner-figure-wide.png',
  '/static/banners/banner-stationery-wide.png',
  '/static/banners/banner-plush-wide.png'
])

const announcement = ref('')
const categories = ref([])
const latestProducts = ref([])
const recommendProducts = ref([])
const dealProducts = ref([])
const hotProducts = ref([])

function loadData() {
  getHomeData().then(res => {
    const data = res.data || {}
    const annList = data.announcements && data.announcements.list ? data.announcements.list : (Array.isArray(data.announcements) ? data.announcements : [])
    if (annList.length) {
      announcement.value = annList[0].title || annList[0]
    }
    if (data.categories && data.categories.length) {
      categories.value = data.categories
    }
    if (data.latestProducts && data.latestProducts.length) {
      latestProducts.value = data.latestProducts
    }
    if (data.recommendProducts && data.recommendProducts.length) {
      recommendProducts.value = data.recommendProducts
    }
  }).catch(() => {})

  if (!categories.value.length) {
    getCategoryList().then(res => {
      if (res.data && res.data.length) {
        categories.value = res.data
      }
    }).catch(() => {})
  }

  if (!latestProducts.value.length) {
    getLatestProducts(6).then(res => {
      if (res.data && res.data.length) {
        latestProducts.value = res.data
      }
    }).catch(() => {})
  }

  if (!recommendProducts.value.length) {
    getRecommendProducts(4).then(res => {
      if (res.data && res.data.length) {
        recommendProducts.value = res.data
      }
    }).catch(() => {})
  }

  getProductList({ page: 1, pageSize: 15 }).then(res => {
    const data = res.data || {}
    const list = Array.isArray(data) ? data : (data.list || [])
    dealProducts.value = [...list]
      .filter(item => Number(item.originalPrice) > Number(item.price))
      .sort((a, b) => (Number(a.price) / Number(a.originalPrice)) - (Number(b.price) / Number(b.originalPrice)))
      .slice(0, 2)
    hotProducts.value = [...list]
      .sort((a, b) => Number(b.sales || 0) - Number(a.sales || 0))
      .slice(0, 3)
  }).catch(() => {})
}

onLoad(() => {
  loadData()
})

onPullDownRefresh(() => {
  loadData()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 800)
})

function goAnnouncement() {
  uni.navigateTo({ url: '/pages/announcement/list' })
}

function goCategory(item) {
  uni.switchTab({ url: '/pages/category/category' })
}

function goMore() {
  uni.switchTab({ url: '/pages/category/category' })
}

function goProduct(id) {
  uni.navigateTo({ url: '/pages/product/detail?id=' + id })
}

function getDiscount(item) {
  const original = Number(item.originalPrice)
  const price = Number(item.price)
  if (!original || original <= price) return 10
  return (price / original * 10).toFixed(1)
}
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.nav-bar {
  background-color: #FFFFFF;
}

.nav-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 32rpx;
  box-sizing: border-box;
  min-height: 44px;
}

.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #E74860;
  line-height: 1;
}

.banner-section {
  padding: 12rpx 24rpx 0;
}

.banner-swiper {
  width: 100%;
  height: 320rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 320rpx;
  border-radius: 16rpx;
}

.notice-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #FFF0F2;
  border-radius: 12rpx;
  margin: 24rpx;
  padding: 16rpx 24rpx;
}

.notice-icon {
  flex-shrink: 0;
  margin-right: 12rpx;
}

.notice-text-wrap {
  flex: 1;
  overflow: hidden;
}

.notice-text {
  font-size: 24rpx;
  color: #4A4A4A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice-arrow {
  flex-shrink: 0;
  margin-left: 8rpx;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 24rpx;
  margin-bottom: 12rpx;
}

.category-list {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  padding: 16rpx 0;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100rpx;
  flex-shrink: 0;
}

.category-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #FFFFFF;
}

.category-name {
  font-size: 22rpx;
  color: #4A4A4A;
  margin-top: 8rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100rpx;
}

.section-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 24rpx 12rpx;
}

.section-title-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.section-bar {
  width: 6rpx;
  height: 32rpx;
  background-color: #E74860;
  border-radius: 3rpx;
  margin-right: 12rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1A1A1A;
}

.section-more {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.section-more-text {
  font-size: 24rpx;
  color: #8C8C8C;
}

.section-bar-new {
  background-color: #4A90E2;
}

.section-bar-deal {
  background-color: #FF8A3D;
}

.section-bar-hot {
  background-color: #FFB020;
}

.section-tip {
  font-size: 22rpx;
  color: #A6A6A6;
}

.deal-list {
  display: flex;
  flex-direction: row;
  padding: 0 24rpx 8rpx;
  gap: 16rpx;
}

.deal-card {
  width: calc(50% - 8rpx);
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 0;
  padding: 14rpx;
  background-color: #FFFFFF;
  border-radius: 14rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.deal-image {
  width: 112rpx;
  height: 112rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
  background-color: #F8F8F8;
}

.deal-info {
  flex: 1;
  min-width: 0;
  margin-left: 12rpx;
}

.deal-tag {
  display: inline-block;
  padding: 2rpx 8rpx;
  border-radius: 6rpx;
  background-color: #FFF0E6;
  color: #F06B22;
  font-size: 18rpx;
}

.deal-name {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deal-price-row {
  display: flex;
  align-items: baseline;
  margin-top: 8rpx;
}

.deal-price {
  font-size: 27rpx;
  font-weight: bold;
  color: #E74860;
}

.deal-original {
  margin-left: 6rpx;
  font-size: 18rpx;
  color: #BFBFBF;
  text-decoration: line-through;
}

.hot-list {
  margin: 0 24rpx 8rpx;
  padding: 0 18rpx;
  background-color: #FFFFFF;
  border-radius: 14rpx;
}

.hot-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 120rpx;
  border-bottom: 1rpx solid #F1F1F1;
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-rank {
  width: 42rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #BFBFBF;
  text-align: center;
  flex-shrink: 0;
}

.hot-rank.rank-1 { color: #F3A719; }
.hot-rank.rank-2 { color: #8FA1B2; }
.hot-rank.rank-3 { color: #C9875B; }

.hot-image {
  width: 88rpx;
  height: 88rpx;
  margin-left: 8rpx;
  border-radius: 10rpx;
  background-color: #F8F8F8;
  flex-shrink: 0;
}

.hot-info {
  flex: 1;
  min-width: 0;
  margin-left: 16rpx;
}

.hot-name {
  display: block;
  font-size: 24rpx;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hot-sales {
  display: block;
  margin-top: 8rpx;
  font-size: 20rpx;
  color: #9A9A9A;
}

.hot-price {
  margin-left: 12rpx;
  font-size: 27rpx;
  font-weight: bold;
  color: #E74860;
  flex-shrink: 0;
}

.latest-scroll {
  white-space: nowrap;
  padding: 0 24rpx 8rpx;
}

.latest-list {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
  padding-bottom: 8rpx;
}

.latest-item {
  display: inline-flex;
  flex-direction: column;
  width: 220rpx;
  flex-shrink: 0;
}

.latest-img-wrap {
  position: relative;
  width: 220rpx;
  height: 220rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: #FFFFFF;
}

.latest-img {
  width: 100%;
  height: 100%;
}

.latest-new-tag {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  background: linear-gradient(135deg, #4A90E2, #357ABD);
  color: #FFFFFF;
  font-size: 18rpx;
  font-weight: bold;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  letter-spacing: 1rpx;
}

.latest-name {
  font-size: 24rpx;
  color: #1A1A1A;
  margin-top: 12rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.latest-price {
  font-size: 28rpx;
  font-weight: bold;
  color: #E74860;
  margin-top: 4rpx;
}

.product-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 24rpx;
  gap: 20rpx;
}

.product-col {
  width: calc(50% - 10rpx);
}

.service-panel {
  display: flex;
  flex-direction: row;
  margin: 12rpx 24rpx 20rpx;
  padding: 22rpx 12rpx;
  background-color: #FFFFFF;
  border-radius: 14rpx;
}

.service-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.service-item > view {
  margin-left: 8rpx;
}

.service-title,
.service-desc {
  display: block;
}

.service-title {
  font-size: 21rpx;
  color: #4A4A4A;
  font-weight: bold;
}

.service-desc {
  margin-top: 3rpx;
  font-size: 17rpx;
  color: #A0A0A0;
}

.bottom-space {
  height: 40rpx;
}
</style>
