<template>
  <view class="profile-page">
    <!-- 顶部用户区域 -->
    <view class="header">
      <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
        <view class="nav-content" :style="{ height: navBarHeight + 'px' }">
          <text class="nav-title">我的</text>
        </view>
      </view>

      <view v-if="logged" class="user-info" @click="openEdit">
        <image
          class="avatar"
          :src="avatarUrl"
          mode="aspectFill"
          @error="onAvatarError"
        />
        <text class="nickname">{{ (userInfo && userInfo.nickname) || '用户' }}</text>
        <text class="phone">{{ maskPhone(userInfo && userInfo.phone) }}</text>
        <text class="edit-link">编辑资料 ></text>
      </view>
      <view v-else class="user-info" @click="goLogin">
        <view class="avatar-default">
          <icon-comp name="avatar" :size="60" color="#BFBFBF" />
        </view>
        <text class="login-text">点击登录</text>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="card order-card">
      <view class="card-header">
        <text class="card-title">我的订单</text>
        <view class="card-more" @click="goOrderList()">
          <text class="card-more-text">查看全部</text>
          <icon-comp name="arrow" :size="28" color="#8C8C8C" />
        </view>
      </view>
      <view class="order-status-row">
        <view class="order-status-item" @click="goOrderList(0)">
          <view class="order-icon-wrap">
            <icon-comp name="calendar" :size="48" color="#4A4A4A" />
            <view v-if="orderCounts[0]" class="order-badge"></view>
          </view>
          <text class="order-label">待付款</text>
        </view>
        <view class="order-status-item" @click="goOrderList(1)">
          <view class="order-icon-wrap">
            <icon-comp name="box" :size="48" color="#4A4A4A" />
            <view v-if="orderCounts[1]" class="order-badge"></view>
          </view>
          <text class="order-label">待发货</text>
        </view>
        <view class="order-status-item" @click="goOrderList(2)">
          <view class="order-icon-wrap">
            <icon-comp name="truck" :size="48" color="#4A4A4A" />
            <view v-if="orderCounts[2]" class="order-badge"></view>
          </view>
          <text class="order-label">待收货</text>
        </view>
        <view class="order-status-item" @click="goOrderList(3)">
          <view class="order-icon-wrap">
            <icon-comp name="check_circle" :size="48" color="#4A4A4A" />
            <view v-if="orderCounts[3]" class="order-badge"></view>
          </view>
          <text class="order-label">已完成</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="card func-card">
      <view class="cell-item" @click="goPage('/pages/address/list')">
        <view class="cell-left">
          <view class="cell-icon-wrap cell-icon-address">
            <icon-comp name="location" :size="36" color="#E74860" />
          </view>
          <text class="cell-text">收货地址</text>
        </view>
        <icon-comp name="arrow" :size="28" color="#BFBFBF" />
      </view>
      <view class="cell-item" @click="goChat">
        <view class="cell-left">
          <view class="cell-icon-wrap cell-icon-chat">
            <icon-comp name="phone" :size="36" color="#52C41A" />
          </view>
          <text class="cell-text">在线客服</text>
        </view>
        <icon-comp name="arrow" :size="28" color="#BFBFBF" />
      </view>
      <view class="cell-item" @click="goAnnouncement">
        <view class="cell-left">
          <view class="cell-icon-wrap cell-icon-notice">
            <icon-comp name="bell" :size="36" color="#FAAD14" />
          </view>
          <text class="cell-text">系统公告</text>
        </view>
        <icon-comp name="arrow" :size="28" color="#BFBFBF" />
      </view>
      <view class="cell-item cell-last" @click="showAbout">
        <view class="cell-left">
          <view class="cell-icon-wrap cell-icon-about">
            <icon-comp name="info" :size="36" color="#409EFF" />
          </view>
          <text class="cell-text">关于我们</text>
        </view>
        <icon-comp name="arrow" :size="28" color="#BFBFBF" />
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-card" v-if="logged" @click="handleLogout">
      <text class="logout-text">退出登录</text>
    </view>

    <!-- 编辑资料弹窗 -->
    <view class="popup-mask" v-if="showEditPopup" @click="showEditPopup = false">
      <view class="popup-content" @click.stop>
        <text class="popup-title">编辑资料</text>

        <view class="popup-field">
          <text class="popup-label">昵称</text>
          <input class="popup-input" v-model="editForm.nickname" placeholder="请输入昵称" placeholder-class="popup-placeholder" />
        </view>

        <view class="popup-field">
          <text class="popup-label">性别</text>
          <view class="gender-row">
            <view class="gender-item" :class="{ active: editForm.gender === 1 }" @click="editForm.gender = 1">
              <text class="gender-text">男</text>
            </view>
            <view class="gender-item" :class="{ active: editForm.gender === 2 }" @click="editForm.gender = 2">
              <text class="gender-text">女</text>
            </view>
            <view class="gender-item" :class="{ active: editForm.gender === 0 }" @click="editForm.gender = 0">
              <text class="gender-text">保密</text>
            </view>
          </view>
        </view>

        <view class="popup-field">
          <text class="popup-label">生日</text>
          <picker mode="date" :value="editForm.birthday" @change="onBirthdayChange">
            <view class="popup-picker">
              <text class="popup-picker-text" :class="{ placeholder: !editForm.birthday }">
                {{ editForm.birthday || '请选择生日' }}
              </text>
            </view>
          </picker>
        </view>

        <view class="popup-btns">
          <view class="popup-btn popup-btn-cancel" @click="showEditPopup = false">
            <text class="popup-btn-cancel-text">取消</text>
          </view>
          <view class="popup-btn popup-btn-confirm" @click="saveProfile">
            <text class="popup-btn-confirm-text">保存</text>
          </view>
        </view>
      </view>
    </view>

    <custom-tabbar :current="3" />
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getProfile, updateProfile, getOrderList } from '@/api/index.js'
import { isLoggedIn, getUserInfo, setUserInfo } from '@/utils/auth.js'
import { fixAvatarUrl } from '@/utils/image.js'
import { getNavBarInfo } from '@/utils/navbar.js'
import IconComp from '@/components/icon.vue'
import CustomTabbar from '@/components/custom-tabbar.vue'
import { useStore } from 'vuex'

