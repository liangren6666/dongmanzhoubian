<template>
  <div class="category-page">
    <el-card shadow="hover" class="admin-page-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">分类管理</span>
          <el-button type="primary" :icon="Plus" @click="openDialog()">新增分类</el-button>
        </div>
      </template>

      <div class="table-toolbar">
        <span class="table-total">共 {{ tableData.length }} 个分类</span>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        class="admin-table"
        empty-text="暂无分类数据"
      >
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="name" label="分类名称" min-width="140" show-overflow-tooltip />
        <el-table-column label="图标" width="80" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.icon"
              :src="row.icon"
              class="thumb-image"
              fit="cover"
              :preview-src-list="[row.icon]"
              preview-teleported
            />
            <span v-else class="empty-placeholder">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
        <el-table-column prop="productCount" label="商品数" width="90" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info" effect="plain">{{ row.productCount ?? 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <TableStatusSwitch
              v-model="row.status"
              active-label="启用"
              inactive-label="禁用"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
              <el-popconfirm title="确定删除该分类？" @confirm="handleDelete(row.id)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新增分类'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <ImageUploader v-model="form.icon" placeholder="输入图标URL 或点击上传" :preview-size="60" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
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
import { getCategoryList, addCategory, updateCategory, deleteCategory } from '@/api'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils/format'
import ImageUploader from '@/components/ImageUploader.vue'
import TableStatusSwitch from '@/components/TableStatusSwitch.vue'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const form = reactive({
  id: null,
  name: '',
  icon: '',
  sortOrder: 0
})

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getCategoryList()
    tableData.value = res.data || []
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

const openDialog = (row) => {
  isEdit.value = !!row
  if (row) {
    Object.assign(form, { id: row.id, name: row.name, icon: row.icon, sortOrder: row.sortOrder })
  } else {
    Object.assign(form, { id: null, name: '', icon: '', sortOrder: 0 })
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateCategory({ ...form })
    } else {
      await addCategory({ ...form })
    }
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    loadData()
  } catch {
    // handled by interceptor
  } finally {
    submitLoading.value = false
  }
}

const handleStatusChange = async (row) => {
  try {
    await updateCategory({ id: row.id, status: row.status })
    ElMessage.success('状态更新成功')
  } catch {
    row.status = row.status === 1 ? 0 : 1
  }
}

const handleDelete = async (id) => {
  try {
    await deleteCategory(id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // handled by interceptor
  }
}

onMounted(() => {
  loadData()
})
</script>
