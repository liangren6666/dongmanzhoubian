const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'userInfo'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY)
}

export function getUserInfo() {
  try {
    const raw = uni.getStorageSync(USER_INFO_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function setUserInfo(info) {
  uni.setStorageSync(USER_INFO_KEY, JSON.stringify(info))
}

export function removeUserInfo() {
  uni.removeStorageSync(USER_INFO_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

export function checkLogin() {
  if (!isLoggedIn()) {
    uni.navigateTo({ url: '/pages/login/login' })
    return false
  }
  return true
}
