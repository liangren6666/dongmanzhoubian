<template>
  <view class="confirm-page">

    <!-- 收货地址 -->
    <view class="address-card" @click="chooseAddress">
      <view v-if="selectedAddress" class="address-info">
        <view class="address-top">
          <text class="receiver-name">{{ selectedAddress.receiverName }}</text>
          <text class="receiver-phone">{{ selectedAddress.receiverPhone }}</text>
          <view v-if="selectedAddress.isDefault" class="default-tag">默认</view>
        </view>
        <text class="address-detail">{{ fullAddress(selectedAddress) }}</text>
      </view>
      <view v-else class="address-empty">
        <text class="address-empty-text">点击选择收货地址</text>
      </view>
      <view class="address-arrow">
        <icon-comp name="arrow" :size="32" color="#BFBFBF" />
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-card">
      <view class="card-title-bar">
        <text class="card-title">商品清单</text>
      </view>
      <view class="goods-item" v-for="item in cartItems" :key="item.id">
        <image class="goods-img" :src="fixImageUrl(item.productImage)" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-name">{{ item.productName }}</text>
          <view class="goods-bottom">
            <text class="goods-price">¥{{ item.price }}</text>
            <text class="goods-qty">×{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark-card">
      <text class="remark-label">买家留言</text>
      <input
        class="remark-input"
        v-model="remark"
        placeholder="选填，最多50个字"
        :maxlength="50"
        placeholder-class="remark-placeholder"
      />
    </view>

    <!-- 金额明细 -->
    <view class="summary-card">
      <view class="summary-row">
        <text class="summary-label">商品合计</text>
        <text class="summary-value">¥{{ totalAmount }}</text>
      </view>
      <view class="summary-row">
        <text class="summary-label">运费</text>
        <text class="summary-value free-shipping">免运费</text>
      </view>
      <view class="summary-row summary-total">
        <text class="summary-label-bold">实付金额</text>
        <text class="summary-value-bold">¥{{ totalAmount }}</text>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar">
      <view class="bottom-price-wrap">
        <text class="bottom-label">实付：</text>
        <text class="bottom-price">¥{{ totalAmount }}</text>
      </view>
      <view class="submit-btn" :class="{ disabled: submitting || !selectedAddress }" @click="submitOrder">
        <text class="submit-btn-text">{{ submitting ? '提交中...' : '提交订单' }}</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import IconComp from '@/components/icon.vue'
import { getCartList, getAddressList, createOrder } from '@/api/index.js'
import { fixImageUrl } from '@/utils/image.js'

const cartIds = ref([])
const cartItems = ref([])
const addressList = ref([])
const selectedAddress = ref(null)
const remark = ref('')
const submitting = ref(false)

const totalAmount = computed(() => {
  return cartItems.value
    .reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0)
    .toFixed(2)
})

function fullAddress(addr) {
  if (!addr) return ''
  return [addr.province, addr.city, addr.district, addr.detail].filter(Boolean).join(' ')
}

onLoad((options) => {
  if (options && options.cartIds) {
    cartIds.value = options.cartIds.split(',').map(Number)
  }
  loadCart()
  loadAddress()
})

function loadCart() {
  getCartList().then(res => {
    const all = res.data || []
    cartItems.value = cartIds.value.length
      ? all.filter(item => cartIds.value.includes(item.id))
      : all
  }).catch(() => {})
}

function loadAddress() {
  getAddressList().then(res => {
    addressList.value = res.data || []
    // 优先默认地址
    const def = addressList.value.find(a => a.isDefault)
    selectedAddress.value = def || addressList.value[0] || null
  }).catch(() => {})
}

function chooseAddress() {
  if (!addressList.value.length) {
    uni.navigateTo({ url: '/pages/address/edit' })
    return
  }
  // 弹出地址选择
  const names = addressList.value.map(a =>
    `${a.receiverName} ${a.receiverPhone} ${fullAddress(a)}`
  )
  uni.showActionSheet({
    itemList: names,
    success(res) {
      selectedAddress.value = addressList.value[res.tapIndex]
    }
  })
}

