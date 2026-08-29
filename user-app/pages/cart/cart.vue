<template>
  <view class="cart-page">
    <!-- 未登录或空购物车 -->
    <view class="empty-wrap" v-if="!logged || (!loading && !cartList.length)">
      <empty-state icon="cart" :text="!logged ? '请先登录' : '购物车空空如也'" />
      <view class="empty-btn" @click="goShopping">
        <text class="empty-btn-text">{{ !logged ? '去登录' : '去逛逛' }}</text>
      </view>
    </view>

    <!-- 购物车列表 -->
    <view class="cart-list" v-if="logged && cartList.length">
      <view class="cart-item" v-for="item in cartList" :key="item.id">
        <!-- 选择框 -->
        <view class="checkbox" @click="toggleSelect(item)">
          <view v-if="item.selected" class="checkbox-checked">
            <text class="icon-check-text">✓</text>
          </view>
          <view v-else class="checkbox-unchecked"></view>
        </view>

        <!-- 商品图片 -->
        <image
          class="cart-img"
          :src="fixImageUrl(item.productImage)"
          mode="aspectFill"
          @click="goDetail(item.productId)"
        />

        <!-- 商品信息 -->
        <view class="cart-info">
          <text class="cart-name">{{ item.productName }}</text>
          <view class="cart-bottom">
            <text class="cart-price">¥{{ item.price }}</text>
            <view class="stepper">
              <view class="stepper-btn" :class="{ disabled: item.quantity <= 1 }" @click="changeQty(item, -1)">
                <text class="stepper-icon">－</text>
              </view>
              <text class="stepper-count">{{ item.quantity }}</text>
              <view class="stepper-btn" :class="{ disabled: item.quantity >= (item.stock || 99) }" @click="changeQty(item, 1)">
                <text class="stepper-icon">＋</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 删除 -->
        <view class="cart-delete" @tap.stop="handleDelete(item)">
          <text class="icon-delete-text">删除</text>
        </view>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar" v-if="logged && cartList.length" :style="{ bottom: '100rpx' }">
      <view class="bar-left" @click="toggleAll">
        <view v-if="isAllSelected" class="checkbox-checked checkbox-sm">
          <text class="icon-check-text-sm">✓</text>
        </view>
        <view v-else class="checkbox-unchecked checkbox-sm"></view>
        <text class="bar-all-text">全选</text>
      </view>
      <view class="bar-center">
        <text class="bar-total-label">合计: </text>
        <text class="bar-total-price">¥{{ totalPrice }}</text>
      </view>
      <view class="bar-btn" :class="{ disabled: selectedCount === 0 }" @click="goSettle">
        <text class="bar-btn-text">去结算({{ selectedCount }})</text>
      </view>
    </view>

    <custom-tabbar :current="2" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getCartList, updateCart, deleteCart, selectAllCart } from '@/api/index.js'
import { isLoggedIn } from '@/utils/auth.js'
import { useStore } from 'vuex'
import EmptyState from '@/components/empty-state.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'
import { fixImageUrl } from '@/utils/image.js'

const store = useStore()
const logged = ref(false)
const cartList = ref([])
const loading = ref(false)

const isAllSelected = computed(() => {
  if (!cartList.value.length) return false
  return cartList.value.every(item => item.selected)
})

const selectedCount = computed(() => {
  return cartList.value.filter(item => item.selected).reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return cartList.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0)
    .toFixed(2)
})

onShow(() => {
  logged.value = isLoggedIn()
  if (logged.value) {
    loadCart()
  }
})

function loadCart() {
  loading.value = true
  getCartList().then(res => {
    cartList.value = res.data || []
    store.dispatch('fetchCartCount')
  }).catch(() => {}).finally(() => {
    loading.value = false
  })
}

function toggleSelect(item) {
  const newSelected = !item.selected
  updateCart(item.id, item.quantity, newSelected ? 1 : 0).then(() => {
    item.selected = newSelected
  }).catch(() => {
    uni.showToast({ title: '操作失败', icon: 'none' })
  })
}

