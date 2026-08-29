"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_auth = require("../../utils/auth.js");
const utils_image = require("../../utils/image.js");
if (!Math) {
  EmptyState();
}
const EmptyState = () => "../../components/empty-state.js";
const pageSize = 10;
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const store = common_vendor.useStore();
    const tabs = [
      { label: "全部", value: -1 },
      { label: "待付款", value: 0 },
      { label: "待发货", value: 1 },
      { label: "待收货", value: 2 },
      { label: "已完成", value: 3 }
    ];
    const currentTab = common_vendor.ref(-1);
    const orders = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const page = common_vendor.ref(1);
    const hasMore = common_vendor.ref(true);
    const showReview = common_vendor.ref(false);
    const reviewRating = common_vendor.ref(5);
    const reviewContent = common_vendor.ref("");
    const reviewOrder = common_vendor.ref(null);
    const reviewItem = common_vendor.ref(null);
    common_vendor.onLoad((options) => {
      if (options.status !== void 0) {
        currentTab.value = Number(options.status);
      }
    });
    common_vendor.onShow(() => {
      page.value = 1;
      hasMore.value = true;
      loadOrders(true);
    });
    common_vendor.onReachBottom(() => {
      if (hasMore.value && !loading.value) {
        loadOrders(false);
      }
    });
    async function loadOrders(reset) {
      if (reset) {
        page.value = 1;
        hasMore.value = true;
      }
      if (!hasMore.value)
        return;
      loading.value = true;
      try {
        const status = currentTab.value === -1 ? void 0 : currentTab.value;
        const res = await api_index.getOrderList(status, page.value, pageSize);
        const d = res.data || {};
        const list = d.list || d || [];
        list.forEach((o) => {
          if (o.reviewed)
            o._reviewed = true;
          if (!o._reviewed && o.reviewedProductIds && o.items) {
            o._reviewed = o.items.every((item) => (o.reviewedProductIds || []).includes(item.productId));
          }
        });
        if (reset) {
          orders.value = list;
        } else {
          orders.value = [...orders.value, ...list];
        }
        if (list.length < pageSize) {
          hasMore.value = false;
        }
        page.value++;
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    }
    function switchTab(val) {
      currentTab.value = val;
      page.value = 1;
      hasMore.value = true;
      loadOrders(true);
    }
    function statusText(status) {
      const map = { 0: "待付款", 1: "待发货", 2: "待收货", 3: "已完成", 4: "已取消" };
      return map[status] || "";
    }
    function statusColor(status) {
      const map = { 0: "#FAAD14", 1: "#E74860", 2: "#4A4A4A", 3: "#52C41A", 4: "#BFBFBF" };
      return map[status] || "#8C8C8C";
    }
    function totalQty(items) {
      return (items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);
    }
    function handleCancel(order) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消该订单吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_index.cancelOrder(order.id);
              common_vendor.index.showToast({ title: "已取消", icon: "success" });
              loadOrders(true);
            } catch (e) {
              common_vendor.index.showToast({ title: "操作失败", icon: "none" });
            }
          }
        }
      });
    }
    async function handlePay(order) {
      try {
        await api_index.payOrder(order.id);
        common_vendor.index.showToast({ title: "支付成功", icon: "success" });
        loadOrders(true);
      } catch (e) {
        common_vendor.index.showToast({ title: "支付失败", icon: "none" });
      }
    }
    function handleConfirm(order) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认已收到商品吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_index.confirmReceive(order.id);
              common_vendor.index.showToast({ title: "已确认收货", icon: "success" });
              loadOrders(true);
            } catch (e) {
              common_vendor.index.showToast({ title: "操作失败", icon: "none" });
            }
          }
        }
      });
    }
    function getUnreviewedItem(order) {
      const reviewedIds = order.reviewedProductIds || [];
      return (order.items || []).find((item) => !reviewedIds.includes(item.productId));
    }
    function openReview(order) {
      const item = getUnreviewedItem(order);
      if (!item) {
        common_vendor.index.showToast({ title: "该订单已评价完成", icon: "none" });
        return;
      }
      reviewOrder.value = order;
      reviewItem.value = item;
      reviewRating.value = 5;
      reviewContent.value = "";
      showReview.value = true;
    }
    async function submitReview() {
      if (!reviewContent.value.trim()) {
        common_vendor.index.showToast({ title: "请输入评价内容", icon: "none" });
        return;
      }
      if (!reviewItem.value) {
        common_vendor.index.showToast({ title: "评价商品不存在", icon: "none" });
        return;
      }
      try {
        await api_index.addReview({
          orderId: reviewOrder.value.id,
          productId: reviewItem.value.productId,
          rating: reviewRating.value,
          content: reviewContent.value
        });
        common_vendor.index.showToast({ title: "评价成功", icon: "success" });
        showReview.value = false;
        loadOrders(true);
      } catch (e) {
        const msg = e && e.message || "评价失败";
        showReview.value = false;
        if (msg.indexOf("已评价") !== -1) {
          common_vendor.index.showToast({ title: "该商品已评价过了", icon: "none" });
        } else {
          common_vendor.index.showToast({ title: msg, icon: "none" });
        }
        loadOrders(true);
      }
    }
    async function handleBuyAgain(order) {
      if (!utils_auth.checkLogin())
        return;
      try {
        for (const item of order.items || []) {
          await api_index.addToCart(item.productId, item.quantity || 1);
        }
        store.dispatch("fetchCartCount");
        common_vendor.index.switchTab({ url: "/pages/cart/cart" });
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.label),
            b: currentTab.value === tab.value ? 1 : "",
            c: currentTab.value === tab.value
          }, currentTab.value === tab.value ? {} : {}, {
            d: tab.value,
            e: currentTab.value === tab.value ? 1 : "",
            f: common_vendor.o(($event) => switchTab(tab.value), tab.value)
          });
        }),
        b: orders.value.length > 0
      }, orders.value.length > 0 ? {
        c: common_vendor.f(orders.value, (order, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(order.orderNo),
            b: common_vendor.t(statusText(order.status)),
            c: statusColor(order.status),
            d: common_vendor.f(order.items, (item, idx, i1) => {
              return {
                a: common_vendor.unref(utils_image.fixImageUrl)(item.productImage),
                b: common_vendor.t(item.productName),
                c: common_vendor.t(item.price),
                d: common_vendor.t(item.quantity),
                e: idx
              };
            }),
            e: common_vendor.t(totalQty(order.items)),
            f: common_vendor.t(order.payAmount),
            g: [0, 2, 3].includes(order.status)
          }, [0, 2, 3].includes(order.status) ? common_vendor.e({
            h: order.status === 0
          }, order.status === 0 ? {
            i: common_vendor.o(($event) => handleCancel(order), order.id),
            j: common_vendor.o(($event) => handlePay(order), order.id)
          } : {}, {
            k: order.status === 2
          }, order.status === 2 ? {
            l: common_vendor.o(($event) => handleConfirm(order), order.id)
          } : {}, {
            m: order.status === 3
          }, order.status === 3 ? common_vendor.e({
            n: getUnreviewedItem(order)
          }, getUnreviewedItem(order) ? {
            o: common_vendor.o(($event) => openReview(order), order.id)
          } : {}, {
            p: common_vendor.o(($event) => handleBuyAgain(order), order.id)
          }) : {}) : {}, {
            q: order.id
          });
        })
      } : !loading.value ? {
        e: common_vendor.p({
          text: "暂无订单",
          icon: "order"
        })
      } : {}, {
        d: !loading.value,
        f: showReview.value
      }, showReview.value ? common_vendor.e({
        g: reviewItem.value
      }, reviewItem.value ? {
        h: common_vendor.unref(utils_image.fixImageUrl)(reviewItem.value.productImage),
        i: common_vendor.t(reviewItem.value.productName)
      } : {}, {
        j: common_vendor.f(5, (s, k0, i0) => {
          return {
            a: common_vendor.n(s <= reviewRating.value ? "star-on" : "star-off"),
            b: s,
            c: common_vendor.o(($event) => reviewRating.value = s, s)
          };
        }),
        k: reviewContent.value,
        l: common_vendor.o(($event) => reviewContent.value = $event.detail.value),
        m: common_vendor.o(submitReview),
        n: common_vendor.o(() => {
        }),
        o: common_vendor.o(($event) => showReview.value = false)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-456ecf67"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/list.js.map
