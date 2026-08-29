                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       import { get, post, put, del } from '@/utils/request'

// ==================== 用户模块 ====================

export function login(phone, password) {
  return post('/user/login', { phone, password })
}

export function register(phone, password, nickname) {
  return post('/user/register', { phone, password, nickname })
}

export function getProfile() {
  return get('/user/profile')
}

export function updateProfile(data) {
  return put('/user/profile', data)
}

// ==================== 分类模块 ====================

export function getCategoryList() {
  return get('/category/list')
}

// ==================== 商品模块 ====================

export function getProductList(params) {
  return get('/product/list', params)
}

export function getProductDetail(id) {
  return get('/product/detail/' + id)
}

export function getRecommendProducts(limit) {
  return get('/product/recommend', { limit })
}

export function getLatestProducts(limit) {
  return get('/product/latest', { limit })
}

// ==================== 购物车模块 ====================

export function getCartList() {
  return get('/cart/list')
}

export function addToCart(productId, quantity) {
  return post('/cart/add', { productId, quantity })
}

export function updateCart(id, quantity, selected) {
  return put('/cart/update', { id, quantity, selected })
}

export function deleteCart(id) {
  return del('/cart/delete/' + id)
}

export function selectAllCart(selected) {
  return put('/cart/select-all', { selected })
}

// ==================== 地址模块 ====================

export function getAddressList() {
  return get('/address/list')
}

export function addAddress(data) {
  return post('/address/add', data)
}

export function updateAddress(data) {
  return put('/address/update', data)
}

export function deleteAddress(id) {
  return del('/address/delete/' + id)
}

export function setDefaultAddress(id) {
  return put('/address/set-default/' + id)
}

// ==================== 订单模块 ====================

export function createOrder(data) {
  return post('/order/create', data)
}

export function getOrderList(status, page, pageSize) {
  return get('/order/list', { status, page, pageSize })
}

export function getOrderDetail(id) {
  return get('/order/detail/' + id)
}

export function cancelOrder(id) {
  return put('/order/cancel/' + id)
}

export function confirmReceive(id) {
  return put('/order/confirm/' + id)
}

export function payOrder(id) {
  return put('/order/pay/' + id)
}

// ==================== 评价模块 ====================

export function addReview(data) {
  return post('/review/add', data)
}

export function getProductReviews(productId, page, pageSize) {
  return get('/review/list', { productId, page, pageSize })
}

// ==================== 公告模块 ====================

export function getAnnouncementList(page, pageSize) {
  return get('/announcement/list', { page, pageSize })
}

export function getAnnouncementDetail(id) {
  return get('/announcement/detail/' + id)
}

// ==================== 首页模块 ====================

export function getHomeData() {
  return get('/home/data')
}

// ==================== 客服模块 ====================

export function createChatSession(data) {
  return post('/chat/session', data || {})
}

export function getChatMessages(sessionId) {
  return get('/chat/messages', { sessionId })
}

export function sendChatMessage(data) {
  return post('/chat/send', data)
}
