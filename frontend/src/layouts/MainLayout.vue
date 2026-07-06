<template>

  <div class="layout-wrapper">
    <Toast />
    <ConfirmDialog />
    <!-- HEADER -->

    <AppHeader
      @toggle-sidebar="sidebarVisible = true"
    />

    <!-- BODY -->

    <div class="layout-body">

      <!-- SIDEBAR -->

      <Sidebar
        :visible="sidebarVisible"
        @update:visible="sidebarVisible = $event"
      >

        <AppSidebar />

      </Sidebar>

      <!-- CONTENT -->

      <main class="layout-content">

        <router-view />

      </main>

    </div>

  </div>

</template>

<script setup>
import { ref } from 'vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import Sidebar from 'primevue/sidebar'

import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'

const sidebarVisible = ref(true)
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  background: #f5f7fa;
}

.layout-body {
  display: flex;
}

.layout-content {
  flex: 1;
  padding: 20px;
}
</style>