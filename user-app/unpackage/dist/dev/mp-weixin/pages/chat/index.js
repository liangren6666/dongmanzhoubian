"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
const utils_auth = require("../../utils/auth.js");
const utils_image = require("../../utils/image.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sessionId = common_vendor.ref(null);
    const productId = common_vendor.ref(null);
    const productName = common_vendor.ref("");
    const messages = common_vendor.ref([]);
    const inputText = common_vendor.ref("");
    const scrollIntoView = common_vendor.ref("");
    const userAvatar = common_vendor.ref("/static/default-avatar.png");
    let pollTimer = null;
    common_vendor.onLoad((options) => {
      if (!utils_auth.checkLogin())
        return;
      productId.value = options.productId || null;
      productName.value = options.productName ? decodeURIComponent(options.productName) : "";
      const userInfo = utils_auth.getUserInfo();
      if (userInfo && userInfo.avatar) {
        userAvatar.value = utils_image.fixAvatarUrl(userInfo.avatar);
      }
      initSession();
    });
    common_vendor.onShow(() => {
      startPolling();
    });
    common_vendor.onHide(() => {
      stopPolling();
    });
    common_vendor.onUnload(() => {
      stopPolling();
    });
    async function initSession() {
      try {
        common_vendor.index.showLoading({ title: "连接客服..." });
        const params = {};
        if (productId.value)
          params.productId = Number(productId.value);
        if (productName.value)
          params.productName = productName.value;
        const res = await api_index.createChatSession(params);
        const data = res.data || {};
        sessionId.value = data.id;
        if (data.productName) {
          productName.value = data.productName;
        }
        await loadMessages(true);
        if (data.isNew && productName.value) {
          await api_index.sendChatMessage({
            sessionId: sessionId.value,
            content: `我想咨询商品：${productName.value}`
          });
          await loadMessages(true);
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "连接客服失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    async function loadMessages(scrollBottom = false) {
      if (!sessionId.value)
        return;
      try {
        const res = await api_index.getChatMessages(sessionId.value);
        messages.value = res.data || [];
        if (scrollBottom) {
          scrollToBottom();
        }
      } catch (e) {
      }
    }
    async function sendMessage() {
      const content = inputText.value.trim();
      if (!content || !sessionId.value)
        return;
      try {
        await api_index.sendChatMessage({ sessionId: sessionId.value, content });
        inputText.value = "";
        await loadMessages(true);
      } catch (e) {
        common_vendor.index.showToast({ title: "发送失败", icon: "none" });
      }
    }
    function scrollToBottom() {
      const last = messages.value[messages.value.length - 1];
      scrollIntoView.value = last ? "msg-" + last.id : "msg-bottom";
      setTimeout(() => {
        scrollIntoView.value = "msg-bottom";
      }, 100);
    }
    function startPolling() {
      stopPolling();
      pollTimer = setInterval(() => {
        loadMessages(false);
      }, 3e3);
    }
    function stopPolling() {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: productName.value
      }, productName.value ? {
        b: common_vendor.t(productName.value)
      } : {}, {
        c: common_vendor.f(messages.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.senderType === "admin"
          }, item.senderType === "admin" ? {
            b: common_assets._imports_0
          } : {}, {
            c: common_vendor.t(item.timeText),
            d: common_vendor.t(item.content),
            e: common_vendor.n(item.senderType === "user" ? "bubble-user" : "bubble-admin"),
            f: item.senderType === "user"
          }, item.senderType === "user" ? {
            g: userAvatar.value
          } : {}, {
            h: item.id,
            i: "msg-" + item.id,
            j: common_vendor.n(item.senderType === "user" ? "message-row-user" : "message-row-admin")
          });
        }),
        d: scrollIntoView.value,
        e: common_vendor.o(sendMessage),
        f: inputText.value,
        g: common_vendor.o(($event) => inputText.value = $event.detail.value),
        h: !inputText.value.trim() ? 1 : "",
        i: common_vendor.o(sendMessage)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5a559478"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/index.js.map
