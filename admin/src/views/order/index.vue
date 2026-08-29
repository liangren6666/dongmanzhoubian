<template>
  <div class="order-page">
    <el-card shadow="hover" class="admin-page-card">
      <template #header>
        <span class="card-title">订单管理</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form" @submit.prevent="handleSearch">
        <el-form-item label="订单编号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单编号" clearable style="width: 220px" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 140px">
            <el-option label="待付款" :value="0" />
            <el-option label="待发货" :value="1" />
            <el-option label="待收货" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已取消" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" native-type="submit">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="table-toolbar">
        <span class="table-total">共 {{ total }} 条订单</span>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe border class="admin-table" empty-text="暂无订单">
        <el-table-column prop="orderNo" label="订单编号" min-width="170" show-overflow-tooltip />
        <el-table-column label="商品信息" min-width="300">
          <template #default="{ row }">
            <div v-if="row.items?.length" class="order-items-cell">
              <div class="order-item-thumbs">
                <el-image
                  v-for="(item, idx) in row.items.slice(0, 3)"
                  :key="item.id || idx"
                  :src="item.productImage"
                  :preview-src-list="getPreviewImages(row.items)"
                  :initial-index="idx"
                  preview-teleported
                  class="order-item-thumb"
                  fit="cover"
                />
                <span v-if="row.items.length > 3" class="order-item-more">+{{ row.items.length - 3 }}</span>
              </div>
              <div class="order-item-summary">
                <div class="order-item-names" :title="getItemNames(row.items)">
                  {{ getItemNames(row.items) }}
                </div>
                <div class="order-item-meta">
                  {{ row.items.length }} 种商品 · 共 {{ getTotalQuantity(row.items) }} 件
                </div>
              </div>
            </div>
            <span v-else class="empty-placeholder">暂无商品</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户" width="110" show-overflow-tooltip />
        <el-table-column label="收货信息" min-width="190">
          <template #default="{ row }">
            <div class="receiver-cell">
              <div class="receiver-name">{{ row.receiverName }} {{ row.receiverPhone }}</div>
              <div class="text-muted" :title="row.receiverAddress">{{ row.receiverAddress }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="100" align="right">
          <template #default="{ row }">
            <span class="price-text">¥{{ formatMoney(row.payAmount || row.totalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link @click="openDetail(row)">详情</el-button>
              <el-button v-if="row.status === 1" type="warning" link @click="openShipDialog(row)">发货</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="searchForm.page"
          v-model:page-size="searchForm.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <el-drawer v-model="drawerVisible" title="订单详情" size="640px">
      <template v-if="orderDetail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单编号" :span="2">{{ orderDetail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="statusType(orderDetail.status)" size="small">{{ statusText(orderDetail.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="下单用户">
            {{ orderDetail.userInfo?.nickname || orderDetail.userName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="收货人">{{ orderDetail.receiverName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ orderDetail.receiverPhone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ orderDetail.receiverAddress }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ formatDateTime(orderDetail.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ formatDateTime(orderDetail.payTime) }}</el-descriptions-item>
          <el-descriptions-item label="发货时间">{{ formatDateTime(orderDetail.shipTime) }}</el-descriptions-item>
          <el-descriptions-item label="收货时间">{{ formatDateTime(orderDetail.receiveTime) }}</el-descriptions-item>
          <el-descriptions-item label="买家备注" :span="2">{{ orderDetail.remark || '无' }}</el-descriptions-item>
        </el-descriptions>

        <h4 class="section-title">商品明细</h4>
        <el-table :data="orderDetail.items || []" border size="small" class="detail-items-table">
          <el-table-column label="商品" min-width="260">
            <template #default="{ row }">
              <div class="product-cell">
                <el-image
                  :src="row.productImage"
                  class="thumb-image"
                  fit="cover"
                  :preview-src-list="[row.productImage]"
                  preview-teleported
                />
                <div class="product-info">
                  <div class="product-name" :title="row.productName">{{ row.productName }}</div>
                  <div class="product-id">商品ID: {{ row.productId }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="100" align="right">
            <template #default="{ row }">¥{{ formatMoney(row.price) }}</template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="70" align="center" />
          <el-table-column label="小计" width="100" align="right">
            <template #default="{ row }">
              <span class="price-text">¥{{ formatMoney(row.price * row.quantity) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="order-summary">
          <div class="summary-row">
            <span>商品总额</span>
            <span>¥{{ formatMoney(orderDetail.totalAmount) }}</span>
          </div>
          <div class="summary-row summary-pay">
            <span>实付金额</span>
            <span class="price-text">¥{{ formatMoney(orderDetail.payAmount || orderDetail.totalAmount) }}</span>
          </div>
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="shipDialogVisible" title="订单发货" width="450px" destroy-on-close>
      <el-form :model="shipForm" label-width="90px">
        <el-form-item label="订单编号">
          <el-input :model-value="shipForm.orderNo" disabled />
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="shipForm.trackingNo" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="shipLoading" @click="handleShip">确认发货</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getOrderList, getOrderDetail, shipOrder } from '@/api'
import { ElMessage } from 'element-plus'
import { formatDateTime, formatMoney } from '@/utils/format'

const loading = ref(false)
const shipLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const drawerVisible = ref(false)
const shipDialogVisible = ref(false)
const orderDetail = ref(null)

const searchForm = reactive({
  page: 1,
  pageSize: 10,
  orderNo: '',
  status: ''
})

const shipForm = reactive({
  orderId: null,
  orderNo: '',
  trackingNo: ''
})

const statusMap = {
  0: { text: '待付款', type: 'warning' },
  1: { text: '待发货', type: 'danger' },
  2: { text: '待收货', type: '' },
  3: { text: '已完成', type: 'success' },
  4: { text: '已取消', type: 'info' }
}
const statusText = (s) => statusMap[s]?.text || '未知'
const statusType = (s) => statusMap[s]?.type || 'info'

const getPreviewImages = (items) => (items || []).map((item) => item.productImage).filter(Boolean)

const getItemNames = (items) => {
  if (!items?.length) return '-'
  const first = items[0].productName
  if (items.length === 1) return first
  return `${first} 等${items.length}种商品`
}

const getTotalQuantity = (items) => {
  if (!items?.length) return 0
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0)
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getOrderList({
      page: searchForm.page,
      pageSize: searchForm.pageSize,
      status: searchForm.status === '' ? undefined : searchForm.status,
      keyword: searchForm.orderNo || undefined
    })
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch {
    // handled
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchForm.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.status = ''
  searchForm.page = 1
  loadData()
}

const openDetail = async (row) => {
  try {
    const res = await getOrderDetail(row.id)
    orderDetail.value = {
      ...res.data,
      userName: row.userName
    }
    drawerVisible.value = true
  } catch {
    // handled
  }
}

const openShipDialog = (row) => {
  shipForm.orderId = row.id
  shipForm.orderNo = row.orderNo
  shipForm.trackingNo = ''
  shipDialogVisible.value = true
}

const handleShip = async () => {
  if (!shipForm.trackingNo) {
    ElMessage.warning('请输入快递单号')
    return
  }
  shipLoading.value = true
  try {
    await shipOrder(shipForm.orderId, { trackingNo: shipForm.trackingNo })
    ElMessage.success('发货成功')
    shipDialogVisible.value = false
    loadData()
  } catch {
    // handled
  } finally {
    shipLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.text-muted {
  color: #999;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.price-text {
  color: #E74860;
  font-weight: 600;
}
.section-title {
  margin: 20px 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
.product-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.product-info {
  min-width: 0;
  flex: 1;
}
.product-name {
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-id {
  margin-top: 2px;
  font-size: 12px;
  color: #909399;
}
.order-summary {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #606266;
}
.summary-pay {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
