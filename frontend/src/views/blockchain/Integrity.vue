<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Card from "primevue/card";
import Button from "primevue/button";
import {
  checkIntegrity,
} from "../../services/blockchainService";

const toast = useToast();
const loading = ref(false);
const entity = ref("PATIENT");
const entityId = ref("");
const result = ref(null);
const verifyIntegrity = async () => {
  if (!entityId.value) {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: "Entity ID wajib diisi",
      life: 3000,
    });
    return;
  }
  loading.value = true;
  try {
    const res =
      await checkIntegrity(
        entity.value,
        entityId.value
      );

    result.value =
      res.data.response;

  } catch (err) {
    console.log("Axios Error");
    console.log(err);
    result.value =
      err.response?.data?.response ||
      null;

    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        err.response?.data?.metadata
          ?.message ||
        "Gagal melakukan verifikasi",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }

};
</script>

<template>
  <Card>
    <template #title>
      Data Integrity Checker
    </template>

    <template #content>

      <div class="grid">

        <div class="col-12 md:col-4">
          <label>Entity</label>

          <Dropdown
            v-model="entity"
            :options="[
              'PATIENT',
              'INSURANCE',
              'SERVICE_TYPE'
            ]"
            class="w-full"
          />
        </div>

        <div class="col-12 md:col-6">
          <label>Entity ID</label>

          <InputText
            v-model="entityId"
            class="w-full"
            placeholder="Mongo ObjectId"
          />
        </div>

        <div class="col-12 md:col-2 flex align-items-end">

          <Button
            label="Check"
            icon="pi pi-search"
            class="w-full"
            @click="verifyIntegrity"
            :loading="loading"
          />

        </div>

      </div>

      <div
        v-if="result"
        class="mt-4"
      >

        <Message
          v-if="result.valid"
          severity="success"
          :closable="false"
        >
          Data Valid
        </Message>

        <Message
          v-else
          severity="error"
          :closable="false"
        >
          Data Telah Dimodifikasi
        </Message>

        <div class="surface-border border-1 border-round p-3 mt-3">

          <div class="mb-2">
            <b>Entity :</b>
            {{ result.entity }}
          </div>

          <div class="mb-2">
            <b>Entity ID :</b>
            {{ result.entity_id }}
          </div>

          <div class="mb-2">
            <b>Current Hash :</b>
            <br />
            <small>
              {{ result.current_hash }}
            </small>
          </div>

          <div class="mb-2">
            <b>Blockchain Hash :</b>
            <br />
            <small>
              {{ result.blockchain_hash }}
            </small>
          </div>

        </div>

      </div>

    </template>
  </Card>
</template>