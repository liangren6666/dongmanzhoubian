<template>
  <view class="login-page">
    <view :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 顶部轮播 -->
    <swiper class="banner-swiper" autoplay circular :interval="3000" indicator-dots indicator-active-color="#E74860" indicator-color="rgba(255,255,255,0.5)">
      <swiper-item v-for="(img, idx) in banners" :key="idx">
        <image class="banner-img" :src="fixImageUrl(img)" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <view class="banner-fade"></view>

    <!-- Logo -->
    <view class="logo-area">
      <text class="logo-title">ACG周边商城</text>
      <text class="logo-subtitle">发现你的二次元好物</text>
    </view>

    <!-- Tab 切换 -->
    <view class="tab-switch">
      <view class="tab-item" :class="{ active: currentTab === 'login' }" @click="currentTab = 'login'">
        <text class="tab-text" :class="{ active: currentTab === 'login' }">登录</text>
        <view class="tab-line" v-if="currentTab === 'login'"></view>
      </view>
      <view class="tab-item" :class="{ active: currentTab === 'register' }" @click="currentTab = 'register'">
        <text class="tab-text" :class="{ active: currentTab === 'register' }">注册</text>
        <view class="tab-line" v-if="currentTab === 'register'"></view>
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="form-area" v-if="currentTab === 'login'">
      <view class="input-wrap">
        <view class="input-icon">
          <icon-comp name="phone" :size="36" color="#BFBFBF" />
        </view>
        <input class="input-field" type="number" maxlength="11" v-model="loginForm.phone" placeholder="请输入手机号" placeholder-class="input-placeholder" />
      </view>
      <view class="input-wrap">
        <view class="input-icon">
          <icon-comp name="lock" :size="36" color="#BFBFBF" />
        </view>
        <input class="input-field" type="password" v-model="loginForm.password" placeholder="请输入密码" placeholder-class="input-placeholder" password />
      </view>
      <view class="btn-primary" @click="handleLogin">
        <text class="btn-text">登录</text>
      </view>
      <text class="agreement-text">登录即代表同意《用户服务协议》</text>
    </view>

    <!-- 注册表单 -->
    <view class="form-area" v-else>
      <view class="input-wrap">
        <view class="input-icon">
          <icon-comp name="phone" :size="36" color="#BFBFBF" />
        </view>
        <input class="input-field" type="number" maxlength="11" v-model="registerForm.phone" placeholder="请输入手机号" placeholder-class="input-placeholder" />
      </view>
      <view class="input-wrap">
        <view class="input-icon">
          <icon-comp name="lock" :size="36" color="#BFBFBF" />
        </view>
        <input class="input-field" type="password" v-model="registerForm.password" placeholder="请输入密码" placeholder-class="input-placeholder" password />
      </view>
      <view class="input-wrap">
        <view class="input-icon">
          <icon-comp name="lock" :size="36" color="#BFBFBF" />
        </view>
        <input class="input-field" type="password" v-model="registerForm.confirmPassword" placeholder="请确认密码" placeholder-class="input-placeholder" password />
      </view>
      <view class="input-wrap">
        <view class="input-icon">
          <icon-comp name="user" :size="36" color="#BFBFBF" />
        </view>
        <input class="input-field" v-model="registerForm.nickname" placeholder="请输入昵称" placeholder-class="input-placeholder" />
      </view>
      <view class="btn-primary" @click="handleRegister">
        <text class="btn-text">注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import IconComp from '@/components/icon.vue'
import { ref, reactive } from 'vue'
import { login, register } from '@/api/index.js'
import { setToken, setUserInfo } from '@/utils/auth.js'
import { useStore } from 'vuex'
import { fixImageUrl } from '@/utils/image.js'

const store = useStore()
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight

const currentTab = ref('login')

const banners = [
  '/static/banners/banner-figure-wide.png',
  '/static/banners/banner-stationery-wide.png',
  '/static/banners/banner-plush-wide.png'
]

const loginForm = reactive({ phone: '', password: '' })
const registerForm = reactive({ phone: '', password: '', confirmPassword: '', nickname: '' })

const loading = ref(false)

function handleLogin() {
  if (loading.value) return
  if (!/^1\d{10}$/.test(loginForm.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!loginForm.password) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  loading.value = true
  store.dispatch('login', { phone: loginForm.phone, password: loginForm.password }).then(() => {
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 500)
  }).catch(err => {
    uni.showToast({ title: (err && err.data && err.data.message) || '登录失败', icon: 'none' })
  }).finally(() => {
    loading.value = false
  })
}

function handleRegister() {
  if (loading.value) return
  if (!/^1\d{10}$/.test(registerForm.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!registerForm.password) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }
  if (!registerForm.nickname) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  loading.value = true
  register(registerForm.phone, registerForm.password, registerForm.nickname).then(() => {
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      currentTab.value = 'login'
      loginForm.phone = registerForm.phone
      loginForm.password = ''
    }, 500)
  }).catch(err => {
    uni.showToast({ title: (err && err.data && err.data.message) || '注册失败', icon: 'none' })
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  position: relative;
}

.banner-swiper {
  width: 100%;
  height: 300rpx;
}

.banner-img {
  width: 100%;
  height: 300rpx;
}

.banner-fade {
  height: 60rpx;
  margin-top: -60rpx;
  background: linear-gradient(to bottom, rgba(255,255,255,0), #FFFFFF);
  position: relative;
  z-index: 1;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0 48rpx;
}

.logo-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #E74860;
}

.logo-subtitle {
  font-size: 26rpx;
  color: #8C8C8C;
  margin-top: 12rpx;
}

.tab-switch {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 80rpx;
  margin-bottom: 48rpx;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 12rpx;
}

.tab-text {
  font-size: 32rpx;
  color: #8C8C8C;
}

.tab-text.active {
  color: #1A1A1A;
  font-weight: bold;
}

.tab-line {
  position: absolute;
  bottom: 0;
  width: 48rpx;
  height: 4rpx;
  background-color: #E74860;
  border-radius: 2rpx;
}

.form-area {
  padding: 0 60rpx;
}

.input-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  padding: 0 24rpx;
  height: 88rpx;
  margin-bottom: 24rpx;
}

.input-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  height: 88rpx;
  font-size: 28rpx;
  color: #1A1A1A;
}

.input-placeholder {
  color: #BFBFBF;
  font-size: 28rpx;
}

.btn-primary {
  width: 100%;
  height: 88rpx;
  background-color: #E74860;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 48rpx;
}

.btn-primary:active {
  opacity: 0.85;
}

.btn-text {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: bold;
}

.agreement-text {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #BFBFBF;
  margin-top: 32rpx;
}
</style>
