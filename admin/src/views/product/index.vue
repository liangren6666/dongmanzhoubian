<template>
  <div class="product-page">
    <el-card shadow="hover" class="admin-page-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">商品管理</span>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form" @submit.prevent="handleSearch">
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="全部分类" clearable style="width: 150px">
            <el-option
              v-for="c in categoryList"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="商品名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 110px">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="search-actions">
            <el-button type="primary" :icon="Search" native-type="submit">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            <el-button type="primary" plain :icon="Plus" @click="openDialog()">新增商品</el-button>
          </div>
        </el-form-item>
      </el-form>

      <div class="table-toolbar">
        <span class="table-total">共 {{ total }} 件商品</span>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        class="admin-table"
        empty-text="暂无商品数据"
      >
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column label="主图" width="80" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.mainImage"
              class="thumb-image"
              fit="cover"
              :preview-src-list="[row.mainImage]"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="220" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="110" show-overflow-tooltip />
        <el-table-column label="价格" width="120" align="right">
          <template #default="{ row }">
            <div class="price-cell">
              <div class="price-current">¥{{ formatMoney(row.price) }}</div>
              <div v-if="row.originalPrice" class="price-original">¥{{ formatMoney(row.originalPrice) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" align="center" />
        <el-table-column prop="sales" label="销量" width="80" align="center" />
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <TableStatusSwitch
              v-model="row.status"
              active-label="上架"
              inactive-label="下架"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
              <el-popconfirm title="确定删除该商品？" @confirm="handleDelete(row.id)">
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

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑商品' : '新增商品'"
      width="700px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="售价" prop="price">
              <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原价" prop="originalPrice">
              <el-input-number v-model="form.originalPrice" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 200px" />
        </el-form-item>
        <el-form-item label="主图" prop="mainImage">
          <ImageUploader v-model="form.mainImage" placeholder="输入主图URL 或点击上传" />
        </el-form-item>
        <el-form-item label="轮播图">
          <MultiImageUploader v-model="form.imagesList" />
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">上架</el-radio>
            <el-radio :value="0">下架</el-radio>
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
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getProductList, addProduct, updateProduct, deleteProduct, getCategoryList } from '@/api'
import { ElMessage } from 'element-plus'
import { formatMoney } from '@/utils/format'
import ImageUploader from '@/components/ImageUploader.vue'
import MultiImageUploader from '@/components/MultiImageUploader.vue'
import TableStatusSwitch from '@/components/TableStatusSwitch.vue'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const categoryList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const searchForm = reactive({
  page: 1,
  pageSize: 10,
  categoryId: '',
  keyword: '',
  status: ''
})

const form = reactive({
  id: null,
  name: '',
  categoryId: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  mainImage: '',
  imagesList: [],
  description: '',
  status: 1
})

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  mainImage: [{ required: true, message: '请上传或输入主图', trigger: 'blur' }]
}

const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    categoryList.value = res.data || []
  } catch {
    // handled
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getProductList(searchForm)
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
  searchForm.categoryId = ''
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.page = 1
  loadData()
}

const openDialog = (row) => {
  isEdit.value = !!row
  if (row) {
    Object.assign(form, {
      id: row.id,
      name: row.name,
      categoryId: row.categoryId,
      price: row.price,
      originalPrice: row.originalPrice,
      stock: row.stock,
      mainImage: row.mainImage,
      imagesList: Array.isArray(row.images) ? [...row.images] : [],
      description: row.description,
      status: row.status
    })
  } else {
    Object.assign(form, {
      id: null, name: '', categoryId: '', price: 0, originalPrice: 0,
      stock: 0, mainImage: '', imagesList: [], description: '', status: 1
    })
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const data = { ...form, images: form.imagesList }
    delete data.imagesList
    if (isEdit.value) {
      await updateProduct(data)
    } else {
      await addProduct(data)
    }
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
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
    await updateProduct({ id: row.id, status: row.status })
    ElMessage.success('状态更新成功')
  } catch {
    row.status = row.status === 1 ? 0 : 1
  }
}

const handleDelete = async (id) => {
  try {
    await deleteProduct(id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // handled
  }
}

onMounted(() => {
  loadCategories()
  loadData()
})
</script>
