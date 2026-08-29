<template>
  <div class="chat-page admin-page">
    <el-row :gutter="16" class="chat-layout">
      <el-col :span="8">
        <el-card shadow="hover" class="session-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">会话列表</span>
              <el-badge :value="totalUnread" :hidden="!totalUnread" type="danger" />
            </div>
          </template>
          <div class="session-list" v-loading="sessionLoading">
            <div
              v-for="item in sessions"
              :key="item.id"
              class="session-item"
              :class="{ active: currentSessionId === item.id }"
              @click="selectSession(item)"
            >
              <el-avatar :size="40" :src="item.userAvatar">{{ (item.userNickname || '用').slice(0, 1) }}</el-avatar>
              <div class="session-info">
                <div class="session-top">
                  <span class="session-name">{{ item.userNickname || '用户' }}</span>
                  <span class="session-time">{{ formatTime(item.updatedAt) }}</span>
                </div>
                <div class="session-bottom">
                  <span class="session-preview">{{ item.lastMessage || '暂无消息' }}</span>
                  <el-badge v-if="item.unreadAdmin" :value="item.unreadAdmin" type="danger" />
                </div>
              </div>
            </div>
            <el-empty v-if="!sessionLoading && !sessions.length" description="暂无客服会话" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card shadow="hover" class="message-card">
          <template #header>
            <div class="card-header" v-if="currentSession">
              <div>
                <div class="card-title">{{ currentSession.userNickname || '用户' }}</div>
                <div class="card-subtitle" v-if="currentSession.productName">
                  咨询商品：{{ currentSession.productName }}
                </div>
              </div>
              <span class="card-phone">{{ currentSession.userPhone || '' }}</span>
            </div>
            <span v-else class="card-title">请选择会话</span>
          </template>

          <div class="message-panel" v-loading="messageLoading">
            <div v-if="currentSessionId" ref="messageBoxRef" class="message-box">
              <div
                v-for="item in messages"
                :key="item.id"
                class="message-row"
                :class="item.senderType === 'admin' ? 'message-row-admin' : 'message-row-user'"
              >
                <div class="message-meta">{{ item.timeText }}</div>
                <div class="message-bubble" :class="item.senderType === 'admin' ? 'bubble-admin' : 'bubble-user'">
                  {{ item.content }}
                </div>
              </div>
            </div>
            <el-empty v-else description="从左侧选择一个会话开始回复" />
          </div>

          <div v-if="currentSessionId" class="input-panel">
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="3"
              maxlength="500"
              show-word-limit
              placeholder="输入回复内容，Enter 发送，Shift+Enter 换行"
              @keydown.enter="handleEnter"
            />
            <div class="input-actions">
              <el-button type="primary" :disabled="!inputText.trim()" @click="sendMessage">发送</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { getChatSessions, getChatMessages, sendChatMessage } from '@/api'

const sessions = ref([])
const messages = ref([])
const currentSessionId = ref(null)
const currentSession = ref(null)
const inputText = ref('')
const sessionLoading = ref(false)
const messageLoading = ref(false)
const messageBoxRef = ref()

let pollTimer = null

const totalUnread = computed(() =>
  sessions.value.reduce((sum, item) => sum + Number(item.unreadAdmin || 0), 0)
)

const formatTime = (time) => {
  if (!time) return ''
  return String(time).replace('T', ' ').slice(5, 16)
}

const loadSessions = async () => {
  sessionLoading.value = true
  try {
    const res = await getChatSessions()
    sessions.value = res.data || []
    if (currentSessionId.value) {
      currentSession.value = sessions.value.find((item) => item.id === currentSessionId.value) || currentSession.value
    }
  } finally {
    sessionLoading.value = false
  }
}

const loadMessages = async (scrollBottom = false) => {
  if (!currentSessionId.value) return
  messageLoading.value = true
  try {
    const res = await getChatMessages(currentSessionId.value)
    const data = res.data || {}
    currentSession.value = {
      ...(data.session || {}),
      userNickname: data.userNickname,
      userAvatar: data.userAvatar,
      userPhone: data.userPhone
    }
    messages.value = data.messages || []
    if (scrollBottom) {
      await nextTick()
      if (messageBoxRef.value) {
        messageBoxRef.value.scrollTop = messageBoxRef.value.scrollHeight
      }
    }
  } finally {
    messageLoading.value = false
  }
}

const selectSession = async (item) => {
  currentSessionId.value = item.id
  currentSession.value = item
  await loadMessages(true)
}

const sendMessage = async () => {
  const content = inputText.value.trim()
  if (!content || !currentSessionId.value) return
  try {
    await sendChatMessage({
      sessionId: currentSessionId.value,
      content
    })
    inputText.value = ''
    await loadMessages(true)
    await loadSessions()
  } catch (e) {
    // handled by request interceptor
  }
}

const handleEnter = (event) => {
  if (event.shiftKey) return
  event.preventDefault()
  sendMessage()
}

const startPolling = () => {
  stopPolling()
  pollTimer = setInterval(async () => {
    await loadSessions()
    if (currentSessionId.value) {
      await loadMessages(false)
    }
  }, 3000)
}

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

onMounted(async () => {
  await loadSessions()
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<style scoped>
.chat-layout {
  min-height: calc(100vh - 120px);
}

.session-card,
.message-card {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.session-card :deep(.el-card__body),
.message-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #8C8C8C;
}

.card-phone {
  font-size: 13px;
  color: #8C8C8C;
}

.session-list {
  flex: 1;
  overflow-y: auto;
}

.session-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.session-item:hover,
.session-item.active {
  background: #FFF0F2;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-top,
.session-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.session-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.session-time {
  font-size: 12px;
  color: #BFBFBF;
  flex-shrink: 0;
}

.session-preview {
  margin-top: 6px;
  font-size: 12px;
  color: #8C8C8C;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-panel {
  flex: 1;
  overflow: hidden;
}

.message-box {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background: #F7F8FA;
  border-radius: 8px;
}

.message-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  max-width: 75%;
}

.message-row-admin {
  margin-left: auto;
  align-items: flex-end;
}

.message-row-user {
  margin-right: auto;
  align-items: flex-start;
}

.message-meta {
  font-size: 12px;
  color: #BFBFBF;
  margin-bottom: 6px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  line-height: 1.6;
  word-break: break-word;
}

.bubble-admin {
  background: #E74860;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.bubble-user {
  background: #fff;
  color: #333;
  border-bottom-left-radius: 4px;
}

.input-panel {
  margin-top: 16px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
