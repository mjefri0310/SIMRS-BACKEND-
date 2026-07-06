<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import MasterTable from "../../components/master/MasterTable.vue";
import MasterForm from "../../components/master/MasterForm.vue";

import {
  getData,
  createData,
  updateData,
  deleteData,
} from "../../services/roomService";

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
const form = ref({
  code: "",
  name: "",
  room_class: "",
  capacity: null,
});

const columns = [
  {
    field: "code",
    header: "Kode",
  },

  {
    field: "name",
    header: "Nama",
  },

  {
    field: "room_class",
    header: "Class",
  },

  {
    field: "capacity",
    header: "Kapasitas",
  },

];

const fields = [
  {
    name: "code",
    label: "Kode",
    type: "text"
  },
  {
    name: "name",
    label: "Nama Ruangan",
    type: "text"
  },
  {
    name: "room_class",
    label: "Class",
    type: "dropdown",
    options: [
      { label: "VIP", value: "VIP" },
      { label: "VVIP", value: "VVIP" },
      { label: "Kelas 1", value: "Kelas 1" },
      { label: "Kelas 2", value: "Kelas 2" },
      { label: "Kelas 3", value: "Kelas 3" }
    ]
  },
  {
    name: "capacity",
    label: "Kapasitas",
    type: "number"
  }
];

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

onMounted(loadData);
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