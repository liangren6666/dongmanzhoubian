<template>
  <div class="status-cell">
    <el-switch
      :model-value="modelValue"
      :active-value="activeValue"
      :inactive-value="inactiveValue"
      size="small"
      @change="handleChange"
    />
    <span class="status-label" :class="isActive ? 'is-active' : 'is-inactive'">
      {{ isActive ? activeLabel : inactiveLabel }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, Boolean, String],
    required: true
  },
  activeValue: {
    type: [Number, Boolean, String],
    default: 1
  },
  inactiveValue: {
    type: [Number, Boolean, String],
    default: 0
  },
  activeLabel: {
    type: String,
    default: '启用'
  },
  inactiveLabel: {
    type: String,
    default: '禁用'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isActive = computed(() => props.modelValue === props.activeValue)

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
