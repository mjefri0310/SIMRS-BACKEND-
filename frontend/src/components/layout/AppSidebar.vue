<template>
  <Toast />
  <ConfirmDialog />
  <div class="h-full flex flex-column justify-content-between p-3">
    <!-- MENU -->

    <div>
      <PanelMenu :model="items" />
    </div>

    <!-- FOOT -->

    <Button
      label="Logout"
      icon="pi pi-sign-out"
      severity="danger"
      outlined
      class="w-full"
      @click="logout"
    />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

import Button from "primevue/button";
import PanelMenu from "primevue/panelmenu";

const router = useRouter();

const items = [
  {
    label: "Dashboard",
    icon: "pi pi-home",
    command: () => {
      router.push("/dashboard");
    },
  },

  {
    label: "Master Data",
    icon: "pi pi-database",

    items: [
      
      {
        label: "Jenis Layanan",
        icon: "pi pi-list",
        command: () => {
          router.push("/service-types");
        },
      },
      {
        label: "Asuransi",
        icon: "pi pi-briefcase",
        command: () => {
          router.push("/insurance");
        },
      },
      {
        label: "Klinik",
        icon: "pi pi-building",
        command: () => {
          router.push("/clinics");
        },
      },
      {
        label: "Dokter",
        icon: "pi pi-users",
        command: () => {
          router.push("/doctors");
        },
      },
      {
        label: "Obat",
        icon: "pi pi-plus",
        command: () => {
          router.push("/medicines");
        },
      },
      {
        label: "Tarif",
        icon: "pi pi-money-bill",
        command: () => {
          router.push("/tariffs");
        },
      },
      {
        label: "Ruangan",
        icon: "pi pi-building",
        command: () => {
          router.push("/rooms");
        },
      }
    ],
  },
  {
    label: "Registrasi & Pelayanan",
    icon: "pi pi-receipt",

    items: [
      {
        label: "Pasien",
        icon: "pi pi-users",
        command: () => {
          router.push("/patients");
        },
      },
      {
        label: "Pelayanan",
        icon: "pi pi-list-check",
        command: () => {
          router.push("/service");
        },
      },
      {
        label: "Pembayaran",
        icon: "pi pi-credit-card",
        command: () => {
          router.push("/payment");
        },
      },
    ],
  },
  {
    label: "Blockchain",

    icon: "pi pi-link",

    items: [
      {
        label: "Explorer",

        icon: "pi pi-database",

        command: () => {
          router.push("/blockchain/explorer");
        },
      },

      {
        label: "Verify",

        icon: "pi pi-shield",

        command: () => {
          router.push("/blockchain/verify");
        },
      },

      {
        label: "Recovery",
        icon: "pi pi-refresh",
        command: () => {
          router.push("/blockchain/recovery");
        },
      },

      {
        label: "Integrity Checker",
        icon: "pi pi-shield",
        command: () => {
          router.push("/blockchain/integrity");
        },
      },
    ],
  },
];

const logout = () => {
  localStorage.removeItem("token");

  router.push("/");
};
</script>