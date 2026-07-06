<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import DatePicker from "primevue/datepicker";
import { useRouter } from "vue-router";
import { getData } from "../../services/registrationService";
import { getAll } from "../../services/clinicService";

const router = useRouter();
const services = ref([]);
const loading = ref(false);
const rows = ref(10);
const page = ref(1);
const total = ref(0);
const keyword = ref("");
const tgl = ref(new Date().toISOString().split("T")[0]);
const poli = ref("");
const poliOptions = ref([]);

// const loadData = async () => {
//   loading.value = true;
//   try {
//     const res = await getData({
//       page: page.value,
//       limit: rows.value,
//       keyword: keyword.value,
//     });
//     data.value = res.data.response;
//     total.value = res.data.pagination.total;
//   } finally {
//     loading.value = false;
//   }
// };

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getData({
      page: page.value,
      limit: rows.value,
      keyword: keyword.value,
      poli: poli.value,
      tgl: tgl.value,
    });

    console.log("API RESPONSE:", res.data);

    services.value = Array.isArray(res.data.response) ? res.data.response : [];
    console.log("SERVICES:", services.value);
  } finally {
    loading.value = false;
  }
};

const openDetail = (row) => {
  router.push({
    name: "service-detail",
    query: { id: row._id },
  });
};

const openRME = (row) => {
  router.push({
    name: "rme-form",
    params: { id: row._id },
  });
};
const getPoli = async () => {
  try {
    const res = await getAll();
    poliOptions.value = Array.isArray(res.data.response)
      ? res.data.response
      : [];
    console.log(poliOptions);
  } catch (error) {
    poliOptions.value = [];
  }
};

onMounted(async () => {
  await loadData();
  await getPoli();
});
</script>
<template>
  <Card>
    <template #title> Worklist Pelayanan </template>
    <template #content>
      <div class="flex gap-3 mb-3 flex-wrap">
        <Dropdown
          v-model="poli"
          :options="poliOptions"
          optionLabel="name"
          optionValue="_id"
          placeholder="Pilih Poliklinik"
          class="w-3"
          @change="loadData"
        />

        <DatePicker v-model="tgl" class="w-3" @update:modelValue="loadData" />

        <InputText
          v-model="keyword"
          placeholder="Cari..."
          class="w-5"
          @keyup.enter="loadData"
        />
        <Button label="Refresh" icon="pi pi-refresh" @click="loadData" />
      </div>
      <DataTable :value="services" :loading="loading">
        <Column header="No Registrasi">
          <template #body="{ data }">
            {{ data.registration_number }}
          </template>
        </Column>
        <Column header="Waktu Registrasi">
          <template #body="{ data }">
            {{ new Date(data.registration_date).toLocaleString() }}
          </template>
        </Column>
        <Column header="No RM">
          <template #body="{ data }">
            {{ data.patient_id?.medical_record_number }}
          </template>
        </Column>

        <Column header="Nama Pasien">
          <template #body="{ data }">
            {{ data.patient_id?.name }}
          </template>
        </Column>
        <Column header="Jenis Pelayanan">
          <template #body="{ data }">
            {{ data.service_type_id?.name || "-" }}
          </template>
        </Column>
        <Column header="Poliklinik">
          <template #body="{ data }">
            {{ data.clinic_id?.name || "-" }}
          </template>
        </Column>

        <Column header="Dokter">
          <template #body="{ data }">
            {{ data.doctor_id?.name || "-" }}
          </template>
        </Column>
        <Column header="Nomor Antrian">
          <template #body="{ data }">
            {{ data.queue_code }}
          </template>
        </Column>

        <Column header="Status">
          <template #body="{ data }">
            <Tag :value="data.status" />
          </template>
        </Column>

        <Column header="Aksi">
          <template #body="{ data }">
            <Button
              label="Detail"
              icon="pi pi-eye"
              class="mr-2"
              @click="openDetail(data)"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>