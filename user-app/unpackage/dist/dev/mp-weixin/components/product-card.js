"use strict";
const common_vendor = require("../common/vendor.js");
const utils_image = require("../utils/image.js");
const _sfc_main = {
  __name: "product-card",
  props: {
    compact: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    function goDetail() {
      common_vendor.index.navigateTo({
        url: "/pages/product/detail?id=" + props.product.id
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(utils_image.fixImageUrl)(__props.product.mainImage),
        b: common_vendor.t(__props.product.name),
        c: common_vendor.t(__props.product.price),
        d: __props.product.originalPrice && Number(__props.product.originalPrice) > Number(__props.product.price)
      }, __props.product.originalPrice && Number(__props.product.originalPrice) > Number(__props.product.price) ? {
        e: common_vendor.t(__props.product.originalPrice)
      } : {}, {
        f: common_vendor.t(__props.product.sales || 0),
        g: __props.compact ? 1 : "",
        h: common_vendor.o(goDetail)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8dddd85a"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/product-card.js.map
