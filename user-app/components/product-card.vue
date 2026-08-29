<template>
  <view class="product-card" :class="{ 'product-card--compact': compact }" @click="goDetail">
    <image
      class="product-image"
      :src="fixImageUrl(product.mainImage)"
      mode="aspectFill"
    />
    <view class="product-info">
      <text class="product-name">{{ product.name }}</text>
      <view class="product-price-row">
        <text class="product-price">¥{{ product.price }}</text>
        <text
          v-if="product.originalPrice && Number(product.originalPrice) > Number(product.price)"
          class="product-original-price"
        >¥{{ product.originalPrice }}</text>
      </view>
      <text class="product-sales">已售 {{ product.sales || 0 }}</text>
    </view>
  </view>
</template>

<script setup>
import { fixImageUrl } from '@/utils/image.js'

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: () => ({})
  }
})

function goDetail() {
  uni.navigateTo({
    url: '/pages/product/detail?id=' + props.product.id
  })
}
</script>

<style scoped>
.product-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 0;
}
.product-image {
  width: 100%;
  height: 320rpx;
}
.product-info {
  padding: 16rpx;
}
.product-name {
  font-size: 28rpx;
  color: #1A1A1A;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
.product-price-row {
  display: flex;
  align-items: baseline;
  margin-top: 12rpx;
  gap: 8rpx;
}
.product-price {
  font-size: 32rpx;
  color: #E74860;
  font-weight: bold;
}
.product-original-price {
  font-size: 24rpx;
  color: #BFBFBF;
  text-decoration: line-through;
}
.product-sales {
  font-size: 22rpx;
  color: #8C8C8C;
  margin-top: 8rpx;
}

.product-card--compact {
  border-radius: 14rpx;
  box-shadow: 0 4rpx 14rpx rgba(39, 28, 31, 0.06);
}

.product-card--compact .product-image {
  width: 100%;
  height: 240rpx;
}

.product-card--compact .product-info {
  padding: 14rpx;
}

.product-card--compact .product-name {
  min-height: 66rpx;
  font-size: 25rpx;
  line-height: 1.32;
}

.product-card--compact .product-price-row {
  margin-top: 10rpx;
}

.product-card--compact .product-price {
  font-size: 30rpx;
}

.product-card--compact .product-original-price {
  font-size: 21rpx;
}
</style>
