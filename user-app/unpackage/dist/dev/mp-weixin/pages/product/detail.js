"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_auth = require("../../utils/auth.js");
const utils_image = require("../../utils/image.js");
if (!Math) {
  IconComp();
}
const IconComp = () => "../../components/icon.js";
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const store = common_vendor.useStore();
    const product = common_vendor.ref({});
    const reviews = common_vendor.ref([]);
    const reviewCount = common_vendor.ref(0);
    const productId = common_vendor.ref("");
    const cartCount = common_vendor.computed(() => store.state.cartCount);
    const imageList = common_vendor.computed(() => {
      if (!product.value.images) {
        return product.value.mainImage ? [product.value.mainImage] : [];
      }
      try {
        const parsed = JSON.parse(product.value.images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : product.value.mainImage ? [product.value.mainImage] : [];
      } catch (e) {
        return product.value.mainImage ? [product.value.mainImage] : [];
      }
    });
    common_vendor.onLoad((options) => {
      productId.value = options.id;
      loadProduct();
      loadReviews();
      store.dispatch("fetchCartCount");
    });
    async function loadProduct() {
      try {
        common_vendor.index.showLoading({ title: "加载中" });
        const res = await api_index.getProductDetail(productId.value);
        product.value = res.data || {};
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    async function loadReviews() {
      try {
        const res = await api_index.getProductReviews(productId.value, 1, 3);
        const d = res.data || {};
        reviews.value = d.list || d || [];
        reviewCount.value = d.total || reviews.value.length;
      } catch (e) {
        reviews.value = [];
      }
    }
    function parseImages(images) {
      if (!images)
        return [];
      if (Array.isArray(images))
        return images;
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    function getReviewNickname(item) {
      return item.user && item.user.nickname || item.nickname || "匿名用户";
    }
    function getReviewAvatar(item) {
      const avatar = item.user && item.user.avatar || item.avatar;
      return utils_image.fixAvatarUrl(avatar) || "/static/default-avatar.png";
    }
    function formatDate(dateStr) {
      if (!dateStr)
        return "";
      return dateStr.substring(0, 16).replace("T", " ");
    }
    function previewImage(index) {
      common_vendor.index.previewImage({ urls: imageList.value, current: index });
    }
    function previewReviewImage(urls, index) {
      common_vendor.index.previewImage({ urls, current: index });
    }
    function scrollToReviews() {
    }
    function goChat() {
      if (!utils_auth.checkLogin())
        return;
      const name = encodeURIComponent(product.value.name || "");
      common_vendor.index.navigateTo({
        url: `/pages/chat/index?productId=${productId.value}&productName=${name}`
      });
    }
    function goCart() {
      common_vendor.index.switchTab({ url: "/pages/cart/cart" });
    }
    async function handleAddCart() {
      if (!utils_auth.checkLogin())
        return;
      try {
        common_vendor.index.showLoading({ title: "加载中" });
        await api_index.addToCart(product.value.id, 1);
        common_vendor.index.showToast({ title: "已加入购物车", icon: "success" });
        store.dispatch("fetchCartCount");
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    async function handleBuyNow() {
      if (!utils_auth.checkLogin())
        return;
      try {
        common_vendor.index.showLoading({ title: "加载中" });
        await api_index.addToCart(product.value.id, 1);
        store.dispatch("fetchCartCount");
        common_vendor.index.switchTab({ url: "/pages/cart/cart" });
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(imageList.value, (img, idx, i0) => {
          return {
            a: common_vendor.unref(utils_image.fixImageUrl)(img),
            b: common_vendor.o(($event) => previewImage(idx), idx),
            c: idx
          };
        }),
        b: common_vendor.t(product.value.price),
        c: product.value.originalPrice && Number(product.value.originalPrice) > Number(product.value.price)
      }, product.value.originalPrice && Number(product.value.originalPrice) > Number(product.value.price) ? {
        d: common_vendor.t(product.value.originalPrice)
      } : {}, {
        e: common_vendor.t(product.value.sales || 0),
        f: common_vendor.t(product.value.stock || 0),
        g: common_vendor.t(product.value.name),
        h: common_vendor.t(product.value.description),
        i: common_vendor.t(reviewCount.value),
        j: common_vendor.p({
          name: "arrow",
          size: 24,
          color: "#8C8C8C"
        }),
        k: common_vendor.o(scrollToReviews),
        l: reviews.value.length > 0
      }, reviews.value.length > 0 ? {
        m: common_vendor.f(reviews.value, (item, k0, i0) => {
          return common_vendor.e({
            a: getReviewAvatar(item),
            b: common_vendor.t(getReviewNickname(item)),
            c: common_vendor.f(5, (s, k1, i1) => {
              return {
                a: s,
                b: common_vendor.n(s <= item.rating ? "star-on" : "star-off")
              };
            }),
            d: common_vendor.t(item.content),
            e: parseImages(item.images).length > 0
          }, parseImages(item.images).length > 0 ? {
            f: common_vendor.f(parseImages(item.images), (img, i, i1) => {
              return {
                a: i,
                b: common_vendor.unref(utils_image.fixImageUrl)(img),
                c: common_vendor.o(($event) => previewReviewImage(parseImages(item.images), i), i)
              };
            })
          } : {}, {
            g: common_vendor.t(formatDate(item.createdAt)),
            h: item.id
          });
        })
      } : {}, {
        n: common_vendor.p({
          name: "phone",
          size: 48,
          color: "#4A4A4A"
        }),
        o: common_vendor.o(goChat),
        p: common_vendor.p({
          name: "cart",
          size: 36,
          color: "#4A4A4A"
        }),
        q: cartCount.value > 0
      }, cartCount.value > 0 ? {
        r: common_vendor.t(cartCount.value > 99 ? "99+" : cartCount.value)
      } : {}, {
        s: common_vendor.o(goCart),
        t: common_vendor.o(handleAddCart),
        v: common_vendor.o(handleBuyNow)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-acf502d9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/detail.js.map
