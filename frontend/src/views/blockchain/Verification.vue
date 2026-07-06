<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import {
  verifyBlockchain,
  recoverBlockchain,
} from "../../services/blockchainService";

const toast = useToast();
const confirm = useConfirm();

const result = ref(null);

const loading = ref(false);

const verify = async () => {
  loading.value = true;

  try {
    const res = await verifyBlockchain();

    result.value = res.data.response;
  } catch (err) {
    console.log("Axios Error");
    console.log(err);

    console.log("Response");
    console.log(err.response);

    console.log("Data");
    console.log(err.response?.data);

    result.value = err.response?.data?.response || {
      valid: false,
      reason: "Unknown error",
    };
    console.log("Result:");
    console.log(result.value);
  } finally {
    loading.value = false;
  }
};

const recover = () => {
  confirm.require({
    message: "Data akan direstore dari blockchain. Lanjutkan?",
    header: "Konfirmasi Recovery",
    icon: "pi pi-exclamation-triangle",
    accept: async () => {
      try {
        await recoverBlockchain(
          result.value.broken_block
        );

        toast.add({
          severity: "success",
          summary: "Berhasil",
          detail: "Recovery selesai",
          life: 3000,
        });

        verify();
      } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail:
            err.response?.data?.metadata?.message ||
            'Recovery gagal'
        })
      }
    },
  });
};
onMounted(() => {
  verify();
});
</script>

<template>
  <Card>
    <template #title> Blockchain Verification </template>

    <template #content>
      <Message v-if="result?.valid" severity="success" :closable="false">
        Blockchain VALID
      </Message>

      <Message v-else severity="error" :closable="false">
        Blockchain INVALID
      </Message>

      <div v-if="result && !result.valid" class="mt-4">
        <div>
          <b>Broken Block:</b>
          {{ result.broken_block }}
        </div>

        <div>
          <b>Entity:</b>
          {{ result.entity }}
        </div>

        <div>
          <b>Entity ID:</b>
          {{ result.entity_id }}
        </div>

        <div>
          <b>Action:</b>
          {{ result.action }}
        </div>

        <div>
          <b>Reason:</b>
          {{ result.reason }}
        </div>

        <Button
          label="Recover Data"
          icon="pi pi-refresh"
          severity="danger"
          class="mt-4"
          @click="recover"
        />
      </div>
    </template>
  </Card>

  <ConfirmDialog />
</template>