// #ifdef H5
const IMG_BASE = ''
// #endif
// #ifndef H5
const IMG_BASE = 'http://127.0.0.1:8080'
// #endif

/**
 * 修正图片 URL：
 * - 相对路径（以 / 开头）→ 拼接后端 base URL
 * - 完整 URL（http/https/data:）→ 原样返回
 * - 空值 → 返回空字符串
 */
export function fixImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  // 小程序包内静态资源不经过后端地址拼接
  if (url.startsWith('/static/')) {
    return url
  }
  if (url.startsWith('/')) {
    return IMG_BASE + url
  }
  return url
}

/**
 * 修正头像 URL（小程序对网络 SVG 支持较差，自动转为 PNG）
 */
export function fixAvatarUrl(url) {
  if (!url) return ''
  let fixed = fixImageUrl(url)
  if (fixed.includes('dicebear.com')) {
    fixed = fixed.replace('/svg?', '/png?').replace('/svg/', '/png/').replace(/\/svg$/i, '/png')
  }
  return fixed
}
