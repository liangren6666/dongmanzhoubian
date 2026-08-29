"use strict";
const utils_request = require("../utils/request.js");
function login(phone, password) {
  return utils_request.post("/user/login", { phone, password });
}
function register(phone, password, nickname) {
  return utils_request.post("/user/register", { phone, password, nickname });
}
function getProfile() {
  return utils_request.get("/user/profile");
}
function updateProfile(data) {
  return utils_request.put("/user/profile", data);
}
function getCategoryList() {
  return utils_request.get("/category/list");
}
function getProductList(params) {
  return utils_request.get("/product/list", params);
}
function getProductDetail(id) {
  return utils_request.get("/product/detail/" + id);
}
function getRecommendProducts(limit) {
  return utils_request.get("/product/recommend", { limit });
}
function getLatestProducts(limit) {
  return utils_request.get("/product/latest", { limit });
}
function getCartList() {
  return utils_request.get("/cart/list");
}
function addToCart(productId, quantity) {
  return utils_request.post("/cart/add", { productId, quantity });
}
function updateCart(id, quantity, selected) {
  return utils_request.put("/cart/update", { id, quantity, selected });
}
function deleteCart(id) {
  return utils_request.del("/cart/delete/" + id);
}
function selectAllCart(selected) {
  return utils_request.put("/cart/select-all", { selected });
}
function getAddressList() {
  return utils_request.get("/address/list");
}
function addAddress(data) {
  return utils_request.post("/address/add", data);
}
function updateAddress(data) {
  return utils_request.put("/address/update", data);
}
function deleteAddress(id) {
  return utils_request.del("/address/delete/" + id);
}
function setDefaultAddress(id) {
  return utils_request.put("/address/set-default/" + id);
}
function createOrder(data) {
  return utils_request.post("/order/create", data);
}
function getOrderList(status, page, pageSize) {
  return utils_request.get("/order/list", { status, page, pageSize });
}
function cancelOrder(id) {
  return utils_request.put("/order/cancel/" + id);
}
function confirmReceive(id) {
  return utils_request.put("/order/confirm/" + id);
}
function payOrder(id) {
  return utils_request.put("/order/pay/" + id);
}
function addReview(data) {
  return utils_request.post("/review/add", data);
}
function getProductReviews(productId, page, pageSize) {
  return utils_request.get("/review/list", { productId, page, pageSize });
}
function getAnnouncementList(page, pageSize) {
  return utils_request.get("/announcement/list", { page, pageSize });
}
function getAnnouncementDetail(id) {
  return utils_request.get("/announcement/detail/" + id);
}
function getHomeData() {
  return utils_request.get("/home/data");
}
function createChatSession(data) {
  return utils_request.post("/chat/session", data || {});
}
function getChatMessages(sessionId) {
  return utils_request.get("/chat/messages", { sessionId });
}
function sendChatMessage(data) {
  return utils_request.post("/chat/send", data);
}
exports.addAddress = addAddress;
exports.addReview = addReview;
exports.addToCart = addToCart;
exports.cancelOrder = cancelOrder;
exports.confirmReceive = confirmReceive;
exports.createChatSession = createChatSession;
exports.createOrder = createOrder;
exports.deleteAddress = deleteAddress;
exports.deleteCart = deleteCart;
exports.getAddressList = getAddressList;
exports.getAnnouncementDetail = getAnnouncementDetail;
exports.getAnnouncementList = getAnnouncementList;
exports.getCartList = getCartList;
exports.getCategoryList = getCategoryList;
exports.getChatMessages = getChatMessages;
exports.getHomeData = getHomeData;
exports.getLatestProducts = getLatestProducts;
exports.getOrderList = getOrderList;
exports.getProductDetail = getProductDetail;
exports.getProductList = getProductList;
exports.getProductReviews = getProductReviews;
exports.getProfile = getProfile;
exports.getRecommendProducts = getRecommendProducts;
exports.login = login;
exports.payOrder = payOrder;
exports.register = register;
exports.selectAllCart = selectAllCart;
exports.sendChatMessage = sendChatMessage;
exports.setDefaultAddress = setDefaultAddress;
exports.updateAddress = updateAddress;
exports.updateCart = updateCart;
exports.updateProfile = updateProfile;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
