<template>

  <div
    class="
      surface-section
      shadow-1
      px-4
      py-3
      flex
      justify-content-between
      align-items-center
    "
  >

    <!-- LEFT -->

    <div
      class="
        flex
        align-items-center
        gap-3
      "
    >

      <Button
        icon="pi pi-bars"
        text
        rounded
        @click="$emit('toggle-sidebar')"
      />

      <div>

        <h2 class="m-0">
          SIMRS APP
        </h2>

        <small class="text-color-secondary">
          Sistem Informasi Rumah Sakit
        </small>

      </div>

    </div>

    <!-- RIGHT -->

    <div
      class="
        flex
        align-items-center
        gap-3
      "
    >

      <Button
        icon="pi pi-bell"
        text
        rounded
      />

      <Avatar
        label="A"
        shape="circle"
      />

    </div>

  </div>

</template>

<script setup>
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
</script>