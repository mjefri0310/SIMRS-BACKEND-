<template>
  <div>
    <!--
    <AppToolbar
      title="Dashboard"
      subtitle="Overview aplikasi"
    >
      <Button
        label="Refresh"
        icon="pi pi-refresh"
      />
    </AppToolbar>
    -->

    <div class="grid">
      <div class="col-12 md:col-4">
        <Card>
          <template #content>
            <div
              class="
                flex
                justify-content-between
                align-items-center
              "
            >
              <div>
                <small>
                  Total Pasien
                </small>

                <h2>1200</h2>
              </div>

              <i
                class="
                  pi pi-users
                  text-4xl
                  text-primary
                "
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import Button from "primevue/button";
// import AppToolbar from "../components/layout/AppToolbar.vue";
</script>