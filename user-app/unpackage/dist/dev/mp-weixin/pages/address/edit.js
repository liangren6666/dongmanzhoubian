"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Math) {
  IconComp();
}
const IconComp = () => "../../components/icon.js";
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const addressId = common_vendor.ref("");
    const form = common_vendor.reactive({
      receiver_name: "",
      receiver_phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
      isDefault: false
    });
    const regionValue = common_vendor.computed(() => {
      return [form.province || "", form.city || "", form.district || ""];
    });
    const regionSelected = common_vendor.computed(() => {
      return !!(form.province && form.city && form.district);
    });
    const regionDisplay = common_vendor.computed(() => {
      if (regionSelected.value) {
        return `${form.province} ${form.city} ${form.district}`;
      }
      return "请选择省/市/区";
    });
    common_vendor.onLoad(async (options) => {
      if (options.id) {
        addressId.value = options.id;
        common_vendor.index.setNavigationBarTitle({ title: "编辑地址" });
        await loadAddress(options.id);
      } else {
        common_vendor.index.setNavigationBarTitle({ title: "新增地址" });
      }
    });
    async function loadAddress(id) {
      try {
        common_vendor.index.showLoading({ title: "加载中" });
        const res = await api_index.getAddressList();
        const list = res.data || [];
        const target = list.find((item) => String(item.id) === String(id));
        if (target) {
          form.receiver_name = target.receiver_name || "";
          form.receiver_phone = target.receiver_phone || "";
          form.province = target.province || "";
          form.city = target.city || "";
          form.district = target.district || "";
          form.detail = target.detail || "";
          form.isDefault = !!target.isDefault;
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    function onRegionChange(e) {
      const val = e.detail.value;
      form.province = val[0] || "";
      form.city = val[1] || "";
      form.district = val[2] || "";
    }
    function validate() {
      if (!form.receiver_name.trim()) {
        common_vendor.index.showToast({ title: "请输入收货人姓名", icon: "none" });
        return false;
      }
      if (!/^1\d{10}$/.test(form.receiver_phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return false;
      }
      if (!form.province || !form.city || !form.district) {
        common_vendor.index.showToast({ title: "请选择所在地区", icon: "none" });
        return false;
      }
      if (!form.detail.trim()) {
        common_vendor.index.showToast({ title: "请输入详细地址", icon: "none" });
        return false;
      }
      return true;
    }
    async function handleSave() {
      if (!validate())
        return;
      const data = {
        receiver_name: form.receiver_name.trim(),
        receiver_phone: form.receiver_phone,
        province: form.province,
        city: form.city,
        district: form.district,
        detail: form.detail.trim(),
        isDefault: form.isDefault ? 1 : 0
      };
      try {
        common_vendor.index.showLoading({ title: "保存中" });
        if (addressId.value) {
          await api_index.updateAddress({ id: addressId.value, ...data });
        } else {
          await api_index.addAddress(data);
        }
        common_vendor.index.showToast({ title: "保存成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      } catch (e) {
        common_vendor.index.showToast({ title: "保存失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    return (_ctx, _cache) => {
      return {
        a: form.receiver_name,
        b: common_vendor.o(($event) => form.receiver_name = $event.detail.value),
        c: form.receiver_phone,
        d: common_vendor.o(($event) => form.receiver_phone = $event.detail.value),
        e: common_vendor.t(regionDisplay.value),
        f: common_vendor.n(regionSelected.value ? "" : "placeholder"),
        g: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#BFBFBF"
        }),
        h: regionValue.value,
        i: common_vendor.o(onRegionChange),
        j: form.detail,
        k: common_vendor.o(($event) => form.detail = $event.detail.value),
        l: form.isDefault,
        m: common_vendor.o(($event) => form.isDefault = $event.detail.value),
        n: common_vendor.o(handleSave)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dcb1f0d8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/edit.js.map
