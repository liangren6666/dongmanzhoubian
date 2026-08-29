<template>
  <view class="page">
    <!-- 顶部选项卡 -->
    <scroll-view scroll-x class="tabs-scroll">
      <view class="tabs">
        <view v-for="tab in tabs" :key="tab.value" class="tab-item" :class="{ active: currentTab === tab.value }" @click="switchTab(tab.value)">
          <text class="tab-text" :class="{ active: currentTab === tab.value }">{{ tab.label }}</text>
          <view v-if="currentTab === tab.value" class="tab-line"></view>
        </view>
      </view>
    </scroll-view>

    <!-- 订单列表 -->
    <view class="order-list" v-if="orders.length > 0">
      <view class="order-card" v-for="order in orders" :key="order.id">
        <view class="order-header">
          <text class="order-no">{{ order.orderNo }}</text>
          <text class="order-status" :style="{ color: statusColor(order.status) }">{{ statusText(order.status) }}</text>
        </view>

        <view class="order-items">
          <view class="order-product" v-for="(item, idx) in order.items" :key="idx">
            <image class="product-image" :src="fixImageUrl(item.productImage)" mode="aspectFill" />
            <view class="product-info">
              <text class="product-name">{{ item.productName }}</text>
              <view class="product-bottom">
                <text class="product-price">¥{{ item.price }}</text>
                <text class="product-qty">×{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="order-footer">
          <text class="order-total">共{{ totalQty(order.items) }}件商品  合计: <text class="total-amount">¥{{ order.payAmount }}</text></text>
        </view>

        <view class="order-actions" v-if="[0, 2, 3].includes(order.status)">
          <template v-if="order.status === 0">
            <view class="action-btn outline-grey" @click="handleCancel(order)">
              <text class="action-btn-text grey">取消订单</text>
            </view>
            <view class="action-btn filled" @click="handlePay(order)">
              <text class="action-btn-text white">去支付</text>
            </view>
          </template>
          <template v-if="order.status === 2">
            <view class="action-btn filled" @click="handleConfirm(order)">
              <text class="action-btn-text white">确认收货</text>
            </view>
          </template>
          <template v-if="order.status === 3">
            <view v-if="getUnreviewedItem(order)" class="action-btn outline-primary" @click="openReview(order)">
              <text class="action-btn-text primary">去评价</text>
            </view>
            <view v-else class="action-btn outline-grey">
              <text class="action-btn-text grey">已评价</text>
            </view>
            <view class="action-btn filled" @click="handleBuyAgain(order)">
              <text class="action-btn-text white">再次购买</text>
            </view>
          </template>
        </view>
      </view>
    </view>

    <empty-state v-else-if="!loading" text="暂无订单" icon="order" />

    <!-- 评价弹窗 -->
    <view class="review-mask" v-if="showReview" @click="showReview = false">
      <view class="review-popup" @click.stop>
        <text class="review-popup-title">商品评价</text>
        <view v-if="reviewItem" class="review-product">
          <image class="review-product-image" :src="fixImageUrl(reviewItem.productImage)" mode="aspectFill" />
          <text class="review-product-name">{{ reviewItem.productName }}</text>
        </view>
        <view class="review-stars">
          <view v-for="s in 5" :key="s" @click="reviewRating = s" class="star-touch">
            <text :class="s <= reviewRating ? 'star-on' : 'star-off'">★</text>
          </view>
        </view>
        <textarea class="review-textarea" v-model="reviewContent" placeholder="请输入评价内容" maxlength="500" />
        <view class="review-submit" @click="submitReview">
          <text class="review-submit-text">提交评价</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { getOrderList, cancelOrder, confirmReceive, payOrder, addReview, addToCart } from '@/api/index.js'
import { checkLogin } from '@/utils/auth.js'
import { useStore } from 'vuex'
import EmptyState from '@/components/empty-state.vue'
import { fixImageUrl } from '@/utils/image.js'

const store = useStore()

const tabs = [
  { label: '全部', value: -1 },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 3 }
]

const currentTab = ref(-1)
const orders = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)

const showReview = ref(false)
const reviewRating = ref(5)
const reviewContent = ref('')
const reviewOrder = ref(null)
const reviewItem = ref(null)

onLoad((options) => {
  if (options.status !== undefined) {
    currentTab.value = Number(options.status)
  }
})

onShow(() => {
  page.value = 1
  hasMore.value = true
  loadOrders(true)
})

onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    loadOrders(false)
  }
})

async function loadOrders(reset) {
  if (reset) {
    page.value = 1
    hasMore.value = true
  }
  if (!hasMore.value) return
  loading.value = true
  try {
    const status = currentTab.value === -1 ? undefined : currentTab.value
    const res = await getOrderList(status, page.value, pageSize)
    const d = res.data || {}
    const list = d.list || d || []
    list.forEach(o => {
      if (o.reviewed) o._reviewed = true
      if (!o._reviewed && o.reviewedProductIds && o.items) {
        o._reviewed = o.items.every(item => (o.reviewedProductIds || []).includes(item.productId))
      }
    })
    if (reset) {
      orders.value = list
    } else {
      orders.value = [...orders.value, ...list]
    }
    if (list.length < pageSize) {
      hasMore.value = false
    }
    page.value++
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function switchTab(val) {
  currentTab.value = val
  page.value = 1
  hasMore.value = true
  loadOrders(true)
}

function statusText(status) {
  const map = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消' }
  return map[status] || ''
}

function statusColor(status) {
  const map = { 0: '#FAAD14', 1: '#E74860', 2: '#4A4A4A', 3: '#52C41A', 4: '#BFBFBF' }
  return map[status] || '#8C8C8C'
}

function totalQty(items) {
  return (items || []).reduce((sum, i) => sum + (i.quantity || 1), 0)
}

function handleCancel(order) {
  uni.showModal({
    title: '提示',
    content: '确定取消该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelOrder(order.id)
          uni.showToast({ title: '已取消', icon: 'success' })
          loadOrders(true)
        } catch (e) {
          uni.showToast({ title: '操作失败', icon: 'none' })
        }
      }
    }
  })
}

