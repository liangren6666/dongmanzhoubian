<template>
  <div class="announcement-page">
    <el-card shadow="hover" class="admin-page-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">公告管理</span>
          <el-button type="primary" :icon="Plus" @click="openDialog()">发布公告</el-button>
        </div>
      </template>

      <div class="table-toolbar">
        <span class="table-total">共 {{ total }} 条公告</span>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe border class="admin-table" empty-text="暂无公告">
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column label="公告内容" min-width="320">
          <template #default="{ row }">
            <div v-if="row.content" class="announcement-content" :title="row.content">
              {{ row.content }}
            </div>
            <span v-else class="empty-placeholder">暂无内容</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <TableStatusSwitch
              v-model="row.status"
              active-label="发布"
              inactive-label="下线"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link @click="openDetail(row)">查看</el-button>
              <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
              <el-popconfirm title="确定删除该公告？" @confirm="handleDelete(row.id)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
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

    <el-drawer v-model="detailVisible" title="公告详情" size="560px">
      <template v-if="currentRow">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="标题">{{ currentRow.title }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentRow.status === 1 ? 'success' : 'info'" size="small">
              {{ currentRow.status === 1 ? '发布中' : '已下线' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布时间">{{ formatDateTime(currentRow.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDateTime(currentRow.updatedAt) }}</el-descriptions-item>
        </el-descriptions>
        <h4 class="section-title">公告正文</h4>
        <div class="announcement-detail-content">{{ currentRow.content || '暂无内容' }}</div>
      </template>
    </el-drawer>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑公告' : '发布公告'"
      width="640px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            placeholder="请输入公告内容"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">发布</el-radio>
            <el-radio :value="0">下线</el-radio>
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
import { Plus } from '@element-plus/icons-vue'
import { getAnnouncementList, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/api'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils/format'
import TableStatusSwitch from '@/components/TableStatusSwitch.vue'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const currentRow = ref(null)
const isEdit = ref(false)
const formRef = ref()

const searchForm = reactive({
  page: 1,
  pageSize: 10
})

const form = reactive({
  id: null,
  title: '',
  content: '',
  status: 1
})

const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getAnnouncementList(searchForm)
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch {
    // handled
  } finally {
    loading.value = false
  }
}

const openDetail = (row) => {
  currentRow.value = row
  detailVisible.value = true
}

const openDialog = (row) => {
  isEdit.value = !!row
  if (row) {
    Object.assign(form, { id: row.id, title: row.title, content: row.content, status: row.status })
  } else {
    Object.assign(form, { id: null, title: '', content: '', status: 1 })
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateAnnouncement({ ...form })
    } else {
      await addAnnouncement({ ...form })
    }
    ElMessage.success(isEdit.value ? '编辑成功' : '发布成功')
    dialogVisible.value = false
    loadData()
  } catch {
    // handled
  } finally {
    submitLoading.value = false
  }
}

const handleStatusChange = async (row) => {
  try {
    await updateAnnouncement({ id: row.id, status: row.status })
    ElMessage.success('状态更新成功')
  } catch {
    row.status = row.status === 1 ? 0 : 1
  }
}

const handleDelete = async (id) => {
  try {
    await deleteAnnouncement(id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // handled
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.section-title {
  margin: 20px 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
