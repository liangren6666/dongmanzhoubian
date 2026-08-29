"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_auth = require("../../utils/auth.js");
const utils_image = require("../../utils/image.js");
const utils_navbar = require("../../utils/navbar.js");
if (!Math) {
  (IconComp + CustomTabbar)();
}
const IconComp = () => "../../components/icon.js";
const CustomTabbar = () => "../../components/custom-tabbar.js";
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const store = common_vendor.useStore();
    const { statusBarHeight, navBarHeight } = utils_navbar.getNavBarInfo();
    const defaultAvatar = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#EAEAEA"/><circle cx="40" cy="30" r="12" fill="#BFBFBF"/><path d="M16 68c0-13.3 10.7-24 24-24s24 10.7 24 24" fill="#BFBFBF"/></svg>');
    const logged = common_vendor.ref(false);
    const userInfo = common_vendor.ref(null);
    const showEditPopup = common_vendor.ref(false);
    const avatarLoadFailed = common_vendor.ref(false);
    const orderCounts = common_vendor.ref({ 0: 0, 1: 0, 2: 0, 3: 0 });
    const avatarUrl = common_vendor.computed(() => {
      var _a;
      if (avatarLoadFailed.value)
        return defaultAvatar;
      const url = (_a = userInfo.value) == null ? void 0 : _a.avatar;
      return utils_image.fixAvatarUrl(url) || defaultAvatar;
    });
    const editForm = common_vendor.reactive({
      nickname: "",
      gender: 0,
      birthday: ""
    });
    common_vendor.onShow(() => {
      logged.value = utils_auth.isLoggedIn();
      if (logged.value) {
        loadProfile();
        loadOrderCounts();
      } else {
        userInfo.value = null;
      }
    });
    function loadProfile() {
      avatarLoadFailed.value = false;
      api_index.getProfile().then((res) => {
        userInfo.value = res.data;
        store.commit("SET_USER_INFO", res.data);
        utils_auth.setUserInfo(res.data);
      }).catch(() => {
        userInfo.value = utils_auth.getUserInfo();
      });
    }
    function onAvatarError() {
      avatarLoadFailed.value = true;
    }
    function loadOrderCounts() {
      [0, 1, 2, 3].forEach((status) => {
        api_index.getOrderList(status, 1, 1).then((res) => {
          const d = res.data || {};
          const total = d.total || (d.list || []).length || 0;
          orderCounts.value[status] = total;
        }).catch(() => {
        });
      });
    }
    function maskPhone(phone) {
      if (!phone)
        return "";
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    }
    function goLogin() {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    }
    function goOrderList(status) {
      if (!logged.value) {
        goLogin();
        return;
      }
      const url = status !== void 0 ? "/pages/order/list?status=" + status : "/pages/order/list";
      common_vendor.index.navigateTo({ url });
    }
    function goPage(url) {
      if (!logged.value) {
        goLogin();
        return;
      }
      common_vendor.index.navigateTo({ url });
    }
    function goChat() {
      if (!logged.value) {
        goLogin();
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/chat/index" });
    }
    function goAnnouncement() {
      common_vendor.index.navigateTo({ url: "/pages/announcement/list" });
    }
    function showAbout() {
      common_vendor.index.showModal({
        title: "关于我们",
        content: "ACG周边商城 —— 发现你的二次元好物。致力于为动漫爱好者提供正版优质周边商品。",
        showCancel: false,
        confirmColor: "#E74860"
      });
    }
    function handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        confirmColor: "#E74860",
        success(res) {
          if (res.confirm) {
            store.dispatch("logout");
          }
        }
      });
    }
    function onBirthdayChange(e) {
      editForm.birthday = e.detail.value;
    }
    function saveProfile() {
      if (!editForm.nickname) {
        common_vendor.index.showToast({ title: "请输入昵称", icon: "none" });
        return;
      }
      api_index.updateProfile({
        nickname: editForm.nickname,
        gender: editForm.gender,
        birthday: editForm.birthday
      }).then(() => {
        common_vendor.index.showToast({ title: "保存成功", icon: "success" });
        showEditPopup.value = false;
        loadProfile();
      }).catch(() => {
        common_vendor.index.showToast({ title: "保存失败", icon: "none" });
      });
    }
    function openEdit() {
      const info = userInfo.value || {};
      editForm.nickname = info.nickname || "";
      editForm.gender = info.gender || 0;
      editForm.birthday = info.birthday || "";
      showEditPopup.value = true;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(navBarHeight) + "px",
        b: common_vendor.unref(statusBarHeight) + "px",
        c: logged.value
      }, logged.value ? {
        d: avatarUrl.value,
        e: common_vendor.o(onAvatarError),
        f: common_vendor.t(userInfo.value && userInfo.value.nickname || "用户"),
        g: common_vendor.t(maskPhone(userInfo.value && userInfo.value.phone)),
        h: common_vendor.o(openEdit)
      } : {
        i: common_vendor.p({
          name: "avatar",
          size: 60,
          color: "#BFBFBF"
        }),
        j: common_vendor.o(goLogin)
      }, {
        k: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#8C8C8C"
        }),
        l: common_vendor.o(($event) => goOrderList()),
        m: common_vendor.p({
          name: "calendar",
          size: 48,
          color: "#4A4A4A"
        }),
        n: orderCounts.value[0]
      }, orderCounts.value[0] ? {} : {}, {
        o: common_vendor.o(($event) => goOrderList(0)),
        p: common_vendor.p({
          name: "box",
          size: 48,
          color: "#4A4A4A"
        }),
        q: orderCounts.value[1]
      }, orderCounts.value[1] ? {} : {}, {
        r: common_vendor.o(($event) => goOrderList(1)),
        s: common_vendor.p({
          name: "truck",
          size: 48,
          color: "#4A4A4A"
        }),
        t: orderCounts.value[2]
      }, orderCounts.value[2] ? {} : {}, {
        v: common_vendor.o(($event) => goOrderList(2)),
        w: common_vendor.p({
          name: "check_circle",
          size: 48,
          color: "#4A4A4A"
        }),
        x: orderCounts.value[3]
      }, orderCounts.value[3] ? {} : {}, {
        y: common_vendor.o(($event) => goOrderList(3)),
        z: common_vendor.p({
          name: "location",
          size: 36,
          color: "#E74860"
        }),
        A: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#BFBFBF"
        }),
        B: common_vendor.o(($event) => goPage("/pages/address/list")),
        C: common_vendor.p({
          name: "phone",
          size: 36,
          color: "#52C41A"
        }),
        D: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#BFBFBF"
        }),
        E: common_vendor.o(goChat),
        F: common_vendor.p({
          name: "bell",
          size: 36,
          color: "#FAAD14"
        }),
        G: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#BFBFBF"
        }),
        H: common_vendor.o(goAnnouncement),
        I: common_vendor.p({
          name: "info",
          size: 36,
          color: "#409EFF"
        }),
        J: common_vendor.p({
          name: "arrow",
          size: 28,
          color: "#BFBFBF"
        }),
        K: common_vendor.o(showAbout),
        L: logged.value
      }, logged.value ? {
        M: common_vendor.o(handleLogout)
      } : {}, {
        N: showEditPopup.value
      }, showEditPopup.value ? {
        O: editForm.nickname,
        P: common_vendor.o(($event) => editForm.nickname = $event.detail.value),
        Q: editForm.gender === 1 ? 1 : "",
        R: common_vendor.o(($event) => editForm.gender = 1),
        S: editForm.gender === 2 ? 1 : "",
        T: common_vendor.o(($event) => editForm.gender = 2),
        U: editForm.gender === 0 ? 1 : "",
        V: common_vendor.o(($event) => editForm.gender = 0),
        W: common_vendor.t(editForm.birthday || "请选择生日"),
        X: !editForm.birthday ? 1 : "",
        Y: editForm.birthday,
        Z: common_vendor.o(onBirthdayChange),
        aa: common_vendor.o(($event) => showEditPopup.value = false),
        ab: common_vendor.o(saveProfile),
        ac: common_vendor.o(() => {
        }),
        ad: common_vendor.o(($event) => showEditPopup.value = false)
      } : {}, {
        ae: common_vendor.p({
          current: 3
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
