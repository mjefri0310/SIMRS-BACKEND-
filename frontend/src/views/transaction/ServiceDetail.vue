<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Avatar from "primevue/avatar";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import AutoComplete from "primevue/autocomplete";
import { searchICD10 } from "../../services/icd10Service";

import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useRoute, useRouter } from "vue-router";
import { getRegistrationById } from "../../services/registrationService.js";
import { getRME, saveRME } from "../../services/rmeService";
import { getData as getMedicines } from "../../services/medicineService";
import { getData as getTindakan } from "../../services/tariffService";

const toast = useToast();
const confirm = useConfirm();
const route = useRoute();
const router = useRouter();
const selectedRegister = ref(null);
const listMedicine = ref([]);
const listICD10 = ref([]);
const selectedICD10 = ref(null);
const selectedMedicine = ref(null);
const listTindakan = ref([]);
const selectedTindakan=ref(null);
const loading = ref(false);
const infoRegistration = ref({
  clinic: null,
  doctor: null,
  registration_date: null,
  complaint: null,
});
const rme = ref({
  anamnesis: {
    complaint: "",
    history_disease: "",
    allergy: "",
  },

  pemeriksaan: {
    systolic: null,
    diastolic: null,
    temperature: null,
    pulse: null,
    respiration: null,
  },

  diagnosis: {
    diagnosis: "",
    icd10: {
      icd10_id: null,
      code: "",
      name: "",
    },
  },

  penggunaan_obat: [],
  tindakan: [],
});


const searchDiagnosis = async (event) => {
  try {
    const res = await searchICD10(event.query);
    listICD10.value = res.data.response;
  } catch (err) {
    console.error(err);
  }
};
const loadMasterData = async () => {
  try {
    const medicineRes = await getMedicines();
    const tindakan = await getTindakan();
    console.log("Medicine Response:", medicineRes);

    listMedicine.value = medicineRes.data.response;
    listTindakan.value = tindakan.data.response;
  } catch (err) {
    console.error(err);
  }
};
const loadRegistration = async (id) => {
  try {
    // loading.value = true;
    const response = await getRegistrationById(id);
    infoRegistration.value = response.data.response;
  } catch (error) {
    console.error(error);
  } finally {
    // loading.value = false;
  }
};

const loadRME = async () => {

  const res = await getRME(route.query.id);
  if (res.data.response) {
    rme.value = res.data.response;
  }
};

const addMedicine = () => {
  rme.value.penggunaan_obat.push({
    medicine_id: "",
    medicine_name: "",
    quantity: 1,
    unit_price: 0,
    subtotal: 0,
    aturanpakai: "1x1",
  });
};
const addTindakan = () => {
  rme.value.tindakan.push({
    tariff_id: "",
    tariff_name: "",
    quantity: 1,
    unit_price: 0,
    subtotal: 0,
  });
};

const selectMedicine = (row) => {
  const medicine = listMedicine.value.find((m) => m._id === row.medicine_id);
  console.log(medicine)
  if (!medicine) return;
  row.medicine_name = medicine.name;
  row.selling_price = medicine.selling_price || 0;
  row.unit_price = medicine.selling_price
  row.subtotal = row.quantity * row.unit_price;
};
const selectTindakan = (row) => {
  const tindakan = listTindakan.value.find((m) => m._id === row.tariff_id);
  console.log("Tindakan")
  console.log(row)
  if (!tindakan) return;
  row.tariff_name = tindakan.name;
  row.unit_price = tindakan.amount
  row.subtotal = row.quantity * row.unit_price;
};
const selectDiagnosis = (event) => {
  const item = event.value;

  rme.value.diagnosis.icd10 = {
    icd10_id: item._id,
    code: item.code,
    name: item.name,
  };
};
const updateMedicineSubtotal = (row) => {
  row.subtotal = row.quantity * row.unit_price;
};
const updateTindakanSubtotal = (row) => {
  row.subtotal = row.quantity * row.unit_price;
};
const removeMedicine = (index) => {
  rme.value.penggunaan_obat.splice(index, 1);
};
const removeTindakan = (index) => {
  rme.value.tindakan.splice(index, 1);
};

