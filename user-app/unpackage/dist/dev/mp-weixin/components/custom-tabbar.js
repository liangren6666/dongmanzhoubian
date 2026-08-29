"use strict";
const common_vendor = require("../common/vendor.js");
if (!Math) {
  IconComp();
}
const IconComp = () => "./icon.js";
const _sfc_main = {
  __name: "custom-tabbar",
  props: {
    current: { type: Number, default: 0 }
  },
  setup(__props) {
    const props = __props;
    const store = common_vendor.useStore();
    const cartCount = common_vendor.computed(() => store.state.cartCount);
    const safeBottom = common_vendor.ref(0);
    common_vendor.index.getSystemInfo({
      success(res) {
        safeBottom.value = res.safeAreaInsets && res.safeAreaInsets.bottom || 0;
      }
    });
    const tabs = [
      { text: "首页", url: "/pages/index/index", icon: "home", activeIcon: "home-fill" },
      { text: "分类", url: "/pages/category/category", icon: "grid", activeIcon: "grid-fill" },
      { text: "购物车", url: "/pages/cart/cart", icon: "bag", activeIcon: "bag-fill" },
      { text: "我的", url: "/pages/profile/profile", icon: "user", activeIcon: "user-fill" }
    ];
    function switchTab(index) {
      if (index === props.current)
        return;
      common_vendor.index.switchTab({ url: tabs[index].url });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: "c0af68ba-0-" + i0,
            b: common_vendor.p({
              name: __props.current === index ? tab.activeIcon : tab.icon,
              size: 36,
              color: __props.current === index ? "#E74860" : "#8C8C8C"
            }),
            c: index === 2 && cartCount.value > 0
          }, index === 2 && cartCount.value > 0 ? {
            d: common_vendor.t(cartCount.value > 99 ? "99+" : cartCount.value)
          } : {}, {
            e: common_vendor.t(tab.text),
            f: __props.current === index ? "#E74860" : "#8C8C8C",
            g: index,
            h: common_vendor.o(($event) => switchTab(index), index)
          });
        }),
        b: safeBottom.value + "px"
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c0af68ba"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/custom-tabbar.js.map
