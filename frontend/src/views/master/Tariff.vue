<script setup>
import { ref, onMounted, computed } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import MasterTable from "../../components/master/MasterTable.vue";
import MasterForm from "../../components/master/MasterForm.vue";

import { getServiceTypes } from "../../services/serviceTypeService"
import {
  getData,
  createData,
  updateData,
  deleteData,
} from "../../services/tariffService";

const toast = useToast();
const confirm = useConfirm();
const rows = ref(10);
const page = ref(1);
const total = ref(0);
const keyword = ref("");
const loading = ref(false);
const data = ref([]);
const dialog = ref(false);
const editMode = ref(false);
const serviceTypeOptions = ref([])

const form = ref({
  code: "",
  name: "",
  service_type_id: "",
  capacity: null,
});

const columns = [
  {
    field: "code",
    header: "Kode",
  },

  {
    field: "name",
    header: "Nama Layanan",
  },

  {
    field: "service_type_id.name",
    header: "Jenis Layanan",
  },

  {
    field: "amount",
    header: "Nominal",
  },

];

const fields = computed(() => [
  {
    name: "code",
    label: "Kode",
    type: "text"
  },
  {
    name: "name",
    label: "Nama Layanan",
    type: "text"
  },
  {
    name: "service_type_id",
    label: "Jenis Layanan",
    type: "dropdown",
    options: serviceTypeOptions.value
  },
  {
    name: "amount",
    label: "Nominal",
    type: "number"
  }
]);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getData({
      page: page.value,
      limit: rows.value,
      keyword: keyword.value,
    });
    data.value = res.data.response;
    total.value = res.data.pagination.total;
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  if (editMode.value) {
    await updateData(form.value._id, form.value);
  } else {
    await createData(form.value);
  }

  toast.add({
    severity: "success",
    summary: "Berhasil",
    detail: "Data tersimpan",
    life: 3000,
  });
  dialog.value = false;
  loadData();
};

const edit = (row) => {
  editMode.value = true;

  form.value = {
    ...row,
  };

  dialog.value = true;
};

const remove = (row) => {
  confirm.require({
    message: "Hapus data?",
    accept: async () => {
      await deleteData(row._id);
      loadData();
    },
  });
};

const addNew = () => {
  editMode.value = false;
  form.value = {
    code: "",
    name: "",
    room_class: "",
    capacity: null,
  };
  dialog.value = true;
};
onMounted(async () => {
  const res = await getServiceTypes()

  serviceTypeOptions.value = res.data.response.map(item => ({
    label: item.name,
    value: item._id
  }))
  console.log(serviceTypeOptions.value)
  loadData();
})
// onMounted(loadData);
</script>

<template>
  <Card>
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <span> Ruangan </span>

        <Button label="Tambah" icon="pi pi-plus" @click="addNew" />
      </div>
    </template>

    <template #content>
      <div class="mb-3">
        <InputText
          v-model="keyword"
          placeholder="Cari..."
          class="w-full"
          @keyup.enter="loadData"
        />
      </div>

      <MasterTable
        :data="data"
        :loading="loading"
        :total="total"
        :rows="rows"
        :columns="columns"
        @edit="edit"
        @delete="remove"
        @page="loadData"
      />
    </template>
  </Card>

  <MasterForm
    v-model:visible="dialog"
    :title="editMode ? 'Edit' : 'Tambah'"
    :form="form"
    :fields="fields"
    @save="save"
  />

  <ConfirmDialog />
</template>