"use strict";
const IMG_BASE = "http://127.0.0.1:8080";
function fixImageUrl(url) {
  if (!url)
    return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/static/")) {
    return url;
  }
  if (url.startsWith("/")) {
    return IMG_BASE + url;
  }
  return url;
}
function fixAvatarUrl(url) {
  if (!url)
    return "";
  let fixed = fixImageUrl(url);
  if (fixed.includes("dicebear.com")) {
    fixed = fixed.replace("/svg?", "/png?").replace("/svg/", "/png/").replace(/\/svg$/i, "/png");
  }
  return fixed;
}
exports.fixAvatarUrl = fixAvatarUrl;
exports.fixImageUrl = fixImageUrl;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/image.js.map
