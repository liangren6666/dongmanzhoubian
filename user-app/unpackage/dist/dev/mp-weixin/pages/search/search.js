"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Math) {
  (IconComp + ProductCard + EmptyState)();
}
const IconComp = () => "../../components/icon.js";
const ProductCard = () => "../../components/product-card.js";
const EmptyState = () => "../../components/empty-state.js";
const HISTORY_KEY = "searchHistory";
const MAX_HISTORY = 10;
const pageSize = 10;
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const keyword = common_vendor.ref("");
    const history = common_vendor.ref([]);
    const hasSearched = common_vendor.ref(false);
    const products = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const page = common_vendor.ref(1);
    const hasMore = common_vendor.ref(true);
    const hotList = ["路飞手办", "鬼灭之刃", "原神周边", "皮卡丘", "咒术回战", "进击的巨人", "龙猫", "你的名字"];
    function init() {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
      loadHistory();
    }
    init();
    function loadHistory() {
      try {
        const raw = common_vendor.index.getStorageSync(HISTORY_KEY);
        history.value = raw ? JSON.parse(raw) : [];
      } catch (e) {
        history.value = [];
      }
    }
    function saveHistory() {
      common_vendor.index.setStorageSync(HISTORY_KEY, JSON.stringify(history.value));
    }
    function addHistory(kw) {
      const trimmed = kw.trim();
      if (!trimmed)
        return;
      history.value = history.value.filter((h) => h !== trimmed);
      history.value.unshift(trimmed);
      if (history.value.length > MAX_HISTORY) {
        history.value = history.value.slice(0, MAX_HISTORY);
      }
      saveHistory();
    }
    function clearHistory() {
      history.value = [];
      common_vendor.index.removeStorageSync(HISTORY_KEY);
    }
    function clickTag(tag) {
      keyword.value = tag;
      doSearch();
    }
    async function doSearch() {
      const kw = keyword.value.trim();
      if (!kw) {
        common_vendor.index.showToast({ title: "请输入搜索关键词", icon: "none" });
        return;
      }
      addHistory(kw);
      hasSearched.value = true;
      page.value = 1;
      hasMore.value = true;
      await loadProducts(true);
    }
    common_vendor.onReachBottom(() => {
      if (hasSearched.value && hasMore.value && !loading.value) {
        loadProducts(false);
      }
    });
    async function loadProducts(reset) {
      if (reset) {
        page.value = 1;
        hasMore.value = true;
      }
      if (!hasMore.value)
        return;
      loading.value = true;
      try {
        const res = await api_index.getProductList({ keyword: keyword.value.trim(), page: page.value, pageSize });
        const d = res.data || {};
        const list = d.list || d || [];
        if (reset) {
          products.value = list;
        } else {
          products.value = [...products.value, ...list];
        }
        if (list.length < pageSize) {
          hasMore.value = false;
        }
        page.value++;
      } catch (e) {
        common_vendor.index.showToast({ title: "搜索失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    }
    function goBack() {
      common_vendor.index.navigateBack({ fail: () => common_vendor.index.switchTab({ url: "/pages/index/index" }) });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.o(doSearch),
        c: keyword.value,
        d: common_vendor.o(($event) => keyword.value = $event.detail.value),
        e: common_vendor.o(doSearch),
        f: statusBarHeight.value + "px",
        g: !hasSearched.value
      }, !hasSearched.value ? common_vendor.e({
        h: history.value.length > 0
      }, history.value.length > 0 ? {
        i: common_vendor.p({
          name: "close",
          size: 28,
          color: "#BFBFBF"
        }),
        j: common_vendor.o(clearHistory),
        k: common_vendor.f(history.value, (item, idx, i0) => {
          return {
            a: common_vendor.t(item),
            b: idx,
            c: common_vendor.o(($event) => clickTag(item), idx)
          };
        })
      } : {}, {
        l: common_vendor.f(hotList, (item, idx, i0) => {
          return {
            a: common_vendor.t(item),
            b: idx,
            c: common_vendor.o(($event) => clickTag(item), idx)
          };
        })
      }) : common_vendor.e({
        m: products.value.length > 0
      }, products.value.length > 0 ? {
        n: common_vendor.f(products.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: "c10c040c-1-" + i0,
            c: common_vendor.p({
              product: item
            })
          };
        })
      } : !loading.value ? {
        p: common_vendor.p({
          icon: "search",
          text: "未找到相关商品"
        })
      } : {}, {
        o: !loading.value
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
