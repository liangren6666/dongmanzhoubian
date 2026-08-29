import request from '@/utils/request'

// ========== 登录 ==========
export const adminLogin = (data) => request.post('/admin/login', data)

// ========== 控制台 ==========
export const getDashboard = (params) => request.get('/admin/dashboard', { params })

// ========== 客服管理 ==========
export const getChatSessions = () => request.get('/admin/chat/sessions')
export const getChatMessages = (sessionId) => request.get(`/admin/chat/messages/${sessionId}`)
export const sendChatMessage = (data) => request.post('/admin/chat/send', data)

// ========== 分类管理 ==========
export const getCategoryList = () => request.get('/admin/category/list')
export const addCategory = (data) => request.post('/admin/category/add', data)
export const updateCategory = (data) => request.put('/admin/category/update', data)
export const deleteCategory = (id) => request.delete(`/admin/category/delete/${id}`)

// ========== 商品管理 ==========
export const getProductList = (params) => request.get('/admin/product/list', { params })
export const addProduct = (data) => request.post('/admin/product/add', data)
export const updateProduct = (data) => request.put('/admin/product/update', data)
export const deleteProduct = (id) => request.delete(`/admin/product/delete/${id}`)

// ========== 用户管理 ==========
export const getUserList = (params) => request.get('/admin/user/list', { params })
export const updateUser = (data) => request.put('/admin/user/update', data)
export const deleteUser = (id) => request.delete(`/admin/user/delete/${id}`)

// ========== 订单管理 ==========
export const getOrderList = (params) => request.get('/admin/order/list', { params })
export const getOrderDetail = (id) => request.get(`/admin/order/detail/${id}`)
export const shipOrder = (id, data) => request.put(`/admin/order/ship/${id}`, data)

// ========== 评价管理 ==========
export const getReviewList = (params) => request.get('/admin/review/list', { params })
export const updateReviewStatus = (id, status) => request.put('/admin/review/update', { id, visible: status === 1 })

// ========== 文件上传 ==========
export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/admin/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// ========== 公告管理 ==========
export const getAnnouncementList = (params) => request.get('/admin/announcement/list', { params })
export const addAnnouncement = (data) => request.post('/admin/announcement/add', data)
export const updateAnnouncement = (data) => request.put('/admin/announcement/update', data)
export const deleteAnnouncement = (id) => request.delete(`/admin/announcement/delete/${id}`)
