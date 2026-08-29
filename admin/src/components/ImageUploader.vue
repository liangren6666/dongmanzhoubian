<template>
  <div class="image-uploader">
    <div class="input-row">
      <el-input
        v-model="inputUrl"
        :placeholder="placeholder"
        clearable
        @input="onUrlInput"
        @clear="onClear"
      >
        <template #append>
          <el-button @click="triggerUpload" :loading="uploading">
            <el-icon><Upload /></el-icon>
            上传
          </el-button>
        </template>
      </el-input>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onFileChange"
      />
    </div>
    <div v-if="previewUrl" class="preview">
      <el-image
        :src="previewUrl"
        :style="{ width: previewSize + 'px', height: previewSize + 'px' }"
        fit="cover"
      >
        <template #error>
          <div class="preview-error">加载失败</div>
        </template>
      </el-image>
      <el-icon class="remove-btn" @click="onClear"><CircleClose /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Upload, CircleClose } from '@element-plus/icons-vue'
import { uploadFile } from '@/api'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '输入图片URL 或点击上传' },
  previewSize: { type: Number, default: 80 }
})

const emit = defineEmits(['update:modelValue'])

const inputUrl = ref(props.modelValue || '')
const uploading = ref(false)
const fileInput = ref(null)

const previewUrl = computed(() => inputUrl.value || '')

watch(() => props.modelValue, (val) => {
  if (val !== inputUrl.value) {
    inputUrl.value = val || ''
  }
})

function onUrlInput(val) {
  emit('update:modelValue', val)
}

function onClear() {
  inputUrl.value = ''
  emit('update:modelValue', '')
}

function triggerUpload() {
  fileInput.value?.click()
}

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过 10MB')
    return
  }

  uploading.value = true
  try {
    const res = await uploadFile(file)
    inputUrl.value = res.data
    emit('update:modelValue', res.data)
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  } finally {
    uploading.value = false
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}
.preview {
  position: relative;
  display: inline-block;
  margin-top: 8px;
  border-radius: 6px;
  overflow: visible;
}
.preview .el-image {
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}
.preview-error {
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
</style>
