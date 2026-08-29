<template>
  <image class="c-icon" :src="src" :style="{ width: size + 'rpx', height: size + 'rpx' }" mode="aspectFit" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 40 },
  color: { type: String, default: '#4A4A4A' }
})

const svgMap = {
  // 导航
  back: (c) => `<path d="M15 18l-6-6 6-6" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  arrow: (c) => `<path d="M9 18l6-6-6-6" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  search: (c) => `<circle cx="11" cy="11" r="7" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M21 21l-4.35-4.35" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,

  // tabbar
  home: (c) => `<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V10.5z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/>`,
  'home-fill': (c) => `<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V10.5z" fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/>`,
  grid: (c) => `<rect x="3" y="3" width="8" height="8" rx="1.5" fill="none" stroke="${c}" stroke-width="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5" fill="none" stroke="${c}" stroke-width="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5" fill="none" stroke="${c}" stroke-width="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5" fill="none" stroke="${c}" stroke-width="1.5"/>`,
  'grid-fill': (c) => `<rect x="3" y="3" width="8" height="8" rx="1.5" fill="${c}" stroke="${c}" stroke-width="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5" fill="${c}" stroke="${c}" stroke-width="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5" fill="${c}" stroke="${c}" stroke-width="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5" fill="${c}" stroke="${c}" stroke-width="1.5"/>`,
  bag: (c) => `<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6h18" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  'bag-fill': (c) => `<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6h18" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>`,
  user: (c) => `<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  'user-fill': (c) => `<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" fill="${c}" stroke="${c}" stroke-width="1.5"/><path d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,

  // 功能
  bell: (c) => `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  calendar: (c) => `<rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M16 2v4M8 2v4M3 10h18" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  box: (c) => `<path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  truck: (c) => `<rect x="1" y="3" width="15" height="13" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 8h4l3 3v5h-7V8z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="18.5" cy="18.5" r="2.5" fill="none" stroke="${c}" stroke-width="1.5"/>`,
  check_circle: (c) => `<circle cx="12" cy="12" r="10" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M9 12l2 2 4-4" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  phone: (c) => `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  lock: (c) => `<rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  eye: (c) => `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="none" stroke="${c}" stroke-width="1.5"/>`,
  'eye-off': (c) => `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/><path d="M1 1l22 22" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  edit: (c) => `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  trash: (c) => `<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  location: (c) => `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="12" cy="10" r="3" fill="none" stroke="${c}" stroke-width="1.5"/>`,
  cart: (c) => `<circle cx="9" cy="21" r="1" fill="${c}"/><circle cx="20" cy="21" r="1" fill="${c}"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  minus: (c) => `<line x1="5" y1="12" x2="19" y2="12" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  plus: (c) => `<line x1="12" y1="5" x2="12" y2="19" stroke="${c}" stroke-width="2" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  close: (c) => `<line x1="18" y1="6" x2="6" y2="18" stroke="${c}" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  avatar: (c) => `<circle cx="12" cy="8" r="4" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M4 21c0-3.87 3.58-7 8-7s8 3.13 8 7" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`,
  info: (c) => `<circle cx="12" cy="12" r="10" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M12 16v-4M12 8h.01" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  star: (c) => `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="${c}"/>`,
}

function buildSvg(name, color) {
  const fn = svgMap[name]
  if (!fn) return ''
  const inner = fn(color)
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`)}`
}

const src = computed(() => buildSvg(props.name, props.color))
</script>

<style scoped>
.c-icon {
  flex-shrink: 0;
  display: block;
}
</style>