const store = useStore()
const { statusBarHeight, navBarHeight } = getNavBarInfo()
const defaultAvatar = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#EAEAEA"/><circle cx="40" cy="30" r="12" fill="#BFBFBF"/><path d="M16 68c0-13.3 10.7-24 24-24s24 10.7 24 24" fill="#BFBFBF"/></svg>')

const logged = ref(false)
const userInfo = ref(null)
const showEditPopup = ref(false)
const avatarLoadFailed = ref(false)
const orderCounts = ref({ 0: 0, 1: 0, 2: 0, 3: 0 })

const avatarUrl = computed(() => {
  if (avatarLoadFailed.value) return defaultAvatar
  const url = userInfo.value?.avatar
  return fixAvatarUrl(url) || defaultAvatar
})

const editForm = reactive({
  nickname: '',
  gender: 0,
  birthday: ''
})

onShow(() => {
  logged.value = isLoggedIn()
  if (logged.value) {
    loadProfile()
    loadOrderCounts()
  } else {
    userInfo.value = null
  }
})

function loadProfile() {
  avatarLoadFailed.value = false
  getProfile().then(res => {
    userInfo.value = res.data
    store.commit('SET_USER_INFO', res.data)
    setUserInfo(res.data)
  }).catch(() => {
    userInfo.value = getUserInfo()
  })
}

function onAvatarError() {
  avatarLoadFailed.value = true
}

function loadOrderCounts() {
  [0, 1, 2, 3].forEach(status => {
    getOrderList(status, 1, 1).then(res => {
      const d = res.data || {}
      const total = d.total || (d.list || []).length || 0
      orderCounts.value[status] = total
    }).catch(() => {})
  })
}

function maskPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

function goLogin() {
  uni.navigateTo({ url: '/pages/login/login' })
}

function goOrderList(status) {
  if (!logged.value) { goLogin(); return }
  const url = status !== undefined ? '/pages/order/list?status=' + status : '/pages/order/list'
  uni.navigateTo({ url })
}

function goPage(url) {
  if (!logged.value) { goLogin(); return }
  uni.navigateTo({ url })
}

function goChat() {
  if (!logged.value) { goLogin(); return }
  uni.navigateTo({ url: '/pages/chat/index' })
}

function goAnnouncement() {
  uni.navigateTo({ url: '/pages/announcement/list' })
}

function showAbout() {
  uni.showModal({
    title: '关于我们',
    content: 'ACG周边商城 —— 发现你的二次元好物。致力于为动漫爱好者提供正版优质周边商品。',
    showCancel: false,
    confirmColor: '#E74860'
  })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    confirmColor: '#E74860',
    success(res) {
      if (res.confirm) {
        store.dispatch('logout')
      }
    }
  })
}