function submitOrder() {
  if (!selectedAddress.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }
  if (cartItems.value.length === 0) {
    uni.showToast({ title: '购物车为空', icon: 'none' })
    return
  }
  if (submitting.value) return
  submitting.value = true

  createOrder({
    addressId: selectedAddress.value.id,
    cartIds: cartIds.value,
    remark: remark.value
  }).then(res => {
    const orderId = res.data && res.data.orderId
    uni.showToast({ title: '下单成功', icon: 'success' })
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/order/list' })
    }, 1200)
  }).catch(() => {}).finally(() => {
    submitting.value = false
  })
}
</script>

<style scoped>
.confirm-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 140rpx;
}

.address-card {
  background-color: #FFFFFF;
  padding: 32rpx 24rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}
.address-card::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: repeating-linear-gradient(
    90deg,
    #E74860 0px, #E74860 8px,
    transparent 8px, transparent 16px
  );
}
.address-info {
  flex: 1;
}
.address-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12rpx;
}
.receiver-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #1A1A1A;
  margin-right: 16rpx;
}
.receiver-phone {
  font-size: 28rpx;
  color: #4A4A4A;
}
.default-tag {
  margin-left: 12rpx;
  background-color: #FFF0F2;
  border: 1rpx solid #E74860;
  border-radius: 6rpx;
  padding: 2rpx 10rpx;
  font-size: 20rpx;
  color: #E74860;
}
.address-detail {
  font-size: 26rpx;
  color: #8C8C8C;
  line-height: 1.5;
}
.address-empty {
  flex: 1;
  padding: 12rpx 0;
}
.address-empty-text {
  font-size: 28rpx;
  color: #8C8C8C;
}
.address-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-card {
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}
.card-title-bar {
  padding: 24rpx 24rpx 0;
  border-bottom: 1rpx solid #F5F5F5;
  padding-bottom: 20rpx;
}
.card-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #1A1A1A;
}
.goods-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #F5F5F5;
}
.goods-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.goods-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160rpx;
}
.goods-name {
  font-size: 28rpx;
  color: #1A1A1A;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.goods-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.goods-price {
  font-size: 30rpx;
  color: #E74860;
  font-weight: bold;
}
.goods-qty {
  font-size: 26rpx;
  color: #8C8C8C;
}

.remark-card {
  background-color: #FFFFFF;
  padding: 24rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.remark-label {
  font-size: 28rpx;
  color: #1A1A1A;
  width: 140rpx;
  flex-shrink: 0;
}
.remark-input {
  flex: 1;
  font-size: 28rpx;
  color: #1A1A1A;
  height: 60rpx;
}
.remark-placeholder {
  color: #BFBFBF;
  font-size: 28rpx;
}

.summary-card {
  background-color: #FFFFFF;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.summary-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
}
.summary-total {
  border-top: 1rpx solid #F5F5F5;
  margin-top: 8rpx;
  padding-top: 20rpx;
}
.summary-label {
  font-size: 28rpx;
  color: #4A4A4A;
}
.summary-value {
  font-size: 28rpx;
  color: #1A1A1A;
}
.free-shipping {
  color: #52C41A;
}
.summary-label-bold {
  font-size: 28rpx;
  font-weight: bold;
  color: #1A1A1A;
}
.summary-value-bold {
  font-size: 34rpx;
  font-weight: bold;
  color: #E74860;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: #FFFFFF;
  border-top: 1rpx solid #EAEAEA;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  z-index: 99;
}
.bottom-price-wrap {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.bottom-label {
  font-size: 26rpx;
  color: #4A4A4A;
}
.bottom-price {
  font-size: 40rpx;
  font-weight: bold;
  color: #E74860;
}
.submit-btn {
  height: 80rpx;
  padding: 0 60rpx;
  background-color: #E74860;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit-btn.disabled {
  background-color: #BFBFBF;
}
.submit-btn-text {
  font-size: 30rpx;
  color: #FFFFFF;
  font-weight: bold;
}
</style>
