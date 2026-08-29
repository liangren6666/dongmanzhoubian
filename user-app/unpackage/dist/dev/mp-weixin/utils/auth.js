"use strict";
const common_vendor = require("../common/vendor.js");
const TOKEN_KEY = "token";
const USER_INFO_KEY = "userInfo";
function getToken() {
  return common_vendor.index.getStorageSync(TOKEN_KEY) || "";
}
function setToken(token) {
  common_vendor.index.setStorageSync(TOKEN_KEY, token);
}
function removeToken() {
  common_vendor.index.removeStorageSync(TOKEN_KEY);
}
function getUserInfo() {
  try {
    const raw = common_vendor.index.getStorageSync(USER_INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function setUserInfo(info) {
  common_vendor.index.setStorageSync(USER_INFO_KEY, JSON.stringify(info));
}
function removeUserInfo() {
  common_vendor.index.removeStorageSync(USER_INFO_KEY);
}
function isLoggedIn() {
  return !!getToken();
}
function checkLogin() {
  if (!isLoggedIn()) {
    common_vendor.index.navigateTo({ url: "/pages/login/login" });
    return false;
  }
  return true;
}
exports.checkLogin = checkLogin;
exports.getToken = getToken;
exports.getUserInfo = getUserInfo;
exports.isLoggedIn = isLoggedIn;
exports.removeToken = removeToken;
exports.removeUserInfo = removeUserInfo;
exports.setToken = setToken;
exports.setUserInfo = setUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map