function onBirthdayChange(e) {
  editForm.birthday = e.detail.value
}

function saveProfile() {
  if (!editForm.nickname) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  updateProfile({
    nickname: editForm.nickname,
    gender: editForm.gender,
    birthday: editForm.birthday
  }).then(() => {
    uni.showToast({ title: '保存成功', icon: 'success' })
    showEditPopup.value = false
    loadProfile()
  }).catch(() => {
    uni.showToast({ title: '保存失败', icon: 'none' })
  })
}

// 打开编辑弹窗时初始化表单
function openEdit() {
  const info = userInfo.value || {}
  editForm.nickname = info.nickname || ''
  editForm.gender = info.gender || 0
  editForm.birthday = info.birthday || ''
  showEditPopup.value = true
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.header {
  background-color: #FFF0F2;
  padding-bottom: 48rpx;
  border-radius: 0 0 40rpx 40rpx;
}

.custom-nav {
  width: 100%;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #1A1A1A;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #FFFFFF;
  background-color: #FFFFFF;
}

.avatar-default {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #EAEAEA;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #1A1A1A;
  margin-top: 16rpx;
}

.phone {
  font-size: 28rpx;
  color: #8C8C8C;
  margin-top: 8rpx;
}

.edit-link {
  font-size: 24rpx;
  color: #8C8C8C;
  margin-top: 12rpx;
}

.login-text {
  font-size: 32rpx;
  color: #4A4A4A;
  margin-top: 16rpx;
}

.card {
  background-color: #FFFFFF;
  margin: 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.order-card {
  padding: 32rpx;
}

.card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1A1A1A;
}

.card-more {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.card-more-text {
  font-size: 24rpx;
  color: #8C8C8C;
}

.order-status-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.order-status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.order-icon-wrap {
  position: relative;
  width: 48rpx;
  height: 48rpx;
}

.order-badge {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #FF4D4F;
  border-radius: 50%;
}

.order-label {
  font-size: 22rpx;
  color: #4A4A4A;
}

.func-card {
  overflow: hidden;
}

.cell-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 108rpx;
  padding: 0 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.cell-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20rpx;
}

.cell-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cell-icon-address {
  background-color: #FFF0F2;
}

.cell-icon-chat {
  background-color: #F6FFED;
}

.cell-icon-notice {
  background-color: #FFF7E6;
}

.cell-icon-about {
  background-color: #E6F4FF;
}

.cell-last {
  border-bottom: none;
}

.cell-text {
  font-size: 28rpx;
  color: #1A1A1A;
}

.logout-card {
  margin: 48rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.logout-text {
  font-size: 28rpx;
  color: #FF4D4F;
}

/* 编辑弹窗 */
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  width: 600rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 48rpx 40rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1A1A1A;
  text-align: center;
  margin-bottom: 40rpx;
}

.popup-field {
  margin-bottom: 32rpx;
}

.popup-label {
  font-size: 26rpx;
  color: #4A4A4A;
  margin-bottom: 16rpx;
  display: block;
}

.popup-input {
  width: 100%;
  height: 80rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #1A1A1A;
}

.popup-placeholder {
  color: #BFBFBF;
}

.gender-row {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
}

.gender-item {
  flex: 1;
  height: 72rpx;
  border: 2rpx solid #EAEAEA;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gender-item.active {
  border-color: #E74860;
  background-color: #FFF0F2;
}

.gender-text {
  font-size: 26rpx;
  color: #4A4A4A;
}

.gender-item.active .gender-text {
  color: #E74860;
}

.popup-picker {
  height: 80rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
}

.popup-picker-text {
  font-size: 28rpx;
  color: #1A1A1A;
}

.popup-picker-text.placeholder {
  color: #BFBFBF;
}

.popup-btns {
  display: flex;
  flex-direction: row;
  gap: 24rpx;
  margin-top: 40rpx;
}

.popup-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-btn-cancel {
  border: 2rpx solid #EAEAEA;
}

.popup-btn-cancel-text {
  font-size: 28rpx;
  color: #4A4A4A;
}

.popup-btn-confirm {
  background-color: #E74860;
}

.popup-btn-confirm-text {
  font-size: 28rpx;
  color: #FFFFFF;
  font-weight: bold;
}
</style>
