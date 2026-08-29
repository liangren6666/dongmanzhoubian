<template>
  <view class="chat-page">
    <view v-if="productName" class="product-tip">
      <text class="product-tip-text">咨询商品：{{ productName }}</text>
    </view>

    <scroll-view
      class="message-scroll"
      scroll-y
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
    >
      <view class="message-list">
        <view
          v-for="item in messages"
          :key="item.id"
          :id="'msg-' + item.id"
          class="message-row"
          :class="item.senderType === 'user' ? 'message-row-user' : 'message-row-admin'"
        >
          <image
            v-if="item.senderType === 'admin'"
            class="avatar"
            src="/static/default-avatar.png"
            mode="aspectFill"
          />
          <view class="bubble-wrap">
            <text class="bubble-time">{{ item.timeText }}</text>
            <view class="bubble" :class="item.senderType === 'user' ? 'bubble-user' : 'bubble-admin'">
              <text class="bubble-text">{{ item.content }}</text>
            </view>
          </view>
          <image
            v-if="item.senderType === 'user'"
            class="avatar"
            :src="userAvatar"
            mode="aspectFill"
          />
        </view>
        <view id="msg-bottom" class="scroll-bottom"></view>
      </view>
    </scroll-view>

    <view class="input-bar">
      <input
        class="message-input"
        v-model="inputText"
        placeholder="请输入消息..."
        placeholder-class="input-placeholder"
        confirm-type="send"
        :adjust-position="true"
        @confirm="sendMessage"
      />
      <view class="send-btn" :class="{ disabled: !inputText.trim() }" @click="sendMessage">
        <text class="send-btn-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'
import { createChatSession, getChatMessages, sendChatMessage } from '@/api/index.js'
import { checkLogin, getUserInfo } from '@/utils/auth.js'
import { fixAvatarUrl } from '@/utils/image.js'

const sessionId = ref(null)
const productId = ref(null)
const productName = ref('')
const messages = ref([])
const inputText = ref('')
const scrollIntoView = ref('')
const userAvatar = ref('/static/default-avatar.png')

let pollTimer = null

onLoad((options) => {
  if (!checkLogin()) return
  productId.value = options.productId || null
  productName.value = options.productName ? decodeURIComponent(options.productName) : ''

  const userInfo = getUserInfo()
  if (userInfo && userInfo.avatar) {
    userAvatar.value = fixAvatarUrl(userInfo.avatar)
  }

  initSession()
})

onShow(() => {
  startPolling()
})

onHide(() => {
  stopPolling()
})

onUnload(() => {
  stopPolling()
})

async function initSession() {
  try {
    uni.showLoading({ title: '连接客服...' })
    const params = {}
    if (productId.value) params.productId = Number(productId.value)
    if (productName.value) params.productName = productName.value

    const res = await createChatSession(params)
    const data = res.data || {}
    sessionId.value = data.id
    if (data.productName) {
      productName.value = data.productName
    }
    await loadMessages(true)

    if (data.isNew && productName.value) {
      await sendChatMessage({
        sessionId: sessionId.value,
        content: `我想咨询商品：${productName.value}`
      })
      await loadMessages(true)
    }
  } catch (e) {
    uni.showToast({ title: '连接客服失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

async function loadMessages(scrollBottom = false) {
  if (!sessionId.value) return
  try {
    const res = await getChatMessages(sessionId.value)
    messages.value = res.data || []
    if (scrollBottom) {
      scrollToBottom()
    }
  } catch (e) {
    // ignore polling errors
  }
}

async function sendMessage() {
  const content = inputText.value.trim()
  if (!content || !sessionId.value) return

  try {
    await sendChatMessage({ sessionId: sessionId.value, content })
    inputText.value = ''
    await loadMessages(true)
  } catch (e) {
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
}

function scrollToBottom() {
  const last = messages.value[messages.value.length - 1]
  scrollIntoView.value = last ? 'msg-' + last.id : 'msg-bottom'
  setTimeout(() => {
    scrollIntoView.value = 'msg-bottom'
  }, 100)
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(() => {
    loadMessages(false)
  }, 3000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.product-tip {
  background-color: #FFF7E6;
  padding: 16rpx 24rpx;
  border-bottom: 1rpx solid #FFE7BA;
}

.product-tip-text {
  font-size: 24rpx;
  color: #D48806;
}

.message-scroll {
  flex: 1;
  height: calc(100vh - 120rpx);
  padding: 24rpx;
  box-sizing: border-box;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.message-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16rpx;
}

.message-row-user {
  justify-content: flex-end;
}

.message-row-admin {
  justify-content: flex-start;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: #FFFFFF;
}

.bubble-wrap {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-row-user .bubble-wrap {
  align-items: flex-end;
}

.message-row-admin .bubble-wrap {
  align-items: flex-start;
}

.bubble-time {
  font-size: 20rpx;
  color: #BFBFBF;
  margin-bottom: 8rpx;
}

.bubble {
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  word-break: break-all;
}

.bubble-user {
  background-color: #E74860;
  border-top-right-radius: 4rpx;
}

.bubble-admin {
  background-color: #FFFFFF;
  border-top-left-radius: 4rpx;
}

.bubble-text {
  font-size: 28rpx;
  line-height: 1.5;
}

.bubble-user .bubble-text {
  color: #FFFFFF;
}

.bubble-admin .bubble-text {
  color: #1A1A1A;
}

.scroll-bottom {
  height: 20rpx;
}

.input-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  border-top: 1rpx solid #EEEEEE;
  box-sizing: border-box;
}

.message-input {
  flex: 1;
  height: 72rpx;
  background-color: #F5F5F5;
  border-radius: 36rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: #1A1A1A;
}

.input-placeholder {
  color: #BFBFBF;
}

.send-btn {
  min-width: 120rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background-color: #E74860;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn.disabled {
  opacity: 0.5;
}

.send-btn-text {
  font-size: 28rpx;
  color: #FFFFFF;
}
</style>
