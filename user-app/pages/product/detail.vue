<template>
  <view class="page">
    <!-- 图片轮播 -->
    <swiper class="product-swiper" :indicator-dots="true" :circular="true" :autoplay="true" indicator-active-color="#E74860" indicator-color="rgba(255,255,255,0.5)">
      <swiper-item v-for="(img, idx) in imageList" :key="idx">
        <image class="swiper-image" :src="fixImageUrl(img)" mode="aspectFill" @click="previewImage(idx)" />
      </swiper-item>
    </swiper>

    <!-- 价格区域 -->
    <view class="card price-card">
      <view class="price-row">
        <view class="price-main">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ product.price }}</text>
          <text v-if="product.originalPrice && Number(product.originalPrice) > Number(product.price)" class="price-original">¥{{ product.originalPrice }}</text>
        </view>
        <view class="sales-stock">
          <text class="info-text">已售 {{ product.sales || 0 }}</text>
          <text class="info-text">库存 {{ product.stock || 0 }}</text>
        </view>
      </view>
    </view>

    <!-- 标题区域 -->
    <view class="card title-card">
      <text class="product-name">{{ product.name }}</text>
    </view>

    <!-- 商品详情 -->
    <view class="card desc-card">
      <view class="section-header">
        <view class="section-bar"></view>
        <text class="section-title">商品详情</text>
      </view>
      <text class="desc-text">{{ product.description }}</text>
    </view>

    <!-- 商品评价 -->
    <view class="card review-card">
      <view class="section-header" style="justify-content: space-between;">
        <view style="display: flex; align-items: center;">
          <view class="section-bar"></view>
          <text class="section-title">商品评价 ({{ reviewCount }}条)</text>
        </view>
        <view class="view-all" @click="scrollToReviews">
          <text class="view-all-text">查看全部</text>
          <icon-comp name="arrow" :size="24" color="#8C8C8C" />
        </view>
      </view>

      <view v-if="reviews.length > 0" class="review-list">
        <view class="review-item" v-for="item in reviews" :key="item.id">
          <view class="review-header">
            <view class="reviewer-info">
              <image class="reviewer-avatar" :src="getReviewAvatar(item)" mode="aspectFill" />
              <text class="reviewer-name">{{ getReviewNickname(item) }}</text>
            </view>
            <view class="star-rating">
              <text v-for="s in 5" :key="s" :class="s <= item.rating ? 'star-on' : 'star-off'">★</text>
            </view>
          </view>
          <text class="review-content">{{ item.content }}</text>
          <scroll-view v-if="parseImages(item.images).length > 0" scroll-x class="review-images">
            <image v-for="(img, i) in parseImages(item.images)" :key="i" class="review-img" :src="fixImageUrl(img)" mode="aspectFill" @click="previewReviewImage(parseImages(item.images), i)" />
          </scroll-view>
          <text class="review-date">{{ formatDate(item.createdAt) }}</text>
        </view>
      </view>
      <view v-else class="no-review">
        <text class="no-review-text">暂无评价</text>
      </view>
    </view>

    <view class="bottom-space"></view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bottom-bar-inner">
        <view class="bar-left">
          <view class="bar-icon-wrap" @click="goChat">
            <icon-comp name="phone" :size="48" color="#4A4A4A" />
            <text class="bar-icon-label">客服</text>
          </view>
          <view class="bar-icon-wrap" @click="goCart">
            <view class="cart-badge-wrap">
              <icon-comp name="cart" :size="36" color="#4A4A4A" />
              <view v-if="cartCount > 0" class="cart-badge">
                <text class="cart-badge-text">{{ cartCount > 99 ? '99+' : cartCount }}</text>
              </view>
            </view>
            <text class="bar-icon-label">购物车</text>
          </view>
        </view>
        <view class="bar-right">
          <view class="btn-add-cart" @click="handleAddCart">
            <text class="btn-add-cart-text">加入购物车</text>
          </view>
          <view class="btn-buy-now" @click="handleBuyNow">
            <text class="btn-buy-now-text">立即购买</text>
          </view>
        </view>
      </view>
      <view class="safe-bottom"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import IconComp from '@/components/icon.vue'
import { getProductDetail, getProductReviews, addToCart } from '@/api/index.js'
import { checkLogin } from '@/utils/auth.js'
import { fixImageUrl, fixAvatarUrl } from '@/utils/image.js'
import { useStore } from 'vuex'

const store = useStore()
const product = ref({})
const reviews = ref([])
const reviewCount = ref(0)
const productId = ref('')

const cartCount = computed(() => store.state.cartCount)

const imageList = computed(() => {
  if (!product.value.images) {
    return product.value.mainImage ? [product.value.mainImage] : []
  }
  try {
    const parsed = JSON.parse(product.value.images)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : (product.value.mainImage ? [product.value.mainImage] : [])
  } catch (e) {
    return product.value.mainImage ? [product.value.mainImage] : []
  }
})

onLoad((options) => {
  productId.value = options.id
  loadProduct()
  loadReviews()
  store.dispatch('fetchCartCount')
})

