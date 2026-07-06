<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Avatar from "primevue/avatar";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useRoute, useRouter } from "vue-router";
import { createData } from "../../services/registrationService.js";
import { getPatientById, getLastRegistration } from "../../services/patientService.js";
import { getData as getInsurances } from "../../services/insuranceService";
import { getData as getDoctors } from "../../services/doctorService";
import { getData as getPolikliniks } from "../../services/clinicService";
import { getServiceTypes} from "../../services/serviceTypeService";

const toast = useToast();
const confirm = useConfirm();
const route = useRoute();
const router = useRouter();
const selectedPatient = ref(null);
const listPoliklinik = ref([]);
const listDoctor = ref([]);
const listJenisLayanan = ref([]);
const listAsuransi = ref([]);
const lastRegistration = ref({
    clinic: null,
    doctor: null,
    registration_date: null,
    complaint: null,
});
const form = ref({
  patient_id: "",
  service_type_id: "",
  insurance_id: "",
  clinic_id: "",
  doctor_id: "",
  room_id: "",
  complaint: "",
});
const loadPatient = async (id) => {
  try {
    // loading.value = true;
    const response = await getPatientById(id);
    selectedPatient.value = response.data.response;

   
    // lastRegistration.value = lastRegResponse.data.response;

    // GET list poliklinik, doctor, jenis layanan, asuransi
    const [poliklinikRes, doctorRes, serviceTypeRes, insuranceRes] = await Promise.all([
      getPolikliniks(),
      getDoctors(),
      getServiceTypes(),
      getInsurances(),
    ]);
    listPoliklinik.value = poliklinikRes.data.response;
    listDoctor.value = doctorRes.data.response;
    listJenisLayanan.value = serviceTypeRes.data.response;
    listAsuransi.value = insuranceRes.data.response;

     // GET last registration
    const lastRegResponse = await getLastRegistration(id);
    if (lastRegResponse.data.metadata.code === 200) {
      lastRegistration.value = lastRegResponse.data.response;
    } else {
      lastRegistration.value = {
        clinic: null,
        doctor: null,
        registration_date: null,
        complaint: null,
      };
    }
  } catch (error) {
    console.error(error);
  } finally {
    // loading.value = false;
  }
};

const saveRegistration = async () => {
  // simpan data registrasi
  console.log("Form Data:", form.value);
  try {
    const response = await createData({
      patient_id: selectedPatient.value._id,
      service_type_id: form.value.service_type_id,
      insurance_id: form.value.insurance_id,
      clinic_id: form.value.clinic_id,
      doctor_id: form.value.doctor_id,
      complaint: form.value.complaint,
    });
    if (response.data.metadata.code === 201) {
      toast.add({
        severity: "success",
        summary: "Berhasil",
        detail: "Registrasi berhasil disimpan",
        life: 3000,
      });
      router.push({
        name: "patient",
      });
    }else{
      toast.add({
        severity: "error",
        summary: "Gagal",
        detail: response.data.metadata.message || "Registrasi gagal disimpan",
        life: 3000,
      });
    }
    // router.push({
    //   name: "registration-form",
    //   query: {
    //     patient_id: selectedPatient.value._id,
    //   },
    // });
  } catch (error) {
    console.error("Error saving registration:", error);
  }
};

const getInitial = (name = "") => name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

onMounted(async () => {
  if (route.query.patient_id) {
    await loadPatient(route.query.patient_id);
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
              :label="getInitial(selectedPatient?.name)"
              size="large"
              shape="circle"
            />

            <div>
              <div class="text-lg font-bold">
                {{ selectedPatient?.name || "-" }}
              </div>
              <div class="text-sm text-500">
                {{ selectedPatient?.medical_record_number || "-" }}
              </div>
            </div>
          </div>
          <hr v-if="selectedPatient" class="my-3" />
        </template>

        <template #content>
          <div class="grid">
            <div class="col-3 mb-3">
              <div class="text-500 text-sm">NIK</div>
              <div class="font-medium">
                {{ selectedPatient?.nik || "-" }}
              </div>
            </div>

            <div class="col-2 mb-3">
              <div class="text-500 text-sm">Gender</div>
              <div class="font-medium">
                {{ selectedPatient?.gender || "-" }}
              </div>
            </div>

            <div class="col-2 mb-3">
              <div class="text-500 text-sm">Tanggal Lahir</div>
              <div class="font-medium">
                {{
                  selectedPatient?.birth_date
                    ? new Date(selectedPatient.birth_date).toLocaleDateString()
                    : "-"
                }}
              </div>
            </div>

            <div class="col-2 mb-3">
              <div class="text-500 text-sm">No HP</div>
              <div class="font-medium">
                {{ selectedPatient?.phone || "-" }}
              </div>
            </div>

            <div class="col-3">
              <div class="text-500 text-sm">Alamat</div>
              <div class="font-medium line-height-3">
                {{ selectedPatient?.address || "-" }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- FORM REGISTRASI -->
    <div class="col-6">
      <!-- form registrasi yang sudah kita buat sebelumnya -->
      <Card>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span> Form Registrasi </span>
          </div>
        </template>

        <template #content>
          <!-- form registrasi -->
          <div class="grid">
            <div class="col-12">
              <label>Poliklinik</label>
              <Dropdown
                v-model="form.clinic_id"
                :options="listPoliklinik"
                optionLabel="name"
                optionValue="_id"
                placeholder="Pilih"
                class="w-full mt-2"
                showClear
              />
            </div>
            <div class="col-12">
              <label>Jenis Layanan</label>
              <Dropdown
                v-model="form.service_type_id"
                :options="listJenisLayanan"
                optionLabel="name"
                optionValue="_id"
                placeholder="Pilih"
                class="w-full mt-2"
              />
            </div>
            <div class="col-12">
              <label>Asuransi</label>
              <Dropdown
                v-model="form.insurance_id"
                :options="listAsuransi"
                optionLabel="name"
                optionValue="_id"
                placeholder="Pilih"
                class="w-full mt-2"
              />
            </div>
            <div class="col-12">
              <label>Dokter</label>
              <Dropdown
                v-model="form.doctor_id"
                :options="listDoctor"
                optionLabel="name"
                optionValue="_id"
                placeholder="Pilih"
                class="w-full mt-2"
              />
            </div>

            <div class="col-12">
              <label>Keluhan</label>
              <Textarea
                placeholder="Keluhan"
                v-model="form.complaint"
                class="w-full mt-2"
              />
            </div>

            <Button label="Simpan" icon="pi pi-save" class="mt-3" @click="saveRegistration" />
          </div>
        </template>
      </Card>
    </div>

    <!--Riwayat Registrasi-->
    <div class="col-6">
      <Card>
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span> Kunjungan Terakhir </span>
          </div>
        </template>

        <template #content>
          <!-- riwayat registrasi pasien -->
          <div class="grid">
            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Tanggal Registrasi</div>
              <div class="font-medium">
                {{ lastRegistration.registration_date ? new Date(lastRegistration.registration_date).toLocaleString() : "-" }}
              </div>
            </div>

            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Poliklinik</div>
              <div class="font-medium">{{ lastRegistration.clinic_id?.name || "-" }}</div>
            </div>

            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Dokter</div>
              <div class="font-medium">
                {{ lastRegistration.doctor_id?.name || "-" }}
              </div>
            </div>

            <div class="col-12 mb-3">
              <div class="text-500 text-sm">Keluhan</div>
              <div class="font-medium line-height-3">
                {{ lastRegistration.complaint || "-" }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>