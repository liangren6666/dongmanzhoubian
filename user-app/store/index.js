import { createStore } from 'vuex'
import { login as loginApi } from '@/api/index'
import { getCartList } from '@/api/index'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/auth'

const store = createStore({
  state() {
    return {
      token: getToken(),
      userInfo: getUserInfo(),
      cartCount: 0
    }
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_INFO(state, info) {
      state.userInfo = info
    },
    SET_CART_COUNT(state, count) {
      state.cartCount = count
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.userInfo = null
      state.cartCount = 0
    }
  },

  actions: {
    async login({ commit }, { phone, password }) {
      const res = await loginApi(phone, password)
      const { token, userInfo } = res.data
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)
      setToken(token)
      setUserInfo(userInfo)
      return res
    },

    logout({ commit }) {
      commit('CLEAR_AUTH')
      removeToken()
      removeUserInfo()
      uni.reLaunch({ url: '/pages/login/login' })
    },

    async fetchCartCount({ commit, state }) {
      if (!state.token) {
        commit('SET_CART_COUNT', 0)
        return
      }
      try {
        const res = await getCartList()
        const list = res.data || []
        const count = list.reduce((sum, item) => sum + (item.quantity || 1), 0)
        commit('SET_CART_COUNT', count)
      } catch (e) {
        commit('SET_CART_COUNT', 0)
      }
    }
  }
})

export default store
