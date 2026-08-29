<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
      <div class="logo-area">
        <span v-if="!isCollapse" class="logo-text">ACG商城</span>
        <el-icon v-else :size="24" color="#fff"><Shop /></el-icon>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#1D1E2C"
        text-color="#A8ABB6"
        active-text-color="#E74860"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>控制台</template>
        </el-menu-item>

        <el-sub-menu index="goods">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/category">分类管理</el-menu-item>
          <el-menu-item index="/product">商品列表</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>

        <el-menu-item index="/order">
          <el-icon><ShoppingCart /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>

        <el-menu-item index="/review">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>评价管理</template>
        </el-menu-item>

        <el-menu-item index="/announcement">
          <el-icon><Bell /></el-icon>
          <template #title>公告管理</template>
        </el-menu-item>

        <el-menu-item index="/chat">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>客服管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.parent">{{ route.meta.parent }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="admin-info">
              <el-avatar :size="32" :src="adminStore.adminInfo?.avatar" />
              <span class="admin-name">{{ adminStore.adminInfo?.nickname || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/store'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const adminStore = useAdminStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      adminStore.logout()
    }).catch(() => {})
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.layout-aside {
  background: #1D1E2C;
  transition: width 0.3s;
  overflow: hidden;
}
.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.logo-text {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
}
.el-menu {
  border-right: none;
}
.layout-header {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 1;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}
.collapse-btn:hover {
  color: #E74860;
}
.header-right {
  display: flex;
  align-items: center;
}
.admin-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.admin-name {
  font-size: 14px;
  color: #333;
}
.layout-main {
  background: #F5F5F5;
  padding: 20px;
  overflow-y: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
