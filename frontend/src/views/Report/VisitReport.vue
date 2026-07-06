<script setup>
import { ref } from "vue";

import Card from "primevue/card";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

import { getVisitReport } from "../../services/reportService";

const start = ref(null);
const end = ref(null);

const data = ref([]);

const loading = ref(false);
const formatDate = (date) => {
  if (!date) return null;
  return date.toISOString().split("T")[0];
};

const loadData = async () => {

  loading.value = true;

  try {
    const startDate = formatDate(start.value);
    const endDate = formatDate(end.value);

    const res = await getVisitReport(
        startDate,
        endDate
    );

    data.value = res.data.response;

  } finally {

    loading.value = false;

  }

};
</script>

<template>

<Card>

<template #title>

Laporan Kunjungan Pasien

</template>

<template #content>

<div class="grid mb-4">

<div class="col-4">

<label>Tanggal Awal</label>

<Calendar
v-model="start"
dateFormat="yy-mm-dd"
showIcon
class="w-full"/>

</div>

<div class="col-4">

<label>Tanggal Akhir</label>

<Calendar
v-model="end"
dateFormat="yy-mm-dd"
showIcon
class="w-full"/>

</div>

<div class="col-4 flex align-items-end">

<Button
label="Tampilkan"
icon="pi pi-search"
@click="loadData"/>

</div>

</div>

<DataTable
:value="data"
:loading="loading">

<Column
header="Tanggal">

<template #body="{data}">

{{ new Date(data.registration_date).toLocaleDateString() }}

</template>

</Column>

<Column
header="No RM">

<template #body="{data}">

{{ data.patient_id?.medical_record_number }}

</template>

</Column>

<Column
header="Nama">

<template #body="{data}">

{{ data.patient_id?.name }}

</template>

</Column>

<Column
header="Poliklinik">

<template #body="{data}">

{{ data.clinic_id?.name }}

</template>

</Column>

<Column
header="Dokter">

<template #body="{data}">

{{ data.doctor_id?.name }}

</template>

</Column>

<Column
header="Asuransi">

<template #body="{data}">

{{ data.insurance_id?.name }}

</template>

</Column>

<Column
header="Jenis Layanan">

<template #body="{data}">

{{ data.service_type_id?.name }}

</template>

</Column>

</DataTable>

</template>

</Card>

</template>