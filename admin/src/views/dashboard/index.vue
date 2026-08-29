<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: rgba(231, 72, 96, 0.1)">
              <el-icon :size="28" color="#E74860"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashData.orderCount || 0 }}</div>
              <div class="stat-label">订单总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: rgba(82, 196, 26, 0.1)">
              <el-icon :size="28" color="#52C41A"><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ formatMoney(dashData.totalRevenue) }}</div>
              <div class="stat-label">总营收(元)</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: rgba(64, 158, 255, 0.1)">
              <el-icon :size="28" color="#409EFF"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashData.userCount || 0 }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: rgba(250, 173, 20, 0.1)">
              <el-icon :size="28" color="#FAAD14"><Goods /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashData.productCount || 0 }}</div>
              <div class="stat-label">商品总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="chart-header">
              <span class="card-title">订单趋势</span>
              <div class="chart-filters">
                <el-radio-group v-model="trendPreset" size="small">
                  <el-radio-button label="7">近7天</el-radio-button>
                  <el-radio-button label="30">近30天</el-radio-button>
                  <el-radio-button label="90">近90天</el-radio-button>
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="custom">自定义</el-radio-button>
                </el-radio-group>
                <el-date-picker
                  v-if="trendPreset === 'custom'"
                  v-model="trendRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disableFutureDate"
                  size="small"
                  class="trend-picker"
                />
              </div>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-box" v-loading="trendLoading"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span class="card-title">商品分类分布</span>
          </template>
          <div ref="pieChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="order-card">
      <template #header>
        <span class="card-title">最近订单</span>
      </template>
      <el-table :data="dashData.recentOrders || []" stripe style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" width="200" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="payAmount" label="金额" width="120">
          <template #default="{ row }">¥{{ Number(row.payAmount || 0).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getDashboard } from '@/api'

const lineChartRef = ref()
const pieChartRef = ref()
let lineChart = null
let pieChart = null

const trendLoading = ref(false)
const trendPreset = ref('7')
const trendRange = ref([])
const trendReady = ref(false)

const dashData = reactive({
  orderCount: 0,
  totalRevenue: 0,
  userCount: 0,
  productCount: 0,
  orderTrend: [],
  categoryDistribution: [],
  recentOrders: [],
  trendStart: '',
  trendEnd: ''
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

const formatMoney = (val) => Number(val || 0).toFixed(2)

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const disableFutureDate = (date) => date.getTime() > Date.now()

const getPresetRange = (preset) => {
  const end = new Date()
  const start = new Date()
  if (preset === '7') {
    start.setDate(end.getDate() - 6)
    return { trendStart: formatDate(start), trendEnd: formatDate(end) }
  }
  if (preset === '30') {
    start.setDate(end.getDate() - 29)
    return { trendStart: formatDate(start), trendEnd: formatDate(end) }
  }
  if (preset === '90') {
    start.setDate(end.getDate() - 89)
    return { trendStart: formatDate(start), trendEnd: formatDate(end) }
  }
  if (preset === 'all') {
    return { trendAll: 'true' }
  }
  return {}
}

const buildTrendParams = () => {
  if (trendPreset.value === 'custom') {
    if (!trendRange.value || trendRange.value.length !== 2) return null
    return { trendStart: trendRange.value[0], trendEnd: trendRange.value[1] }
  }
  return getPresetRange(trendPreset.value)
}

const updateLineChart = (data) => {
  if (!lineChartRef.value) return
  const dates = (data || []).map((d) => d.date)
  const counts = (data || []).map((d) => d.count)

  if (!lineChart) {
    lineChart = echarts.init(lineChartRef.value)
  }

  lineChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: dates, boundaryGap: false },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      name: '订单数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#E74860' },
      lineStyle: { width: 3, color: '#E74860' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(231, 72, 96, 0.3)' },
          { offset: 1, color: 'rgba(231, 72, 96, 0.02)' }
        ])
      },
      data: counts
    }]
  }, true)
}

const initPieChart = (data) => {
  if (!pieChartRef.value) return
  if (!pieChart) {
    pieChart = echarts.init(pieChartRef.value)
  }
  pieChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center' },
    color: ['#E74860', '#F5A623', '#50C4B7', '#F76B8A', '#C4A6F7', '#6BD9E7'],
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: (data || []).map((d) => ({ name: d.name, value: d.count }))
    }]
  }, true)
}

const handleResize = () => {
  lineChart?.resize()
  pieChart?.resize()
}

const loadTrend = async (params = {}) => {
  trendLoading.value = true
  try {
    const res = await getDashboard(params)
    const data = res.data || {}
    dashData.orderTrend = data.orderTrend || []
    dashData.trendStart = data.trendStart || ''
    dashData.trendEnd = data.trendEnd || ''

    if (data.trendStart && data.trendEnd && trendPreset.value === 'all') {
      trendRange.value = [data.trendStart, data.trendEnd]
    }

    await nextTick()
    updateLineChart(dashData.orderTrend)
    return data
  } finally {
    trendLoading.value = false
  }
}

const loadDashboard = async () => {
  try {
    const res = await getDashboard({})
    const data = res.data || {}
    dashData.orderCount = data.orderCount || 0
    dashData.totalRevenue = data.totalRevenue || 0
    dashData.userCount = data.userCount || 0
    dashData.productCount = data.productCount || 0
    dashData.recentOrders = data.recentOrders || []
    dashData.categoryDistribution = data.categoryDistribution || []

    await nextTick()
    initPieChart(dashData.categoryDistribution)
  } catch {
    await nextTick()
    initPieChart([])
  }
}

watch(trendPreset, async (preset) => {
  if (!trendReady.value || preset === 'custom') return
  const params = buildTrendParams()
  if (!params) return
  await loadTrend(params)
})

watch(trendRange, async (range) => {
  if (!trendReady.value || trendPreset.value !== 'custom') return
  if (!range || range.length !== 2) return
  await loadTrend({ trendStart: range[0], trendEnd: range[1] })
})

onMounted(async () => {
  await loadDashboard()

  let params = getPresetRange('7')
  let trendData = await loadTrend(params)

  if (!trendData?.orderTrend?.some((item) => Number(item.count) > 0)) {
    trendPreset.value = 'all'
    params = { trendAll: 'true' }
    trendData = await loadTrend(params)
  }

  if (trendData?.trendStart && trendData?.trendEnd) {
    trendRange.value = [trendData.trendStart, trendData.trendEnd]
  }

  trendReady.value = true
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  lineChart?.dispose()
  pieChart?.dispose()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.stat-card {
  cursor: default;
}
.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1D1E2C;
  line-height: 1.2;
}
.stat-label {
  font-size: 14px;
  color: #8C8C8C;
  margin-top: 4px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.chart-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.trend-picker {
  width: 260px;
}
.chart-box {
  width: 100%;
  height: 320px;
}
</style>
