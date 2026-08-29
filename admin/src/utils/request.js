import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (res) => {
    if (res.data.code === 200) {
      return res.data
    }
    ElMessage.error(res.data.message || '请求失败')
    return Promise.reject(new Error(res.data.message || '请求失败'))
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