function toggleAll() {
  const newVal = !isAllSelected.value
  selectAllCart(newVal ? 1 : 0).then(() => {
    cartList.value.forEach(item => { item.selected = newVal })
  }).catch(() => {
    uni.showToast({ title: '操作失败', icon: 'none' })
  })
}

function changeQty(item, delta) {
  const newQty = item.quantity + delta
  if (newQty < 1 || newQty > (item.stock || 99)) return
  updateCart(item.id, newQty, item.selected ? 1 : 0).then(() => {
    item.quantity = newQty
    store.dispatch('fetchCartCount')
  }).catch(() => {
    uni.showToast({ title: '操作失败', icon: 'none' })
  })
}

function handleDelete(item) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该商品吗？',
    confirmColor: '#E74860',
    success(res) {
      if (res.confirm) {
        deleteCart(item.id).then(() => {
          cartList.value = cartList.value.filter(c => c.id !== item.id)
          store.dispatch('fetchCartCount')
          uni.showToast({ title: '已删除', icon: 'success' })
        }).catch((e) => {
          uni.showToast({ title: (e && e.message) || '删除失败', icon: 'none' })
        })
      }
    }
  })
}

function goShopping() {
  if (!logged.value) {
    uni.navigateTo({ url: '/pages/login/login' })
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}

function goDetail(id) {
  uni.navigateTo({ url: '/pages/product/detail?id=' + id })
}

function goSettle() {
  if (selectedCount.value === 0) return
  const selectedItems = cartList.value.filter(item => item.selected)
  const ids = selectedItems.map(item => item.id).join(',')
  uni.navigateTo({ url: '/pages/order/confirm?cartIds=' + ids })
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 220rpx;
}

.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100rpx;
}

.empty-btn {
  margin-top: 32rpx;
  width: 200rpx;
  height: 72rpx;
  border: 2rpx solid #E74860;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-btn-text {
  font-size: 28rpx;
  color: #E74860;
}

.cart-list {
  padding: 24rpx;
}

.cart-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
  position: relative;
}

.checkbox {
  margin-right: 20rpx;
  flex-shrink: 0;
}

.checkbox-checked {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #E74860;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-unchecked {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #EAEAEA;
  background-color: #FFFFFF;
}

.checkbox-sm {
  width: 36rpx;
  height: 36rpx;
}

.icon-check-text {
  font-size: 24rpx;
  color: #FFFFFF;
  font-weight: bold;
}

.icon-check-text-sm {
  font-size: 20rpx;
  color: #FFFFFF;
  font-weight: bold;
}

.cart-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.cart-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 180rpx;
}

.cart-name {
  font-size: 28rpx;
  color: #1A1A1A;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.cart-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.cart-price {
  font-size: 30rpx;
  color: #E74860;
  font-weight: bold;
}

.stepper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4rpx;
}

.stepper-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 1rpx solid #EAEAEA;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
}

.stepper-btn.disabled {
  opacity: 0.4;
}

.stepper-icon {
  font-size: 28rpx;
  color: #4A4A4A;
  line-height: 1;
}

.stepper-count {
  font-size: 28rpx;
  color: #1A1A1A;
  min-width: 56rpx;
  text-align: center;
}

.cart-delete {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  background-color: #F5F5F5;
}

.icon-delete-text {
  font-size: 22rpx;
  color: #8C8C8C;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24rpx;
  border-top: 1rpx solid #EAEAEA;
  z-index: 99;
}

.bar-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 24rpx;
}

.bar-all-text {
  font-size: 26rpx;
  color: #4A4A4A;
  margin-left: 12rpx;
}

.bar-center {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.bar-total-label {
  font-size: 26rpx;
  color: #4A4A4A;
}

.bar-total-price {
  font-size: 36rpx;
  color: #E74860;
  font-weight: bold;
}

.bar-btn {
  height: 76rpx;
  padding: 0 40rpx;
  background-color: #E74860;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar-btn.disabled {
  background-color: #BFBFBF;
}

.bar-btn-text {
  font-size: 28rpx;
  color: #FFFFFF;
  font-weight: bold;
}
</style>
