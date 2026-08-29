"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_image = require("../../utils/image.js");
if (!Math) {
  IconComp();
}
const IconComp = () => "../../components/icon.js";
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const store = common_vendor.useStore();
    const statusBarHeight = common_vendor.index.getSystemInfoSync().statusBarHeight;
    const currentTab = common_vendor.ref("login");
    const banners = [
      "/static/banners/banner-figure-wide.png",
      "/static/banners/banner-stationery-wide.png",
      "/static/banners/banner-plush-wide.png"
    ];
    const loginForm = common_vendor.reactive({ phone: "", password: "" });
    const registerForm = common_vendor.reactive({ phone: "", password: "", confirmPassword: "", nickname: "" });
    const loading = common_vendor.ref(false);
    function handleLogin() {
      if (loading.value)
        return;
      if (!/^1\d{10}$/.test(loginForm.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!loginForm.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      loading.value = true;
      store.dispatch("login", { phone: loginForm.phone, password: loginForm.password }).then(() => {
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/index/index" });
        }, 500);
      }).catch((err) => {
        common_vendor.index.showToast({ title: err && err.data && err.data.message || "登录失败", icon: "none" });
      }).finally(() => {
        loading.value = false;
      });
    }
    function handleRegister() {
      if (loading.value)
        return;
      if (!/^1\d{10}$/.test(registerForm.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!registerForm.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      if (registerForm.password !== registerForm.confirmPassword) {
        common_vendor.index.showToast({ title: "两次密码不一致", icon: "none" });
        return;
      }
      if (!registerForm.nickname) {
        common_vendor.index.showToast({ title: "请输入昵称", icon: "none" });
        return;
      }
      loading.value = true;
      api_index.register(registerForm.phone, registerForm.password, registerForm.nickname).then(() => {
        common_vendor.index.showToast({ title: "注册成功", icon: "success" });
        setTimeout(() => {
          currentTab.value = "login";
          loginForm.phone = registerForm.phone;
          loginForm.password = "";
        }, 500);
      }).catch((err) => {
        common_vendor.index.showToast({ title: err && err.data && err.data.message || "注册失败", icon: "none" });
      }).finally(() => {
        loading.value = false;
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(statusBarHeight) + "px",
        b: common_vendor.f(banners, (img, idx, i0) => {
          return {
            a: common_vendor.unref(utils_image.fixImageUrl)(img),
            b: idx
          };
        }),
        c: currentTab.value === "login" ? 1 : "",
        d: currentTab.value === "login"
      }, currentTab.value === "login" ? {} : {}, {
        e: currentTab.value === "login" ? 1 : "",
        f: common_vendor.o(($event) => currentTab.value = "login"),
        g: currentTab.value === "register" ? 1 : "",
        h: currentTab.value === "register"
      }, currentTab.value === "register" ? {} : {}, {
        i: currentTab.value === "register" ? 1 : "",
        j: common_vendor.o(($event) => currentTab.value = "register"),
        k: currentTab.value === "login"
      }, currentTab.value === "login" ? {
        l: common_vendor.p({
          name: "phone",
          size: 36,
          color: "#BFBFBF"
        }),
        m: loginForm.phone,
        n: common_vendor.o(($event) => loginForm.phone = $event.detail.value),
        o: common_vendor.p({
          name: "lock",
          size: 36,
          color: "#BFBFBF"
        }),
        p: loginForm.password,
        q: common_vendor.o(($event) => loginForm.password = $event.detail.value),
        r: common_vendor.o(handleLogin)
      } : {
        s: common_vendor.p({
          name: "phone",
          size: 36,
          color: "#BFBFBF"
        }),
        t: registerForm.phone,
        v: common_vendor.o(($event) => registerForm.phone = $event.detail.value),
        w: common_vendor.p({
          name: "lock",
          size: 36,
          color: "#BFBFBF"
        }),
        x: registerForm.password,
        y: common_vendor.o(($event) => registerForm.password = $event.detail.value),
        z: common_vendor.p({
          name: "lock",
          size: 36,
          color: "#BFBFBF"
        }),
        A: registerForm.confirmPassword,
        B: common_vendor.o(($event) => registerForm.confirmPassword = $event.detail.value),
        C: common_vendor.p({
          name: "user",
          size: 36,
          color: "#BFBFBF"
        }),
        D: registerForm.nickname,
        E: common_vendor.o(($event) => registerForm.nickname = $event.detail.value),
        F: common_vendor.o(handleRegister)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
