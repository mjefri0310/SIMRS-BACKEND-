<script setup>
import { ref } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { recoverBlockchain } from "../../services/blockchainService";

import { useToast } from "primevue/usetoast";

const toast = useToast();

const form = ref({
  entity: "PATIENT",

  entity_id: "",
});

const loading = ref(false);

const submit = async () => {
  loading.value = true;

  try {
    await recoverBlockchain(form.value.entity_id);

    toast.add({
      severity: "success",

      summary: "Success",

      detail: "Recovery berhasil",

      life: 3000,
    });
  } catch (err) {
    toast.add({
      severity: "error",

      summary: "Error",

      detail: err.response.data.metadata.message,

      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Card>
    <template #title> Blockchain Recovery </template>
        <template #content>
        <!-- <Message severity="info" :closable="false">
            Masukkan Entity ID untuk melakukan recovery
        </Message>
    
        <div class="mb-4">
            <b>Entity:</b> {{ form.entity }}
        </div>
    
        <div class="mb-4">
            <b>Entity ID:</b>
            {{ form.entity_id || "N/A" }}
        </div> -->
        <div class="grid">
        <div class="col-12">
            <InputText
            v-model="form.entity_id"
            class="w-full"
            placeholder="Entity ID"
            />
        </div>

        <div class="col-12">
            <Button
            label="Recover"
            icon="pi pi-refresh"
            severity="warning"
            class="w-full"
            :loading="loading"
            @click="submit"
            />
        </div>
        </div>
    </template>
  </Card>
</template>