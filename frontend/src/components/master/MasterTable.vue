<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Paginator from "primevue/paginator";
import Button from "primevue/button";
defineProps({
  data: Array,
  loading: Boolean,
  total: Number,
  rows: Number,
  columns: Array,
  module: String,
});
const goRegister = (patient) => {
  console.log(patient)
  router.push({
    name: "registration-form",
    query: {
      patient_id: patient._id,
    },
  });

};
const emit = defineEmits(["edit", "delete", "page"]);
</script>

<template>
  <DataTable :value="data" :loading="loading" responsiveLayout="scroll">
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
    >
      <template #body="{ data }">
        {{
          col.field.includes(".")
            ? col.field.split(".").reduce((obj, key) => obj?.[key], data)
            : data[col.field]
        }}
      </template>
    </Column>
    <Column header="Aksi">
      <template #body="{ data }">
        <Button
          icon="pi pi-pencil"
          severity="warning"
          size="small"
          class="mr-2"
          @click="emit('edit', data)"
        />

        <Button
          icon="pi pi-trash"
          severity="danger"
          size="small"
          @click="emit('delete', data)"
        />

        <Button
          v-if="module === 'patient'"
          label="Register"
          icon="pi pi-user-plus"
          severity="success"
          size="small"
          @click="emit('register', data)"
        />
      </template>
    </Column>
  </DataTable>

  <Paginator :rows="rows" :totalRecords="total" @page="emit('page', $event)" />
</template>