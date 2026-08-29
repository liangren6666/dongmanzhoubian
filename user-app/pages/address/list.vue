<template>
  <view class="page">
    <view class="address-list" v-if="addresses.length > 0">
      <view class="address-card" v-for="item in addresses" :key="item.id">
        <view class="address-top">
          <view class="address-info">
            <text class="receiver-name">{{ item.receiver_name }}</text>
            <text class="receiver-phone">{{ item.receiver_phone }}</text>
            <view v-if="item.isDefault" class="default-tag">
              <text class="default-tag-text">默认</text>
            </view>
          </view>
          <text class="address-detail">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</text>
        </view>
        <view class="address-bottom">
          <view class="set-default" @click="handleSetDefault(item)" v-if="!item.isDefault">
            <view class="toggle-circle">
              <view class="toggle-inner"></view>
            </view>
            <text class="set-default-text">设为默认</text>
          </view>
          <view v-else class="set-default">
            <view class="toggle-circle active">
              <view class="toggle-inner active"></view>
            </view>
            <text class="set-default-text active">默认地址</text>
          </view>
          <view class="address-ops">
            <view class="op-item" @click="handleEdit(item)">
              <icon-comp name="edit" :size="28" color="#409EFF" />
              <text class="op-text">编辑</text>
            </view>
            <view class="op-item" @click="handleDelete(item)">
              <icon-comp name="trash" :size="28" color="#F56C6C" />
              <text class="op-text">删除</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <empty-state v-else-if="!loading" text="暂无收货地址" icon="address" />

    <!-- 底部新增按钮 -->
    <view class="bottom-btn-wrap">
      <view class="add-btn" @click="handleAdd">
        <text class="add-btn-text">新增收货地址</text>
      </view>
      <view class="safe-bottom"></view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import IconComp from '@/components/icon.vue'
import { getAddressList, deleteAddress, setDefaultAddress } from '@/api/index.js'
import EmptyState from '@/components/empty-state.vue'

const addresses = ref([])
const loading = ref(false)

onShow(() => {
  loadAddresses()
})

async function loadAddresses() {
  loading.value = true
  try {
    const res = await getAddressList()
    addresses.value = res.data || []
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function handleEdit(item) {
  uni.navigateTo({ url: '/pages/address/edit?id=' + item.id })
}

function handleAdd() {
  uni.navigateTo({ url: '/pages/address/edit' })
}

function handleDelete(item) {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteAddress(item.id)
          uni.showToast({ title: '已删除', icon: 'success' })
          loadAddresses()
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

async function handleSetDefault(item) {
  try {
    await setDefaultAddress(item.id)
    uni.showToast({ title: '设置成功', icon: 'success' })
    loadAddresses()
  } catch (e) {
    uni.showToast({ title: '设置失败', icon: 'none' })
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.address-list {
  padding-bottom: 20rpx;
}

.address-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 20rpx 24rpx;
  padding: 24rpx;
}

.address-top {
  padding-bottom: 20rpx;
}

.address-info {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.receiver-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #1A1A1A;
}

.receiver-phone {
  font-size: 28rpx;
  color: #8C8C8C;
  margin-left: 20rpx;
}

.default-tag {
  background: #FFF0F2;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  margin-left: 16rpx;
}

.default-tag-text {
  font-size: 22rpx;
  color: #E74860;
}

.address-detail {
  font-size: 28rpx;
  color: #4A4A4A;
  line-height: 1.5;
}

.address-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #F0F0F0;
  padding-top: 20rpx;
  margin-top: 0;
}

.set-default {
  display: flex;
  align-items: center;
}

.toggle-circle {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #BFBFBF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
}

.toggle-circle.active {
  border-color: #E74860;
}

.toggle-inner {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: transparent;
}

.toggle-inner.active {
  background: #E74860;
}

.set-default-text {
  font-size: 24rpx;
  color: #8C8C8C;
}

.set-default-text.active {
  color: #E74860;
}

.address-ops {
  display: flex;
  gap: 32rpx;
}

.op-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.op-text {
  font-size: 24rpx;
  color: #8C8C8C;
}

.bottom-space {
  height: 160rpx;
}

.bottom-btn-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  z-index: 999;
}

.add-btn {
  height: 88rpx;
  background: #E74860;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 30rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
