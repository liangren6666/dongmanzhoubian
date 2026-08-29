"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_image = require("../../utils/image.js");
const utils_navbar = require("../../utils/navbar.js");
if (!Math) {
  (IconComp + ProductCard + CustomTabbar)();
}
const IconComp = () => "../../components/icon.js";
const ProductCard = () => "../../components/product-card.js";
const CustomTabbar = () => "../../components/custom-tabbar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const { statusBarHeight, navBarHeight, capsuleRight } = utils_navbar.getNavBarInfo();
    const bannerList = common_vendor.ref([
      "/static/banners/banner-figure-wide.png",
      "/static/banners/banner-stationery-wide.png",
      "/static/banners/banner-plush-wide.png"
    ]);
    const announcement = common_vendor.ref("");
    const categories = common_vendor.ref([]);
    const latestProducts = common_vendor.ref([]);
    const recommendProducts = common_vendor.ref([]);
    const dealProducts = common_vendor.ref([]);
    const hotProducts = common_vendor.ref([]);
    function loadData() {
      api_index.getHomeData().then((res) => {
        const data = res.data || {};
        const annList = data.announcements && data.announcements.list ? data.announcements.list : Array.isArray(data.announcements) ? data.announcements : [];
        if (annList.length) {
          announcement.value = annList[0].title || annList[0];
        }
        if (data.categories && data.categories.length) {
          categories.value = data.categories;
        }
        if (data.latestProducts && data.latestProducts.length) {
          latestProducts.value = data.latestProducts;
        }
        if (data.recommendProducts && data.recommendProducts.length) {
          recommendProducts.value = data.recommendProducts;
        }
      }).catch(() => {
      });
      if (!categories.value.length) {
        api_index.getCategoryList().then((res) => {
          if (res.data && res.data.length) {
            categories.value = res.data;
          }
        }).catch(() => {
        });
      }
      if (!latestProducts.value.length) {
        api_index.getLatestProducts(6).then((res) => {
          if (res.data && res.data.length) {
            latestProducts.value = res.data;
          }
        }).catch(() => {
        });
      }
      if (!recommendProducts.value.length) {
        api_index.getRecommendProducts(4).then((res) => {
          if (res.data && res.data.length) {
            recommendProducts.value = res.data;
          }
        }).catch(() => {
        });
      }
      api_index.getProductList({ page: 1, pageSize: 15 }).then((res) => {
        const data = res.data || {};
        const list = Array.isArray(data) ? data : data.list || [];
        dealProducts.value = [...list].filter((item) => Number(item.originalPrice) > Number(item.price)).sort((a, b) => Number(a.price) / Number(a.originalPrice) - Number(b.price) / Number(b.originalPrice)).slice(0, 2);
        hotProducts.value = [...list].sort((a, b) => Number(b.sales || 0) - Number(a.sales || 0)).slice(0, 3);
      }).catch(() => {
      });
    }
    common_vendor.onLoad(() => {
      loadData();
    });
    common_vendor.onPullDownRefresh(() => {
      loadData();
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 800);
    });
    function goAnnouncement() {
      common_vendor.index.navigateTo({ url: "/pages/announcement/list" });
    }
    function goCategory(item) {
      common_vendor.index.switchTab({ url: "/pages/category/category" });
    }
    function goMore() {
      common_vendor.index.switchTab({ url: "/pages/category/category" });
    }
    function goProduct(id) {
      common_vendor.index.navigateTo({ url: "/pages/product/detail?id=" + id });
    }
    function getDiscount(item) {
      const original = Number(item.originalPrice);
      const price = Number(item.price);
      if (!original || original <= price)
        return 10;
      return (price / original * 10).toFixed(1);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(navBarHeight) + "px",
        b: common_vendor.unref(capsuleRight) + "px",
        c: common_vendor.unref(statusBarHeight) + "px",
        d: common_vendor.f(bannerList.value, (img, idx, i0) => {
          return {
            a: common_vendor.unref(utils_image.fixImageUrl)(img),
            b: idx
          };
        }),
        e: announcement.value
      }, announcement.value ? {
        f: common_vendor.p({
          name: "bell",
          size: 36,
          color: "#E74860"
        }),
        g: common_vendor.t(announcement.value),
        h: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#E74860"
        }),
        i: common_vendor.o(goAnnouncement)
      } : {}, {
        j: categories.value.length
      }, categories.value.length ? {
        k: common_vendor.f(categories.value, (item, k0, i0) => {
          return {
            a: common_vendor.unref(utils_image.fixImageUrl)(item.icon),
            b: common_vendor.t(item.name),
            c: item.id,
            d: common_vendor.o(($event) => goCategory(), item.id)
          };
        })
      } : {}, {
        l: dealProducts.value.length
      }, dealProducts.value.length ? {} : {}, {
        m: dealProducts.value.length
      }, dealProducts.value.length ? {
        n: common_vendor.f(dealProducts.value, (item, k0, i0) => {
          return {
            a: common_vendor.unref(utils_image.fixImageUrl)(item.mainImage),
            b: common_vendor.t(getDiscount(item)),
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.price),
            e: common_vendor.t(item.originalPrice),
            f: item.id,
            g: common_vendor.o(($event) => goProduct(item.id), item.id)
          };
        })
      } : {}, {
        o: hotProducts.value.length
      }, hotProducts.value.length ? {} : {}, {
        p: hotProducts.value.length
      }, hotProducts.value.length ? {
        q: common_vendor.f(hotProducts.value, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.n("rank-" + (index + 1)),
            c: common_vendor.unref(utils_image.fixImageUrl)(item.mainImage),
            d: common_vendor.t(item.name),
            e: common_vendor.t(item.sales || 0),
            f: common_vendor.t(item.price),
            g: item.id,
            h: common_vendor.o(($event) => goProduct(item.id), item.id)
          };
        })
      } : {}, {
        r: latestProducts.value.length
      }, latestProducts.value.length ? {
        s: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#8C8C8C"
        }),
        t: common_vendor.o(goMore)
      } : {}, {
        v: latestProducts.value.length
      }, latestProducts.value.length ? {
        w: common_vendor.f(latestProducts.value, (item, k0, i0) => {
          return {
            a: common_vendor.unref(utils_image.fixImageUrl)(item.mainImage),
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.price),
            d: item.id,
            e: common_vendor.o(($event) => goProduct(item.id), item.id)
          };
        })
      } : {}, {
        x: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#8C8C8C"
        }),
        y: common_vendor.o(goMore),
        z: common_vendor.f(recommendProducts.value, (item, k0, i0) => {
          return {
            a: "1cf27b2a-4-" + i0,
            b: common_vendor.p({
              product: item
            }),
            c: item.id
          };
        }),
        A: common_vendor.p({
          name: "check_circle",
          size: 34,
          color: "#E74860"
        }),
        B: common_vendor.p({
          name: "truck",
          size: 34,
          color: "#E74860"
        }),
        C: common_vendor.p({
          name: "box",
          size: 34,
          color: "#E74860"
        }),
        D: common_vendor.p({
          current: 0
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
