<template>
  <div class="review-page">
    <el-card shadow="hover" class="admin-page-card">
      <template #header>
        <span class="card-title">评价管理</span>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="显示" :value="1" />
            <el-option label="隐藏" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe border class="admin-table" empty-text="暂无评价">
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column label="用户" width="140">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="32" :src="row.userAvatar">
                {{ (row.userName || '?').charAt(0) }}
              </el-avatar>
              <span class="user-name" :title="row.userName">{{ row.userName || '未知用户' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品" min-width="160" show-overflow-tooltip />
        <el-table-column label="评分" width="140" align="center">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="200" show-overflow-tooltip />
        <el-table-column label="评价图片" width="140" align="center">
          <template #default="{ row }">
            <template v-if="row.images && row.images.length">
              <el-image
                v-for="(img, idx) in row.images.slice(0, 3)"
                :key="idx"
                :src="img"
                :preview-src-list="row.images"
                :initial-index="idx"
                preview-teleported
                class="thumb-image"
                style="width: 36px; height: 36px; margin-right: 4px"
                fit="cover"
              />
              <span v-if="row.images.length > 3" class="more-img">+{{ row.images.length - 3 }}</span>
            </template>
            <span v-else class="empty-placeholder">-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <TableStatusSwitch
              v-model="row.status"
              active-label="显示"
              inactive-label="隐藏"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="时间" width="170">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getReviewList, updateReviewStatus } from '@/api'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils/format'
import TableStatusSwitch from '@/components/TableStatusSwitch.vue'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const searchForm = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getReviewList(searchForm)
    tableData.value = (res.data?.list || []).map((item) => ({
      ...item,
      images: typeof item.images === 'string' ? JSON.parse(item.images || '[]') : (item.images || [])
    }))
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
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.page = 1
  loadData()
}

const handleStatusChange = async (row) => {
  try {
    await updateReviewStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch {
    row.status = row.status === 1 ? 0 : 1
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.more-img {
  font-size: 12px;
  color: #999;
}
</style>
