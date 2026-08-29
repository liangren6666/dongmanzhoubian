// #ifdef H5
const BASE_URL = ''
// #endif
// #ifndef H5
const BASE_URL = 'http://127.0.0.1:8080'
// #endif
const API_PREFIX = '/api'

function request(options) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const isGet = (!options.method || options.method === 'GET')

    if (!isGet) {
      uni.showLoading({ title: '加载中...', mask: true })
    }

    uni.request({
      url: BASE_URL + API_PREFIX + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
        ...options.header
      },
      success(res) {
        if (!isGet) uni.hideLoading()

        if (res.data.code === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.navigateTo({ url: '/pages/login/login' })
          reject(new Error('未授权，请重新登录'))
          return
        }

        if (res.data.code !== 200) {
          uni.showToast({ title: res.data.message || '请求失败', icon: 'none' })
          reject(new Error(res.data.message || '请求失败'))
          return
        }

        resolve(res.data)
      },
      fail(err) {
        if (!isGet) uni.hideLoading()
        uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
        reject(err)
      }
    })
  })
}

export function get(url, params) {
  let queryString = ''
  if (params) {
    const parts = []
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      }
    })
    if (parts.length) queryString = '?' + parts.join('&')
  }
  return request({ url: url + queryString, method: 'GET' })
}

export function post(url, data) {
  return request({ url, method: 'POST', data })
}

export function put(url, data) {
  return request({ url, method: 'PUT', data })
}

export function del(url) {
  return request({ url, method: 'DELETE' })
}
