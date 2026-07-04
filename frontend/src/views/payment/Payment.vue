<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { useRouter } from "vue-router";
import { getData } from "../../services/paymentService";
const router = useRouter();
const loading = ref(false);
const payments = ref([]);
const loadData = async () => {
loading.value = true;
try {
const res = await getData();
payments.value =
res.data.response;
} finally {
loading.value = false;
}
};
const openPayment = (row) => {
router.push({
name: "payment-detail",
query: {
id: row._id,
},
});
};
onMounted(loadData);
</script>
<template>
<Card>
<template #title>
Daftar Tagihan
</template>
<template #content>
<DataTable
:value="payments"
:loading="loading"
>
<Column
field="patient_id.medical_record_number"
header="No RM"
/>
<Column
field="patient_id.name"
header="Pasien"
/>
<Column
field="total_amount"
header="Total"
/>
<Column header="Status">
<template #body="{ data }">
<Tag
:value="data.status"
:severity="
data.status === 'PAID'
? 'success'
: 'warning'
"
/>
</template>
</Column>
<Column header="Aksi">
<template #body="{ data }">
<Button
label="Bayar"
icon="pi pi-wallet"
@click="
openPayment(data)
"
/>
</template>
</Column>
</DataTable>
</template>
</Card>
</template>