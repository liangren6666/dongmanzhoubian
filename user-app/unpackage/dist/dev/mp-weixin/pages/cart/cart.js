"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_auth = require("../../utils/auth.js");
const utils_image = require("../../utils/image.js");
if (!Math) {
  (EmptyState + CustomTabbar)();
}
const EmptyState = () => "../../components/empty-state.js";
const CustomTabbar = () => "../../components/custom-tabbar.js";
const _sfc_main = {
  __name: "cart",
  setup(__props) {
    const store = common_vendor.useStore();
    const logged = common_vendor.ref(false);
    const cartList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const isAllSelected = common_vendor.computed(() => {
      if (!cartList.value.length)
        return false;
      return cartList.value.every((item) => item.selected);
    });
    const selectedCount = common_vendor.computed(() => {
      return cartList.value.filter((item) => item.selected).reduce((sum, item) => sum + item.quantity, 0);
    });
    const totalPrice = common_vendor.computed(() => {
      return cartList.value.filter((item) => item.selected).reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0).toFixed(2);
    });
    common_vendor.onShow(() => {
      logged.value = utils_auth.isLoggedIn();
      if (logged.value) {
        loadCart();
      }
    });
    function loadCart() {
      loading.value = true;
      api_index.getCartList().then((res) => {
        cartList.value = res.data || [];
        store.dispatch("fetchCartCount");
      }).catch(() => {
      }).finally(() => {
        loading.value = false;
      });
    }
    function toggleSelect(item) {
      const newSelected = !item.selected;
      api_index.updateCart(item.id, item.quantity, newSelected ? 1 : 0).then(() => {
        item.selected = newSelected;
      }).catch(() => {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      });
    }
    function toggleAll() {
      const newVal = !isAllSelected.value;
      api_index.selectAllCart(newVal ? 1 : 0).then(() => {
        cartList.value.forEach((item) => {
          item.selected = newVal;
        });
      }).catch(() => {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      });
    }
    function changeQty(item, delta) {
      const newQty = item.quantity + delta;
      if (newQty < 1 || newQty > (item.stock || 99))
        return;
      api_index.updateCart(item.id, newQty, item.selected ? 1 : 0).then(() => {
        item.quantity = newQty;
        store.dispatch("fetchCartCount");
      }).catch(() => {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      });
    }
    function handleDelete(item) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该商品吗？",
        confirmColor: "#E74860",
        success(res) {
          if (res.confirm) {
            api_index.deleteCart(item.id).then(() => {
              cartList.value = cartList.value.filter((c) => c.id !== item.id);
              store.dispatch("fetchCartCount");
              common_vendor.index.showToast({ title: "已删除", icon: "success" });
            }).catch((e) => {
              common_vendor.index.showToast({ title: e && e.message || "删除失败", icon: "none" });
            });
          }
        }
      });
    }
    function goShopping() {
      if (!logged.value) {
        common_vendor.index.navigateTo({ url: "/pages/login/login" });
      } else {
        common_vendor.index.switchTab({ url: "/pages/index/index" });
      }
    }
    function goDetail(id) {
      common_vendor.index.navigateTo({ url: "/pages/product/detail?id=" + id });
    }
    function goSettle() {
      if (selectedCount.value === 0)
        return;
      const selectedItems = cartList.value.filter((item) => item.selected);
      const ids = selectedItems.map((item) => item.id).join(",");
      common_vendor.index.navigateTo({ url: "/pages/order/confirm?cartIds=" + ids });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !logged.value || !loading.value && !cartList.value.length
      }, !logged.value || !loading.value && !cartList.value.length ? {
        b: common_vendor.p({
          icon: "cart",
          text: !logged.value ? "请先登录" : "购物车空空如也"
        }),
        c: common_vendor.t(!logged.value ? "去登录" : "去逛逛"),
        d: common_vendor.o(goShopping)
      } : {}, {
        e: logged.value && cartList.value.length
      }, logged.value && cartList.value.length ? {
        f: common_vendor.f(cartList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.selected
          }, item.selected ? {} : {}, {
            b: common_vendor.o(($event) => toggleSelect(item), item.id),
            c: common_vendor.unref(utils_image.fixImageUrl)(item.productImage),
            d: common_vendor.o(($event) => goDetail(item.productId), item.id),
            e: common_vendor.t(item.productName),
            f: common_vendor.t(item.price),
            g: item.quantity <= 1 ? 1 : "",
            h: common_vendor.o(($event) => changeQty(item, -1), item.id),
            i: common_vendor.t(item.quantity),
            j: item.quantity >= (item.stock || 99) ? 1 : "",
            k: common_vendor.o(($event) => changeQty(item, 1), item.id),
            l: common_vendor.o(($event) => handleDelete(item), item.id),
            m: item.id
          });
        })
      } : {}, {
        g: logged.value && cartList.value.length
      }, logged.value && cartList.value.length ? common_vendor.e({
        h: isAllSelected.value
      }, isAllSelected.value ? {} : {}, {
        i: common_vendor.o(toggleAll),
        j: common_vendor.t(totalPrice.value),
        k: common_vendor.t(selectedCount.value),
        l: selectedCount.value === 0 ? 1 : "",
        m: common_vendor.o(goSettle)
      }) : {}, {
        n: common_vendor.p({
          current: 2
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c91e7611"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/cart/cart.js.map
