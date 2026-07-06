<template>
  <div class="p-5">
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="m-0">Data Pasien</h1>
        <small class="text-color-secondary">
          Master data pasien rumah sakit
        </small>
      </div>

      <Button
        label="Tambah Pasien"
        icon="pi pi-plus"
        @click="showDialog = true"
      />
    </div>

    <Card>
      <template #content>
        <InputText
          v-model="keyword"
          placeholder="Cari pasien..."
          class="w-full"
          @input="debouncedSearch"
        />
        <DataTable
          :value="patients"
          lazy
          paginator
          :rows="lazyParams.limit"
          :totalRecords="totalRecords"
          :loading="loading"
          @page="onPage"
          responsiveLayout="scroll"
          stripedRows
        >
          <Column header="No">
            <template #body="slotProps">
              {{
                (lazyParams.page - 1) * lazyParams.limit + slotProps.index + 1
              }}
            </template>
          </Column>
          <Column field="medical_record_number" header="No RM" />

          <Column field="nik" header="NIK" />

          <Column field="name" header="Nama" />

          <Column field="gender" header="JK" />

          <Column field="phone" header="Telepon" />

          <Column header="Aksi">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                severity="warning"
                text
                rounded
                @click="editPatient(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                @click="confirmDelete(
                  slotProps.data._id,
                  slotProps.data.name
                )"
              />

              <Button
                label="Register"
                icon="pi pi-user-plus"
                severity="success"
                size="small"
                @click="goRegister(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      :visible="showDialog"
      @update:visible="(value) => (showDialog = value)"
      modal
      header="Tambah Pasien"
      :style="{ width: '35rem' }"
    >
      <div class="flex flex-column gap-3">
        <div>
          <label>No RM</label>

          <InputText v-model="form.medical_record_number" class="w-full mt-2" />
        </div>

        <div>
          <label>NIK</label>

          <InputText v-model="form.nik" class="w-full mt-2" />
        </div>

        <div>
          <label>Nama</label>

          <InputText v-model="form.name" class="w-full mt-2" />
        </div>

        <div>
          <label>Jenis Kelamin</label>

          <Dropdown
            v-model="form.gender"
            :options="genderOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Pilih"
            class="w-full mt-2"
          />
        </div>

        <div>
          <label>Telepon</label>

          <InputText v-model="form.phone" class="w-full mt-2" />
        </div>

        <div>
          <label>Alamat</label>

          <Textarea v-model="form.address" rows="3" class="w-full mt-2" />
        </div>

        <Button
          :label="
            isEdit
              ? 'Update'
              : 'Simpan'
          "
          :icon="
            isEdit
              ? 'pi pi-pencil'
              : 'pi pi-save'
          "
          @click="savePatient"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Card from "primevue/card";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import debounce from "lodash/debounce";
import { useRouter } from "vue-router";

const router = useRouter();

import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from '../services/patientService.js.old'

const keyword = ref("");
const patients = ref([]);
const totalRecords = ref(0);
const toast = useToast();
const loading = ref(false);
// const showForm = ref(false);
const lazyParams = ref({
  page: 1,
  limit: 10,
});
const showDialog = ref(false);
const confirm = useConfirm();
const genderOptions = [
  {
    label: "Laki-laki",
    value: "L",
  },
  {
    label: "Perempuan",
    value: "P",
  },
];

const isEdit = ref(false);

const selectedId = ref(null);

const form = reactive({
  medical_record_number: "",
  nik: "",
  name: "",
  gender: "",
  phone: "",
  address: "",
});

const debouncedSearch = debounce(() => {
  lazyParams.value.page = 1;

  loadPatients();
}, 500);

const loadPatients = async () => {
  try {
    loading.value = true;

    const response = await getPatients(
      lazyParams.value.page,

      lazyParams.value.limit,

      keyword.value
    );

    patients.value = response.data.response;

    totalRecords.value = response.data.pagination.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const editPatient = (data) => {
  isEdit.value = true;

  selectedId.value = data._id;

  showDialog.value = true;

  form.medical_record_number = data.medical_record_number;

  form.nik = data.nik;

  form.name = data.name;

  form.gender = data.gender;

  form.birth_date = data.birth_date;

  form.phone = data.phone;

  form.address = data.address;
};
const searchPatients = () => {
  lazyParams.value.page = 1;

  loadPatients();
};

const savePatient = async () => {

  try {

    if (isEdit.value) {

      await updatePatient(
        selectedId.value,
        form
      )
       toast.add({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'Data pasien berhasil diupdate',
          life: 3000,
        })

    } else {

      await createPatient(form)
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Data pasien berhasil disimpan',
        life: 3000,
      })

      router.push({
        name: 'registration-form',
        query: {
          patient_id: selectedId.value,
        },
      })
    }

    resetForm()

    showDialog.value = false
    
    loadPatients()

  } catch (error) {

    console.error(error)
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail:
          error?.response?.data?.metadata?.message ||
          'Terjadi kesalahan',
        life: 3000,
      })
  }

}
const resetForm = () => {

  isEdit.value = false

  selectedId.value = null

  form.medical_record_number = ''
  form.nik = ''
  form.name = ''
  form.gender = ''
  form.birth_date = ''
  form.phone = ''
  form.address = ''

}


const confirmDelete = (id, name) => {

  confirm.require({

    message:
      `Hapus pasien ${name}?`,

    header: 'Konfirmasi Hapus',

    icon: 'pi pi-exclamation-triangle',

    rejectLabel: 'Batal',

    acceptLabel: 'Hapus',

    rejectProps: {
      severity: 'secondary',
      outlined: true,
    },

    acceptProps: {
      severity: 'danger',
    },

    accept: async () => {

      await removePatient(id)

    },

  })

};

const removePatient = async (id) => {

  try {

    await deletePatient(id)

    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Data pasien berhasil dihapus',
      life: 3000,
    })

    loadPatients()

  } catch (error) {

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gagal menghapus data',
      life: 3000,
    })

  }

};
const onPage = (event) => {
  lazyParams.value.page = event.page + 1;

  lazyParams.value.limit = event.rows;

  loadPatients();
};
onMounted(() => {
  loadPatients();
});
</script>