async function loadProduct() {
  try {
    uni.showLoading({ title: '加载中' })
    const res = await getProductDetail(productId.value)
    product.value = res.data || {}
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

async function loadReviews() {
  try {
    const res = await getProductReviews(productId.value, 1, 3)
    const d = res.data || {}
    reviews.value = d.list || d || []
    reviewCount.value = d.total || reviews.value.length
  } catch (e) {
    reviews.value = []
  }
}

function parseImages(images) {
  if (!images) return []
  if (Array.isArray(images)) return images
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

function getReviewNickname(item) {
  return (item.user && item.user.nickname) || item.nickname || '匿名用户'
}

function getReviewAvatar(item) {
  const avatar = (item.user && item.user.avatar) || item.avatar
  return fixAvatarUrl(avatar) || '/static/default-avatar.png'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.substring(0, 16).replace('T', ' ')
}

function previewImage(index) {
  uni.previewImage({ urls: imageList.value, current: index })
}

function previewReviewImage(urls, index) {
  uni.previewImage({ urls, current: index })
}

function scrollToReviews() {}

function goChat() {
  if (!checkLogin()) return
  const name = encodeURIComponent(product.value.name || '')
  uni.navigateTo({
    url: `/pages/chat/index?productId=${productId.value}&productName=${name}`
  })
}

function goCart() {
  uni.switchTab({ url: '/pages/cart/cart' })
}

async function handleAddCart() {
  if (!checkLogin()) return
  try {
    uni.showLoading({ title: '加载中' })
    await addToCart(product.value.id, 1)
    uni.showToast({ title: '已加入购物车', icon: 'success' })
    store.dispatch('fetchCartCount')
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

async function handleBuyNow() {
  if (!checkLogin()) return
  try {
    uni.showLoading({ title: '加载中' })
    await addToCart(product.value.id, 1)
    store.dispatch('fetchCartCount')
    uni.switchTab({ url: '/pages/cart/cart' })
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.product-swiper {
  width: 750rpx;
  height: 750rpx;
}

.swiper-image {
  width: 750rpx;
  height: 750rpx;
}

.card {
  background: #FFFFFF;
  margin-top: 16rpx;
  padding: 24rpx;
}

.price-card {
  margin-top: 0;
}

.price-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.price-main {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 32rpx;
  color: #E74860;
  font-weight: bold;
}

.price-value {
  font-size: 52rpx;
  color: #E74860;
  font-weight: bold;
  margin-left: 4rpx;
}

.price-original {
  font-size: 28rpx;
  color: #BFBFBF;
  text-decoration: line-through;
  margin-left: 16rpx;
}

.sales-stock {
  display: flex;
  gap: 20rpx;
}

.info-text {
  font-size: 24rpx;
  color: #8C8C8C;
}

.title-card {
  padding: 24rpx;
}

.product-name {
  font-size: 34rpx;
  font-weight: bold;
  color: #1A1A1A;
  line-height: 1.5;
}

.desc-card {
  padding: 24rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-bar {
  width: 4rpx;
  height: 28rpx;
  background: #E74860;
  border-radius: 2rpx;
  margin-right: 12rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1A1A1A;
}

.desc-text {
  font-size: 28rpx;
  color: #4A4A4A;
  line-height: 1.8;
  white-space: pre-wrap;
}

.review-card {
  padding: 24rpx;
}

.view-all {
  display: flex;
  align-items: center;
}

.view-all-text {
  font-size: 26rpx;
  color: #8C8C8C;
  margin-right: 4rpx;
}

.review-list {
  margin-top: 8rpx;
}

.review-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reviewer-info {
  display: flex;
  align-items: center;
}

.reviewer-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.reviewer-name {
  font-size: 24rpx;
  color: #8C8C8C;
}

.star-rating {
  display: flex;
  gap: 4rpx;
}
.star-on {
  font-size: 28rpx;
  color: #FFD700;
}
.star-off {
  font-size: 28rpx;
  color: #EAEAEA;
}

.review-content {
  font-size: 28rpx;
  color: #4A4A4A;
  margin-top: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
}

.review-images {
  margin-top: 12rpx;
  white-space: nowrap;
}

.review-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  margin-right: 12rpx;
  display: inline-block;
}

.review-date {
  font-size: 22rpx;
  color: #BFBFBF;
  margin-top: 12rpx;
}

.no-review {
  padding: 40rpx 0;
  text-align: center;
}

.no-review-text {
  font-size: 28rpx;
  color: #BFBFBF;
}

.bottom-space {
  height: 160rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #FFFFFF;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  z-index: 999;
}

.bottom-bar-inner {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
}

.bar-left {
  display: flex;
  align-items: center;
  margin-right: 20rpx;
}

.bar-icon-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 28rpx;
  position: relative;
}

.contact-btn {
  padding: 0;
  margin: 0;
  margin-right: 28rpx;
  background: transparent;
  border: none;
  line-height: normal;
}

.contact-btn::after {
  border: none;
}

.bar-icon-label {
  font-size: 20rpx;
  color: #4A4A4A;
  margin-top: 4rpx;
}

.cart-badge-wrap {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -16rpx;
  background: #E74860;
  border-radius: 20rpx;
  min-width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}

.cart-badge-text {
  font-size: 18rpx;
  color: #FFFFFF;
}

.bar-right {
  flex: 1;
  display: flex;
  gap: 16rpx;
}

.btn-add-cart {
  flex: 1;
  height: 76rpx;
  border: 2rpx solid #E74860;
  border-radius: 38rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-cart-text {
  font-size: 28rpx;
  color: #E74860;
  font-weight: 500;
}

.btn-buy-now {
  flex: 1;
  height: 76rpx;
  background: #E74860;
  border-radius: 38rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-buy-now-text {
  font-size: 28rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
