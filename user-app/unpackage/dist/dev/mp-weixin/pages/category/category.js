"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_image = require("../../utils/image.js");
if (!Math) {
  (IconComp + ProductCard + EmptyState + CustomTabbar)();
}
const IconComp = () => "../../components/icon.js";
const ProductCard = () => "../../components/product-card.js";
const EmptyState = () => "../../components/empty-state.js";
const CustomTabbar = () => "../../components/custom-tabbar.js";
const pageSize = 10;
const _sfc_main = {
  __name: "category",
  setup(__props) {
    const categories = common_vendor.ref([]);
    const currentCategoryId = common_vendor.ref(null);
    const products = common_vendor.ref([]);
    const page = common_vendor.ref(1);
    const loading = common_vendor.ref(false);
    const loadingMore = common_vendor.ref(false);
    const noMore = common_vendor.ref(false);
    const scrollTop = common_vendor.ref(0);
    const sortField = common_vendor.ref("default");
    const sortOrder = common_vendor.ref("desc");
    const sortOptions = [
      { field: "default", label: "综合" },
      { field: "sales", label: "销量" },
      { field: "price", label: "价格" }
    ];
    function getSortLabel(s) {
      if (s.field === "price" && sortField.value === "price") {
        return sortOrder.value === "asc" ? "价格↑" : "价格↓";
      }
      return s.label;
    }
    common_vendor.onLoad(() => {
      loadCategories();
      loadProducts();
    });
    function loadCategories() {
      api_index.getCategoryList().then((res) => {
        categories.value = res.data || [];
      }).catch(() => {
      });
    }
    function selectCategory(id) {
      currentCategoryId.value = id;
      resetAndLoad();
    }
    function changeSort(field) {
      if (sortField.value === field) {
        if (field === "price") {
          sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
        }
      } else {
        sortField.value = field;
        sortOrder.value = field === "price" ? "asc" : "desc";
      }
      resetAndLoad();
    }
    function resetAndLoad() {
      page.value = 1;
      noMore.value = false;
      products.value = [];
      scrollTop.value = 0;
      loadProducts();
    }
    function loadProducts() {
      if (loading.value)
        return;
      loading.value = true;
      const params = {
        page: page.value,
        pageSize
      };
      if (currentCategoryId.value) {
        params.categoryId = currentCategoryId.value;
      }
      if (sortField.value !== "default") {
        params.sortField = sortField.value;
        params.sortOrder = sortOrder.value;
      }
      api_index.getProductList(params).then((res) => {
        const d = res.data || {};
        const list = d.list || d || [];
        if (page.value === 1) {
          products.value = list;
        } else {
          products.value = [...products.value, ...list];
        }
        if (list.length < pageSize) {
          noMore.value = true;
        }
      }).catch(() => {
      }).finally(() => {
        loading.value = false;
        loadingMore.value = false;
      });
    }
    function loadMore() {
      if (noMore.value || loadingMore.value)
        return;
      loadingMore.value = true;
      page.value++;
      loadProducts();
    }
    function goSearch() {
      common_vendor.index.navigateTo({ url: "/pages/search/search" });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: "search",
          size: 32,
          color: "#BFBFBF"
        }),
        b: common_vendor.o(goSearch),
        c: common_vendor.p({
          name: "grid",
          size: 28,
          color: currentCategoryId.value === null ? "#E74860" : "#8C8C8C"
        }),
        d: currentCategoryId.value === null ? 1 : "",
        e: currentCategoryId.value === null ? 1 : "",
        f: common_vendor.o(($event) => selectCategory(null)),
        g: common_vendor.f(categories.value, (cat, k0, i0) => {
          return {
            a: common_vendor.unref(utils_image.fixImageUrl)(cat.icon),
            b: common_vendor.t(cat.name),
            c: currentCategoryId.value === cat.id ? 1 : "",
            d: cat.id,
            e: currentCategoryId.value === cat.id ? 1 : "",
            f: common_vendor.o(($event) => selectCategory(cat.id), cat.id)
          };
        }),
        h: common_vendor.f(sortOptions, (s, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getSortLabel(s)),
            b: sortField.value === s.field ? 1 : "",
            c: sortField.value === s.field
          }, sortField.value === s.field ? {} : {}, {
            d: s.field,
            e: sortField.value === s.field ? 1 : "",
            f: common_vendor.o(($event) => changeSort(s.field), s.field)
          });
        }),
        i: common_vendor.t(products.value.length),
        j: products.value.length
      }, products.value.length ? common_vendor.e({
        k: common_vendor.f(products.value, (item, k0, i0) => {
          return {
            a: "8145b772-2-" + i0,
            b: common_vendor.p({
              product: item,
              compact: true
            }),
            c: item.id
          };
        }),
        l: products.value.length % 2 === 1
      }, products.value.length % 2 === 1 ? {} : {}) : {}, {
        m: products.value.length
      }, products.value.length ? {
        n: common_vendor.t(loadingMore.value ? "加载中..." : noMore.value ? "没有更多了" : "")
      } : {}, {
        o: !loading.value && !products.value.length
      }, !loading.value && !products.value.length ? {
        p: common_vendor.p({
          text: "暂无相关商品",
          icon: "search"
        })
      } : {}, {
        q: common_vendor.o(loadMore),
        r: scrollTop.value,
        s: common_vendor.p({
          current: 1
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8145b772"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/category/category.js.map