async function handlePay(order) {
  try {
    await payOrder(order.id)
    uni.showToast({ title: '支付成功', icon: 'success' })
    loadOrders(true)
  } catch (e) {
    uni.showToast({ title: '支付失败', icon: 'none' })
  }
}

function handleConfirm(order) {
  uni.showModal({
    title: '提示',
    content: '确认已收到商品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await confirmReceive(order.id)
          uni.showToast({ title: '已确认收货', icon: 'success' })
          loadOrders(true)
        } catch (e) {
          uni.showToast({ title: '操作失败', icon: 'none' })
        }
      }
    }
  })
}

function getUnreviewedItem(order) {
  const reviewedIds = order.reviewedProductIds || []
  return (order.items || []).find(item => !reviewedIds.includes(item.productId))
}

function openReview(order) {
  const item = getUnreviewedItem(order)
  if (!item) {
    uni.showToast({ title: '该订单已评价完成', icon: 'none' })
    return
  }
  reviewOrder.value = order
  reviewItem.value = item
  reviewRating.value = 5
  reviewContent.value = ''
  showReview.value = true
}

async function submitReview() {
  if (!reviewContent.value.trim()) {
    uni.showToast({ title: '请输入评价内容', icon: 'none' })
    return
  }
  if (!reviewItem.value) {
    uni.showToast({ title: '评价商品不存在', icon: 'none' })
    return
  }
  try {
    await addReview({
      orderId: reviewOrder.value.id,
      productId: reviewItem.value.productId,
      rating: reviewRating.value,
      content: reviewContent.value
    })
    uni.showToast({ title: '评价成功', icon: 'success' })
    showReview.value = false
    loadOrders(true)
  } catch (e) {
    const msg = (e && e.message) || '评价失败'
    showReview.value = false
    if (msg.indexOf('已评价') !== -1) {
      uni.showToast({ title: '该商品已评价过了', icon: 'none' })
    } else {
      uni.showToast({ title: msg, icon: 'none' })
    }
    loadOrders(true)
  }
}

async function handleBuyAgain(order) {
  if (!checkLogin()) return
  try {
    for (const item of (order.items || [])) {
      await addToCart(item.productId, item.quantity || 1)
    }
    store.dispatch('fetchCartCount')
    uni.switchTab({ url: '/pages/cart/cart' })
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.tabs-scroll {
  background: #FFFFFF;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tabs {
  display: flex;
  padding: 0 8rpx;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 32rpx;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: #4A4A4A;
}

.tab-text.active {
  color: #E74860;
  font-weight: 500;
}

.tab-line {
  width: 40rpx;
  height: 4rpx;
  background: #E74860;
  border-radius: 2rpx;
  margin-top: 8rpx;
}

.order-list {
  padding-bottom: 20rpx;
}

.order-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 20rpx 24rpx;
  padding: 24rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-no {
  font-size: 24rpx;
  color: #8C8C8C;
}

.order-status {
  font-size: 26rpx;
  font-weight: 500;
}

.order-items {
  border-top: 1rpx solid #F0F0F0;
  padding-top: 16rpx;
}

.order-product {
  display: flex;
  margin-bottom: 16rpx;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  color: #1A1A1A;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 28rpx;
  color: #E74860;
  font-weight: 500;
}

.product-qty {
  font-size: 24rpx;
  color: #8C8C8C;
}

.order-footer {
  text-align: right;
  padding-top: 16rpx;
  border-top: 1rpx solid #F0F0F0;
}

.order-total {
  font-size: 26rpx;
  color: #4A4A4A;
}

.total-amount {
  color: #E74860;
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  margin-top: 20rpx;
}

.action-btn {
  height: 60rpx;
  padding: 0 28rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.outline-grey {
  border: 1rpx solid #BFBFBF;
}

.outline-primary {
  border: 1rpx solid #E74860;
}

.filled {
  background: #E74860;
}

.action-btn-text {
  font-size: 24rpx;
}

.action-btn-text.grey {
  color: #8C8C8C;
}

.action-btn-text.primary {
  color: #E74860;
}

.action-btn-text.white {
  color: #FFFFFF;
}

/* 评价弹窗 */
.review-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-popup {
  width: 600rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 40rpx;
}

.review-popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1A1A1A;
  text-align: center;
  margin-bottom: 24rpx;
}

.review-product {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
  padding: 16rpx;
  background: #F7F7F8;
  border-radius: 12rpx;
}

.review-product-image {
  width: 96rpx;
  height: 96rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.review-product-name {
  flex: 1;
  font-size: 26rpx;
  color: #1A1A1A;
  line-height: 1.4;
}

.review-stars {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.star-touch {
  padding: 8rpx;
}
.star-on {
  font-size: 48rpx;
  color: #FFD700;
}
.star-off {
  font-size: 48rpx;
  color: #EAEAEA;
}

.review-textarea {
  width: 100%;
  height: 200rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #1A1A1A;
  box-sizing: border-box;
}

.review-submit {
  margin-top: 32rpx;
  height: 80rpx;
  background: #E74860;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-submit-text {
  font-size: 30rpx;
  color: #FFFFFF;
  font-weight: 500;
}
</style>
