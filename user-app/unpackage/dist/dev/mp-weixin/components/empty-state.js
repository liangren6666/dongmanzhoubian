"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "empty-state",
  props: {
    text: {
      type: String,
      default: "暂无数据"
    },
    icon: {
      type: String,
      default: "default"
    }
  },
  setup(__props) {
    const props = __props;
    const emojiMap = {
      cart: "🛒",
      order: "📋",
      search: "🔍",
      address: "📍",
      bell: "📢",
      default: "📦"
    };
    const emoji = common_vendor.computed(() => emojiMap[props.icon] || emojiMap.default);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(emoji.value),
        b: common_vendor.t(__props.text)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b3994d1e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/empty-state.js.map
