"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Math) {
  (IconComp + EmptyState)();
}
const IconComp = () => "../../components/icon.js";
const EmptyState = () => "../../components/empty-state.js";
const pageSize = 10;
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const list = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const page = common_vendor.ref(1);
    const hasMore = common_vendor.ref(true);
    const themeColors = ["#E74860", "#FAAD14", "#409EFF"];
    common_vendor.onShow(() => {
      page.value = 1;
      hasMore.value = true;
      loadList(true);
    });
    common_vendor.onReachBottom(() => {
      if (hasMore.value && !loading.value) {
        loadList(false);
      }
    });
    async function loadList(reset) {
      if (reset) {
        page.value = 1;
        hasMore.value = true;
      }
      if (!hasMore.value)
        return;
      loading.value = true;
      try {
        const res = await api_index.getAnnouncementList(page.value, pageSize);
        const d = res.data || {};
        const data = d.list || d || [];
        if (reset) {
          list.value = data;
        } else {
          list.value = [...list.value, ...data];
        }
        if (data.length < pageSize) {
          hasMore.value = false;
        }
        page.value++;
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    }
    function formatDate(dateStr) {
      if (!dateStr)
        return "";
      const text = dateStr.substring(0, 16).replace("T", " ");
      const date = new Date(text.replace(/-/g, "/"));
      if (Number.isNaN(date.getTime()))
        return text;
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const diff = (today - target) / (24 * 60 * 60 * 1e3);
      if (diff === 0)
        return `今天 ${text.slice(11, 16)}`;
      if (diff === 1)
        return `昨天 ${text.slice(11, 16)}`;
      return text;
    }
    function getPreview(content) {
      if (!content)
        return "点击查看公告详情";
      const text = content.replace(/\s+/g, " ").trim();
      return text.length > 48 ? `${text.slice(0, 48)}...` : text;
    }
    function isNew(dateStr) {
      if (!dateStr)
        return false;
      const date = new Date(dateStr.replace(/-/g, "/").replace("T", " "));
      if (Number.isNaN(date.getTime()))
        return false;
      const diff = Date.now() - date.getTime();
      return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1e3;
    }
    function goDetail(item) {
      common_vendor.index.navigateTo({ url: "/pages/announcement/detail?id=" + item.id });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: "bell",
          size: 48,
          color: "#E74860"
        }),
        b: list.value.length > 0
      }, list.value.length > 0 ? {
        c: common_vendor.f(list.value, (item, index, i0) => {
          return common_vendor.e({
            a: "6ec59e8b-1-" + i0,
            b: common_vendor.p({
              name: "bell",
              size: 40,
              color: themeColors[index % 3]
            }),
            c: common_vendor.n("theme-" + index % 3),
            d: common_vendor.t(item.title),
            e: isNew(item.createdAt)
          }, isNew(item.createdAt) ? {} : {}, {
            f: common_vendor.t(getPreview(item.content)),
            g: common_vendor.t(formatDate(item.createdAt)),
            h: "6ec59e8b-2-" + i0,
            i: item.id,
            j: common_vendor.o(($event) => goDetail(item), item.id)
          });
        }),
        d: common_vendor.p({
          name: "arrow",
          size: 24,
          color: "#E74860"
        }),
        e: common_vendor.t(hasMore.value ? "上拉加载更多" : "— 已经到底啦 —")
      } : loading.value ? {} : {
        g: common_vendor.p({
          text: "暂无公告，敬请期待",
          icon: "bell"
        })
      }, {
        f: loading.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ec59e8b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/announcement/list.js.map
