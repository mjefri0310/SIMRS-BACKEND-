<script setup>
import { ref, onMounted, computed } from "vue";

import { useRoute } from "vue-router";

import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";

import {
  getById,
  payBill,
} from "../../services/paymentService";

const route = useRoute();

const payment = ref(null);

const form = ref({
  payment_method: "CASH",
  paid_amount: 0,
});

const methods = [
  "CASH",
  "TRANSFER",
  "QRIS",
  "INSURANCE",
];

const changeAmount =
  computed(() => {
    if (!payment.value) return 0;

    return (
      form.value.paid_amount -
      payment.value.total_amount
    );
  });

const loadData = async () => {
  const res = await getById(
    route.query.id
  );

  payment.value =
    res.data.response;
};

const savePayment =
  async () => {
    await payBill(
      payment.value._id,
      form.value
    );

    await loadData();
  };

onMounted(loadData);
</script>

<template>

  <div v-if="payment">

    <Card>

      <template #title>
        Pembayaran
      </template>

      <template #content>

        <DataTable
          :value="payment.items"
        >

          <Column
            field="item_type"
            header="Jenis"
          />

          <Column
            field="name"
            header="Nama"
          />

          <Column
            field="quantity"
            header="Qty"
          />

          <Column
            field="unit_price"
            header="Harga"
          />

          <Column
            field="subtotal"
            header="Subtotal"
          />

        </DataTable>

        <div class="mt-4">

          <h3>
            Total :
            Rp
            {{
              payment.total_amount
                .toLocaleString()
            }}
          </h3>

        </div>

        <div
          class="grid mt-3"
        >

          <div class="col-12">

            <label>
              Metode Bayar
            </label>

            <Dropdown
              v-model="
                form.payment_method
              "
              :options="methods"
              class="w-full"
            />

          </div>

          <div class="col-12">

            <label>
              Jumlah Bayar
            </label>

            <InputNumber
              v-model="
                form.paid_amount
              "
              class="w-full"
            />

          </div>

          <div class="col-12">

            <h4>
              Kembalian :
              Rp
              {{
                changeAmount.toLocaleString()
              }}
            </h4>

          </div>

          <div class="col-12">

            <Button
              label="Simpan Pembayaran"
              icon="pi pi-check"
              @click="
                savePayment
              "
            />

          </div>

        </div>

      </template>

    </Card>

  </div>

</template>