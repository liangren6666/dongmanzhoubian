"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Math) {
  (IconComp + EmptyState)();
}
const IconComp = () => "../../components/icon.js";
const EmptyState = () => "../../components/empty-state.js";
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const addresses = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    common_vendor.onShow(() => {
      loadAddresses();
    });
    async function loadAddresses() {
      loading.value = true;
      try {
        const res = await api_index.getAddressList();
        addresses.value = res.data || [];
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    }
    function handleEdit(item) {
      common_vendor.index.navigateTo({ url: "/pages/address/edit?id=" + item.id });
    }
    function handleAdd() {
      common_vendor.index.navigateTo({ url: "/pages/address/edit" });
    }
    function handleDelete(item) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除该地址吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_index.deleteAddress(item.id);
              common_vendor.index.showToast({ title: "已删除", icon: "success" });
              loadAddresses();
            } catch (e) {
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            }
          }
        }
      });
    }
    async function handleSetDefault(item) {
      try {
        await api_index.setDefaultAddress(item.id);
        common_vendor.index.showToast({ title: "设置成功", icon: "success" });
        loadAddresses();
      } catch (e) {
        common_vendor.index.showToast({ title: "设置失败", icon: "none" });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: addresses.value.length > 0
      }, addresses.value.length > 0 ? {
        b: common_vendor.f(addresses.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.receiver_name),
            b: common_vendor.t(item.receiver_phone),
            c: item.isDefault
          }, item.isDefault ? {} : {}, {
            d: common_vendor.t(item.province),
            e: common_vendor.t(item.city),
            f: common_vendor.t(item.district),
            g: common_vendor.t(item.detail),
            h: !item.isDefault
          }, !item.isDefault ? {
            i: common_vendor.o(($event) => handleSetDefault(item), item.id)
          } : {}, {
            j: "90a3874e-0-" + i0,
            k: common_vendor.o(($event) => handleEdit(item), item.id),
            l: "90a3874e-1-" + i0,
            m: common_vendor.o(($event) => handleDelete(item), item.id),
            n: item.id
          });
        }),
        c: common_vendor.p({
          name: "edit",
          size: 28,
          color: "#409EFF"
        }),
        d: common_vendor.p({
          name: "trash",
          size: 28,
          color: "#F56C6C"
        })
      } : !loading.value ? {
        f: common_vendor.p({
          text: "暂无收货地址",
          icon: "address"
        })
      } : {}, {
        e: !loading.value,
        g: common_vendor.o(handleAdd)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-90a3874e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/list.js.map
