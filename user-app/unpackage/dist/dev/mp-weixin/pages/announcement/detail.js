"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Math) {
  IconComp();
}
const IconComp = () => "../../components/icon.js";
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const detail = common_vendor.ref({});
    common_vendor.onLoad(async (options) => {
      if (options.id) {
        await loadDetail(options.id);
      }
    });
    async function loadDetail(id) {
      try {
        common_vendor.index.showLoading({ title: "加载中" });
        const res = await api_index.getAnnouncementDetail(id);
        detail.value = res.data || {};
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    function formatDate(dateStr) {
      if (!dateStr)
        return "";
      return dateStr.substring(0, 16).replace("T", " ");
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: detail.value.id
      }, detail.value.id ? {
        b: common_vendor.p({
          name: "bell",
          size: 36,
          color: "#E74860"
        }),
        c: common_vendor.t(detail.value.title),
        d: common_vendor.t(formatDate(detail.value.createdAt)),
        e: common_vendor.t(detail.value.content)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-92e34b79"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/announcement/detail.js.map
