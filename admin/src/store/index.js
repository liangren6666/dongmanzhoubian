import { defineStore } from 'pinia'
import router from '@/router'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    adminInfo: JSON.parse(localStorage.getItem('admin_info') || 'null')
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    login(token, adminInfo) {
      this.token = token
      this.adminInfo = adminInfo
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_info', JSON.stringify(adminInfo))
    },
    logout() {
      this.token = ''
      this.adminInfo = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      router.push('/login')
    }
  }
})
