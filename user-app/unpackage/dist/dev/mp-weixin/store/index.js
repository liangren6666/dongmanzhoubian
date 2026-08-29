"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("../api/index.js");
const utils_auth = require("../utils/auth.js");
const store = common_vendor.createStore({
  state() {
    return {
      token: utils_auth.getToken(),
      userInfo: utils_auth.getUserInfo(),
      cartCount: 0
    };
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER_INFO(state, info) {
      state.userInfo = info;
    },
    SET_CART_COUNT(state, count) {
      state.cartCount = count;
    },
    CLEAR_AUTH(state) {
      state.token = "";
      state.userInfo = null;
      state.cartCount = 0;
    }
  },
  actions: {
    async login({ commit }, { phone, password }) {
      const res = await api_index.login(phone, password);
      const { token, userInfo } = res.data;
      commit("SET_TOKEN", token);
      commit("SET_USER_INFO", userInfo);
      utils_auth.setToken(token);
      utils_auth.setUserInfo(userInfo);
      return res;
    },
    logout({ commit }) {
      commit("CLEAR_AUTH");
      utils_auth.removeToken();
      utils_auth.removeUserInfo();
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
    },
    async fetchCartCount({ commit, state }) {
      if (!state.token) {
        commit("SET_CART_COUNT", 0);
        return;
      }
      try {
        const res = await api_index.getCartList();
        const list = res.data || [];
        const count = list.reduce((sum, item) => sum + (item.quantity || 1), 0);
        commit("SET_CART_COUNT", count);
      } catch (e) {
        commit("SET_CART_COUNT", 0);
      }
    }
  }
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
