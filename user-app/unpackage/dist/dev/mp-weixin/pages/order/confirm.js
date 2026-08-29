"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_image = require("../../utils/image.js");
if (!Math) {
  IconComp();
}
const IconComp = () => "../../components/icon.js";
const _sfc_main = {
  __name: "confirm",
  setup(__props) {
    const cartIds = common_vendor.ref([]);
    const cartItems = common_vendor.ref([]);
    const addressList = common_vendor.ref([]);
    const selectedAddress = common_vendor.ref(null);
    const remark = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const totalAmount = common_vendor.computed(() => {
      return cartItems.value.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0).toFixed(2);
    });
    function fullAddress(addr) {
      if (!addr)
        return "";
      return [addr.province, addr.city, addr.district, addr.detail].filter(Boolean).join(" ");
    }
    common_vendor.onLoad((options) => {
      if (options && options.cartIds) {
        cartIds.value = options.cartIds.split(",").map(Number);
      }
      loadCart();
      loadAddress();
    });
    function loadCart() {
      api_index.getCartList().then((res) => {
        const all = res.data || [];
        cartItems.value = cartIds.value.length ? all.filter((item) => cartIds.value.includes(item.id)) : all;
      }).catch(() => {
      });
    }
    function loadAddress() {
      api_index.getAddressList().then((res) => {
        addressList.value = res.data || [];
        const def = addressList.value.find((a) => a.isDefault);
        selectedAddress.value = def || addressList.value[0] || null;
      }).catch(() => {
      });
    }
    function chooseAddress() {
      if (!addressList.value.length) {
        common_vendor.index.navigateTo({ url: "/pages/address/edit" });
        return;
      }
      const names = addressList.value.map(
        (a) => `${a.receiverName} ${a.receiverPhone} ${fullAddress(a)}`
      );
      common_vendor.index.showActionSheet({
        itemList: names,
        success(res) {
          selectedAddress.value = addressList.value[res.tapIndex];
        }
      });
    }
    function submitOrder() {
      if (!selectedAddress.value) {
        common_vendor.index.showToast({ title: "请选择收货地址", icon: "none" });
        return;
      }
      if (cartItems.value.length === 0) {
        common_vendor.index.showToast({ title: "购物车为空", icon: "none" });
        return;
      }
      if (submitting.value)
        return;
      submitting.value = true;
      api_index.createOrder({
        addressId: selectedAddress.value.id,
        cartIds: cartIds.value,
        remark: remark.value
      }).then((res) => {
        res.data && res.data.orderId;
        common_vendor.index.showToast({ title: "下单成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.redirectTo({ url: "/pages/order/list" });
        }, 1200);
      }).catch(() => {
      }).finally(() => {
        submitting.value = false;
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: selectedAddress.value
      }, selectedAddress.value ? common_vendor.e({
        b: common_vendor.t(selectedAddress.value.receiverName),
        c: common_vendor.t(selectedAddress.value.receiverPhone),
        d: selectedAddress.value.isDefault
      }, selectedAddress.value.isDefault ? {} : {}, {
        e: common_vendor.t(fullAddress(selectedAddress.value))
      }) : {}, {
        f: common_vendor.p({
          name: "arrow",
          size: 32,
          color: "#BFBFBF"
        }),
        g: common_vendor.o(chooseAddress),
        h: common_vendor.f(cartItems.value, (item, k0, i0) => {
          return {
            a: common_vendor.unref(utils_image.fixImageUrl)(item.productImage),
            b: common_vendor.t(item.productName),
            c: common_vendor.t(item.price),
            d: common_vendor.t(item.quantity),
            e: item.id
          };
        }),
        i: remark.value,
        j: common_vendor.o(($event) => remark.value = $event.detail.value),
        k: common_vendor.t(totalAmount.value),
        l: common_vendor.t(totalAmount.value),
        m: common_vendor.t(totalAmount.value),
        n: common_vendor.t(submitting.value ? "提交中..." : "提交订单"),
        o: submitting.value || !selectedAddress.value ? 1 : "",
        p: common_vendor.o(submitOrder)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-324e7894"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/confirm.js.map
