"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://127.0.0.1:8080";
const API_PREFIX = "/api";
function request(options) {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    const isGet = !options.method || options.method === "GET";
    if (!isGet) {
      common_vendor.index.showLoading({ title: "加载中...", mask: true });
    }
    common_vendor.index.request({
      url: BASE_URL + API_PREFIX + options.url,
      method: options.method || "GET",
      data: options.data,
      header: {
        "Content-Type": "application/json",
        ...token ? { "Authorization": "Bearer " + token } : {},
        ...options.header
      },
      success(res) {
        if (!isGet)
          common_vendor.index.hideLoading();
        if (res.data.code === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.navigateTo({ url: "/pages/login/login" });
          reject(new Error("未授权，请重新登录"));
          return;
        }
        if (res.data.code !== 200) {
          common_vendor.index.showToast({ title: res.data.message || "请求失败", icon: "none" });
          reject(new Error(res.data.message || "请求失败"));
          return;
        }
        resolve(res.data);
      },
      fail(err) {
        if (!isGet)
          common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        reject(err);
      }
    });
  });
}
function get(url, params) {
  let queryString = "";
  if (params) {
    const parts = [];
    Object.keys(params).forEach((key) => {
      if (params[key] !== void 0 && params[key] !== null && params[key] !== "") {
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
      }
    });
    if (parts.length)
      queryString = "?" + parts.join("&");
  }
  return request({ url: url + queryString, method: "GET" });
}
function post(url, data) {
  return request({ url, method: "POST", data });
}
function put(url, data) {
  return request({ url, method: "PUT", data });
}
function del(url) {
  return request({ url, method: "DELETE" });
}
exports.del = del;
exports.get = get;
exports.post = post;
exports.put = put;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
