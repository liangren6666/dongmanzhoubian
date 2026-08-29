"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/category/category.js";
  "./pages/cart/cart.js";
  "./pages/profile/profile.js";
  "./pages/login/login.js";
  "./pages/product/detail.js";
  "./pages/order/list.js";
  "./pages/address/list.js";
  "./pages/address/edit.js";
  "./pages/announcement/list.js";
  "./pages/announcement/detail.js";
  "./pages/search/search.js";
  "./pages/order/confirm.js";
  "./pages/chat/index.js";
}
const _sfc_main = {
  onLaunch() {
    common_vendor.index.__f__("log", "at App.vue:4", "ACG周边商城启动");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
