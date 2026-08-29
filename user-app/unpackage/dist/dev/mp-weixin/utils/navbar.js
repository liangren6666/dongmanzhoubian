"use strict";
const common_vendor = require("../common/vendor.js");
function getNavBarInfo() {
  const systemInfo = common_vendor.index.getSystemInfoSync();
  const statusBarHeight = systemInfo.statusBarHeight || 0;
  const navBarHeight = 44;
  let capsuleRight = 96;
  const menuButton = common_vendor.index.getMenuButtonBoundingClientRect();
  if (menuButton && menuButton.top) {
    capsuleRight = systemInfo.windowWidth - menuButton.left + 8;
  }
  return {
    statusBarHeight,
    navBarHeight,
    capsuleRight,
    totalHeight: statusBarHeight + navBarHeight
  };
}
exports.getNavBarInfo = getNavBarInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/navbar.js.map
