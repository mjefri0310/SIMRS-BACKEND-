<script setup>
import { ref, onMounted } from "vue";
import { getExplorer } from "../../services/blockchainService";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Paginator from "primevue/paginator";
const loading = ref(false);
const blocks = ref([]);
const page = ref(1);
const rows = ref(10);
const total = ref(0);
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getExplorer({
      page: page.value,
      limit: rows.value,
    });
    console.log(res.data.response);
    blocks.value = res.data.response;
    total.value = res.data.pagination.total;
    console.clear();
    console.log("Data Total:");
    console.log(total.value);
    console.log("Data Blocks:");
    console.log(blocks.value);
  } finally {
    loading.value = false;
  }
};

const onPage = (e) => {
  page.value = e.page + 1;
  rows.value = e.rows;
  loadData();
};

onMounted(loadData);
</script>

<template>
  <Card>
    <template #title> Blockchain Explorer </template>
    <template #content>
      <DataTable
        :value="blocks"
        :loading="loading"
        dataKey="_id"
        responsiveLayout="scroll"
      >
        <Column field="index" header="Block" />
        <Column field="module" header="Module" />
        <Column field="entity" header="Entity" />
        <Column field="action" header="Action" />
        <Column header="Hash">
          <template #body="{ data }">
            {{ data.hash.substring(0, 20) }}...
          </template>
        </Column>
        <Column header="Timestamp">
          <template #body="{ data }">
            {{ new Date(data.timestamp).toLocaleString() }}
          </template>
        </Column>
      </DataTable>
      <Paginator :rows="rows" :totalRecords="total" @page="onPage" />
    </template>
  </Card>
</template>