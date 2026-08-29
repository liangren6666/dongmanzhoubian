<template>
  <div class="user-page">
    <el-card shadow="hover" class="admin-page-card">
      <template #header>
        <span class="card-title">用户管理</span>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="昵称/手机号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" :value="1" />
            <el-option label="注销" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe border class="admin-table" empty-text="暂无用户">
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column label="性别" width="80" align="center">
          <template #default="{ row }">
            {{ row.gender === 1 ? '男' : row.gender === 2 ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '注销' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
              <el-popconfirm title="确定注销该用户？" @confirm="handleDelete(row.id)">
                <template #reference>
                  <el-button type="danger" link>注销</el-button>
                </template>
              </el-popconfirm>
            </div>
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

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="450px" destroy-on-close>
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="昵称">
          <el-input :model-value="form.nickname" disabled />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input :model-value="form.phone" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">注销</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getUserList, updateUser, deleteUser } from '@/api'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils/format'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const formRef = ref()

const searchForm = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: ''
})

const form = reactive({
  id: null,
  nickname: '',
  phone: '',
  status: 1
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getUserList(searchForm)
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
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.page = 1
  loadData()
}

const openDialog = (row) => {
  Object.assign(form, {
    id: row.id,
    nickname: row.nickname,
    phone: row.phone,
    status: row.status
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await updateUser({ id: form.id, status: form.status })
    ElMessage.success('更新成功')
    dialogVisible.value = false
    loadData()
  } catch {
    // handled
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (id) => {
  try {
    await deleteUser(id)
    ElMessage.success('操作成功')
    loadData()
  } catch {
    // handled
  }
}

onMounted(() => {
  loadData()
})
</script>