<template>

  <Toolbar class="mb-4">

    <template #start>

      <div>

        <h3 class="m-0">
          {{ title }}
        </h3>

        <small class="text-color-secondary">
          {{ subtitle }}
        </small>

      </div>

    </template>

    <template #end>

      <div
        class="
          flex
          align-items-center
          gap-2
        "
      >

        <slot />

      </div>

    </template>

  </Toolbar>

</template>

<script setup>
import Toolbar from 'primevue/toolbar'

defineProps({
  title: String,
  subtitle: String,
})
</script>