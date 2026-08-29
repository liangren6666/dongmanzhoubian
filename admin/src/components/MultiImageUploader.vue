<template>
  <div class="multi-image-uploader">
    <div class="image-list">
      <div v-for="(url, index) in imageList" :key="index" class="image-item">
        <el-image :src="url" style="width: 80px; height: 80px" fit="cover">
          <template #error>
            <div class="img-error">失败</div>
          </template>
        </el-image>
        <el-icon class="remove-btn" @click="removeImage(index)"><CircleClose /></el-icon>
      </div>
      <div class="add-btn" @click="triggerUpload">
        <el-icon :size="24" color="#8c8c8c"><Plus /></el-icon>
        <span class="add-text">上传</span>
      </div>
    </div>

    <div class="url-input-row">
      <el-input
        v-model="urlInput"
        placeholder="粘贴图片URL后按回车添加"
        @keyup.enter="addUrlImage"
        clearable
        size="small"
      >
        <template #append>
          <el-button size="small" @click="addUrlImage">添加</el-button>
        </template>
      </el-input>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CircleClose, Plus } from '@element-plus/icons-vue'
import { uploadFile } from '@/api'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const imageList = ref([...(props.modelValue || [])])
const urlInput = ref('')
const fileInput = ref(null)

watch(() => props.modelValue, (val) => {
  const newVal = val || []
  if (JSON.stringify(newVal) !== JSON.stringify(imageList.value)) {
    imageList.value = [...newVal]
  }
})

function emitChange() {
  emit('update:modelValue', [...imageList.value])
}

function removeImage(index) {
  imageList.value.splice(index, 1)
  emitChange()
}

function addUrlImage() {
  const url = urlInput.value.trim()
  if (!url) return
  imageList.value.push(url)
  urlInput.value = ''
  emitChange()
}

function triggerUpload() {
  fileInput.value?.click()
}

async function onFileChange(e) {
  const files = Array.from(e.target.files || [])
  if (!files.length) return

  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      ElMessage.error(`${file.name} 超过 10MB，已跳过`)
      continue
    }
    try {
      const res = await uploadFile(file)
      imageList.value.push(res.data)
    } catch {
      ElMessage.error(`${file.name} 上传失败`)
    }
  }
  emitChange()
  fileInput.value.value = ''
}
</script>

<style scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.image-item {
  position: relative;
  border-radius: 6px;
  overflow: visible;
}
.image-item .el-image {
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}
.img-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #c0c4cc;
  font-size: 12px;
  background: #f5f7fa;
}
.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 18px;
  color: #f56c6c;
  cursor: pointer;
  background: #fff;
  border-radius: 50%;
  z-index: 1;
}
.remove-btn:hover {
  color: #e74860;
}
.add-btn {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.add-btn:hover {
  border-color: #409eff;
}
.add-text {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}
</style>