/* =======================
   SAVE RME
======================= */
const saveRMEData = async () => {
  try {
    loading.value = true;
    console.log(rme.value)

    await saveRME({
      registration_id: route.query.id,
      ...rme.value,
    });

    toast.add({
      severity: "success",
      summary: "Berhasil",
      detail: "RME berhasil disimpan",
      life: 3000,
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: err.response?.data?.metadata?.message || err.message,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
const getInitial = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

onMounted(async () => {
  if (route.query.id) {
    await loadMasterData();
    await loadRegistration(route.query.id);
    await loadRME();
  }
});
</script>

<template>
  <div class="grid">
    <!-- PROFILE PASIEN -->
    <div class="col-12">
      <Card class="patient-card">
        <template #title>
          <div class="flex align-items-center gap-3">
            <Avatar
              :label="getInitial(infoRegistration.patient_id?.name)"
              size="large"
              shape="circle"
            />

            <div>
              <div class="text-lg font-bold">
                {{ infoRegistration.patient_id?.name || "-" }}
              </div>
              <div class="text-sm text-500">
                {{ infoRegistration.patient_id?.medical_record_number || "-" }}
              </div>
            </div>
          </div>
          <hr v-if="infoRegistration.patient_id" class="my-3" />
        </template>

        <template #content>
          <div class="grid">
            <div class="col-3 mb-3">
              <div class="text-500 text-sm">NIK</div>
              <div class="font-medium">
                {{ infoRegistration.patient_id?.nik || "-" }}
              </div>
            </div>

            <div class="col-2 mb-3">
              <div class="text-500 text-sm">Gender</div>
              <div class="font-medium">
                {{ infoRegistration.patient_id?.gender || "-" }}
              </div>
            </div>

            <div class="col-2 mb-3">
              <div class="text-500 text-sm">Tanggal Lahir</div>
              <div class="font-medium">
                {{
                  infoRegistration.patient_id?.birth_date
                    ? new Date(
                        infoRegistration.patient_id.birth_date,
                      ).toLocaleDateString()
                    : "-"
                }}
              </div>
            </div>

            <div class="col-2 mb-3">
              <div class="text-500 text-sm">No HP</div>
              <div class="font-medium">
                {{ infoRegistration.patient_id?.phone || "-" }}
              </div>
            </div>

            <div class="col-3">
              <div class="text-500 text-sm">Alamat</div>
              <div class="font-medium line-height-3">
                {{ infoRegistration.patient_id?.address || "-" }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!--INFORMASI LAYANAN-->
    <div class="col-3">
      <Card>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span> Informasi Layanan </span>
          </div>
        </template>

        <template #content>
          <!-- riwayat registrasi pasien -->
          <div class="grid">
            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Tanggal Registrasi</div>
              <div class="font-medium">
                {{
                  infoRegistration.registration_date
                    ? new Date(
                        infoRegistration.registration_date,
                      ).toLocaleString()
                    : "-"
                }}
              </div>
            </div>

            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Jenis Layanan</div>
              <div class="font-medium">
                {{ infoRegistration.service_type_id?.name || "-" }}
              </div>
            </div>
            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Asuransi</div>
              <div class="font-medium">
                {{ infoRegistration.insurance_id?.name || "-" }}
              </div>
            </div>
            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Poliklinik</div>
              <div class="font-medium">
                {{ infoRegistration.clinic_id?.name || "-" }}
              </div>
            </div>

            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Dokter</div>
              <div class="font-medium">
                {{ infoRegistration.doctor_id?.name || "-" }}
              </div>
            </div>

            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Keluhan</div>
              <div class="font-medium line-height-3">
                {{ infoRegistration.complaint || "-" }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- FORM REKAM MEDIS -->
    <div class="col-9">
      <!-- form registrasi yang sudah kita buat sebelumnya -->
      <Card>
        <template #title> Rekam Medis </template>

        <template #content>
          <TabView>
            <!-- ANAMNESIS -->
            <TabPanel header="Anamnesis">
              <div class="grid">
                <div class="col-12 mb-3">
                  <label>Keluhan</label>
                  <Textarea v-model="rme.anamnesis.complaint" class="w-full" />
                </div>

                <div class="col-12 mb-3">
                  <label>Riwayat Penyakit</label>
                  <Textarea
                    v-model="rme.anamnesis.history_disease"
                    class="w-full"
                  />
                </div>

                <div class="col-12 mb-3">
                  <label>Alergi</label>
                  <Textarea v-model="rme.anamnesis.allergy" class="w-full" />
                </div>
              </div>
            </TabPanel>

            <!-- PEMERIKSAAN -->
            <TabPanel header="Pemeriksaan">
              <div class="grid">
                <div class="col-6 mb-3">
                  <label>Sistolik</label>
                  <InputText
                    v-model="rme.pemeriksaan.systolic"
                    class="w-full"
                  />
                </div>

                <div class="col-6 mb-3">
                  <label>Diastolik</label>
                  <InputText
                    v-model="rme.pemeriksaan.diastolic"
                    class="w-full"
                  />
                </div>

                <div class="col-4 mb-3">
                  <label>Suhu</label>
                  <InputText
                    v-model="rme.pemeriksaan.temperature"
                    class="w-full"
                  />
                </div>

                <div class="col-4 mb-3">
                  <label>Nadi</label>
                  <InputText v-model="rme.pemeriksaan.pulse" class="w-full" />
                </div>

                <div class="col-4 mb-3">
                  <label>Respirasi</label>
                  <InputText
                    v-model="rme.pemeriksaan.respiration"
                    class="w-full"
                  />
                </div>
              </div>
            </TabPanel>

            <!-- DIAGNOSIS -->
            <TabPanel header="Diagnosis">
              <div class="grid">
                <div class="col-12 mb-3">
                  <label>Diagnosis</label>
                  <AutoComplete
                    v-model="selectedICD10"
                    :suggestions="listICD10"
                    optionLabel="name"
                    dropdown
                    forceSelection
                    @complete="searchDiagnosis"
                    @item-select="selectDiagnosis"
                />
                </div>
                <div class="col-12 mb-3">
                  <label>Deskripsi Diagnosis</label>
                  <Textarea v-model="rme.diagnosis.diagnosis" class="w-full" />
                </div>
              </div>
            </TabPanel>

            <!-- RESEP -->
            <TabPanel header="Pemakaian Obat">
              <Button
                label="Tambah Obat"
                icon="pi pi-plus"
                class="mb-3"
                @click="addMedicine"
              />
              <div class="flex border-1 border-300 p-3 mb-3 gap-3 flex-wrap border-round">
                  <label for="" class="w-4">Nama Obat</label>
                  <label for="" class="w-2">Harga</label>
                  <label for="" class="w-1">Jumlah</label>
                  <label for="" class="w-2">Sub Total</label>
                  <label for="" class="w-2">Aturan Pakai</label>
              </div>
              <div
                v-for="(item, index) in rme.penggunaan_obat"
                :key="index"
                class="flex border-1 border-300 p-3 mb-3 gap-3 flex-wrap border-round"
              >
                <Dropdown
                  v-model="item.medicine_id"
                  :options="listMedicine"
                  optionLabel="name"
                  optionValue="_id"
                  class="w-4"
                  placeholder="Pilih Obat"
                  @change="selectMedicine(item)"
                />
                <InputText
                  :modelValue="item.unit_price"
                  disabled
                  class="w-2"
                />
                <InputText
                  v-model="item.quantity"
                  @input="updateMedicineSubtotal(item)"
                  class="w-1"
                />
                <InputText
                  :modelValue="item.subtotal"
                  disabled
                  class="w-1"
                />
                <InputText
                  v-model="item.aturanpakai"
                  class="w-2"
                />
                <Button
                icon="pi pi-trash"
                severity="danger"
                class="w-1"
                outlined
                @click="removeMedicine(index)"
              />
              </div>
              <!-- nanti bisa pakai DataTable / dynamic rows -->
            </TabPanel>

            <!-- TINDAKAN -->
            <TabPanel header="Tindakan">
              <Button
                label="Tambah Obat"
                icon="pi pi-plus"
                class="mb-3"
                @click="addTindakan"
              />
              <!--
               rme.value.tindakan.push({
    tariff_id: "",
    tariff_name: "",
    quantity: 1,
    unit_price: 0,
    subtotal: 0,
  });
              -->
              <div class="flex border-1 border-300 p-3 mb-3 gap-3 flex-wrap border-round">
                  <label for="" class="w-4">Nama Tindakan</label>
                  <label for="" class="w-2">Harga</label>
                  <label for="" class="w-1">Jumlah</label>
                  <label for="" class="w-2">Sub Total</label>
              </div>
              <div
                v-for="(item, index) in rme.tindakan"
                :key="index"
                class="flex border-1 border-300 p-3 mb-3 gap-3 flex-wrap border-round"
              >
                <Dropdown
                  v-model="item.tariff_id"
                  :options="listTindakan"
                  optionLabel="name"
                  optionValue="_id"
                  class="w-6"
                  placeholder="Pilih Tindakan"
                  @change="selectTindakan(item)"
                />
                <InputText
                  :modelValue="item.unit_price"
                  disabled
                  class="w-2"
                />
                <InputText
                  v-model="item.quantity"
                  @input="updateTindakanSubtotal(item)"
                  class="w-1"
                />
                <InputText
                  :modelValue="item.subtotal"
                  disabled
                  class="w-1"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  class="w-1"
                  outlined
                  @click="removeTindakan(index)"
                />
              </div>

              <!-- nanti bisa pakai dropdown + quantity -->
            </TabPanel>
          </TabView>
          <div class="mt-4 flex justify-content-end">
            <Button
              label="Simpan RME"
              icon="pi pi-save"
              :loading="loading"
              @click="saveRMEData"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>