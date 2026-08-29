<template>
  <view class="page">
    <view class="form">
      <!-- 收货人 -->
      <view class="form-item">
        <text class="form-label">收货人</text>
        <input class="form-input" v-model="form.receiver_name" placeholder="请输入收货人姓名" placeholder-class="placeholder" />
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" v-model="form.receiver_phone" type="number" placeholder="请输入手机号" placeholder-class="placeholder" maxlength="11" />
      </view>

      <!-- 所在地区 -->
      <view class="form-item">
        <text class="form-label">所在地区</text>
        <picker mode="region" :value="regionValue" @change="onRegionChange">
          <view class="region-picker">
            <text :class="['region-text', regionSelected ? '' : 'placeholder']">{{ regionDisplay }}</text>
            <icon-comp name="arrow" :size="28" color="#BFBFBF" />
          </view>
        </picker>
      </view>

      <!-- 详细地址 -->
      <view class="form-item textarea-item">
        <text class="form-label">详细地址</text>
        <textarea class="form-textarea" v-model="form.detail" placeholder="请输入详细地址（街道、门牌号等）" placeholder-class="placeholder" maxlength="200" />
      </view>

      <!-- 设为默认 -->
      <view class="form-item switch-item">
        <text class="switch-label">设为默认地址</text>
        <switch :checked="form.isDefault" @change="form.isDefault = $event.detail.value" color="#E74860" />
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-btn-wrap">
      <view class="save-btn" @click="handleSave">
        <text class="save-btn-text">保存</text>
      </view>
      <view class="safe-bottom"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import IconComp from '@/components/icon.vue'
import { getAddressList, addAddress, updateAddress } from '@/api/index.js'

const addressId = ref('')
const form = reactive({
  receiver_name: '',
  receiver_phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const regionValue = computed(() => {
  return [form.province || '', form.city || '', form.district || '']
})

const regionSelected = computed(() => {
  return !!(form.province && form.city && form.district)
})

const regionDisplay = computed(() => {
  if (regionSelected.value) {
    return `${form.province} ${form.city} ${form.district}`
  }
  return '请选择省/市/区'
})

onLoad(async (options) => {
  if (options.id) {
    addressId.value = options.id
    uni.setNavigationBarTitle({ title: '编辑地址' })
    await loadAddress(options.id)
  } else {
    uni.setNavigationBarTitle({ title: '新增地址' })
  }
})

async function loadAddress(id) {
  try {
    uni.showLoading({ title: '加载中' })
    const res = await getAddressList()
    const list = res.data || []
    const target = list.find(item => String(item.id) === String(id))
    if (target) {
      form.receiver_name = target.receiver_name || ''
      form.receiver_phone = target.receiver_phone || ''
      form.province = target.province || ''
      form.city = target.city || ''
      form.district = target.district || ''
      form.detail = target.detail || ''
      form.isDefault = !!target.isDefault
    }
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

function onRegionChange(e) {
  const val = e.detail.value
  form.province = val[0] || ''
  form.city = val[1] || ''
  form.district = val[2] || ''
}

function validate() {
  if (!form.receiver_name.trim()) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return false
  }
  if (!/^1\d{10}$/.test(form.receiver_phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return false
  }
  if (!form.province || !form.city || !form.district) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' })
    return false
  }
  if (!form.detail.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return false
  }
  return true
}

async function handleSave() {
  if (!validate()) return
  const data = {
    receiver_name: form.receiver_name.trim(),
    receiver_phone: form.receiver_phone,
    province: form.province,
    city: form.city,
    district: form.district,
    detail: form.detail.trim(),
    isDefault: form.isDefault ? 1 : 0
  }

  try {
    uni.showLoading({ title: '保存中' })
    if (addressId.value) {
      await updateAddress({ id: addressId.value, ...data })
    } else {
      await addAddress(data)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' })
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

.form {
  background: #FFFFFF;
  margin-top: 16rpx;
}

.form-item {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.form-label {
  font-size: 28rpx;
  color: #8C8C8C;
  margin-bottom: 12rpx;
  display: block;
}

.form-input {
  font-size: 30rpx;
  color: #1A1A1A;
  width: 100%;
}

.placeholder {
  color: #BFBFBF;
  font-size: 30rpx;
}

.region-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.region-text {
  font-size: 30rpx;
  color: #1A1A1A;
}

.region-text.placeholder {
  color: #BFBFBF;
}

.textarea-item {
  padding-bottom: 0;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  font-size: 30rpx;
  color: #1A1A1A;
  padding: 0;
  box-sizing: border-box;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
}

.switch-label {
  font-size: 30rpx;
  color: #1A1A1A;
}

.save-btn-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  z-index: 999;
}

.save-btn {
  height: 88rpx;
  background: #E74860;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn-text {
  font-size: 30rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
