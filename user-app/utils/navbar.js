/**
 * 获取自定义导航栏高度信息（适配状态栏 + 微信胶囊按钮）
 */
export function getNavBarInfo() {
  const systemInfo = uni.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 0
  const navBarHeight = 44
  let capsuleRight = 96

  // #ifdef MP-WEIXIN
  const menuButton = uni.getMenuButtonBoundingClientRect()
  if (menuButton && menuButton.top) {
    capsuleRight = systemInfo.windowWidth - menuButton.left + 8
  }
  // #endif

  return {
    statusBarHeight,
    navBarHeight,
    capsuleRight,
    totalHeight: statusBarHeight + navBarHeight
  }
}
