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
} from "../../services/patientService";
import { useRouter } from "vue-router";

const router = useRouter();

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
  medical_record_number: "",
  nik: "",
  name: "",
  gender: "",
  birth_date: "",
  phone: "",
  address: "",
});

const columns = [
  {
    field: "medical_record_number",
    header: "Nomor Rekam Medis",
  },

  {
    field: "nik",
    header: "NIK",
  },

  {
    field: "name",
    header: "Nama",
  },

  {
    field: "gender",
    header: "Jenis Kelamin",
  },

  {
    field: "birth_date",
    header: "Tanggal Lahir",
  },

  {
    field: "phone",
    header: "Telepon",
  },

  {
    field: "address",
    header: "Alamat",
  },
];

const fields = [
  {
    name: "medical_record_number",
    label: "Nomor Rekam Medis",
    type: "text"
  },
  {
    name: "nik",
    label: "NIK",
    type: "text"
  },
  {
    name: "name",
    label: "Nama",
    type: "text"
  },
  {
    name: "gender",
    label: "Jenis Kelamin",
    type: "dropdown",
    options: [
      { label: "Laki-laki", value: "L" },
      { label: "Perempuan", value: "P" }
    ]
  },
  {
    name: "birth_date",
    label: "Tanggal Lahir",
    type: "date"
  },
  {
    name: "phone",
    label: "Telepon",
    type: "text"
  },
  {
    name: "address",
    label: "Alamat",
    type: "textarea"
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
    const response = await createData(form.value);
    router.push({
      name: "registration-form",
      query: {
        patient_id: response.data.response._id,
      },
    });
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
    medical_record_number: "",
    nik: "",
    name: "",
    gender: "",
    birth_date: "",
    phone: "",
    address: "",
  };
  dialog.value = true;
};

const goRegister = (patient) => {
  console.log(patient)
  router.push({
    name: "registration-form",
    query: {
      patient_id: patient._id,
    },
  });

};
onMounted(loadData);
</script>

<template>
  <Card>
    <template #title>
      <div class="flex justify-content-between align-items-center">
        <span> Pasien </span>

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
        :module="'patient'"
        @edit="edit"
        @delete="remove"
        @page="loadData"
        @register="goRegister"
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