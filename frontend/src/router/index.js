import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import ServiceType from "../views/master/ServiceType.vue";
import Insurance from "../views/master/Insurance.vue";
import Clinic from "../views/master/Clinic.vue";
import Doctors from "../views/master/Doctors.vue";
import Medicine from "../views/master/Medicines.vue";
import Room from "../views/master/Room.vue";
import Tariff from "../views/master/Tariff.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Explorer from "../views/blockchain/Explorer.vue";
import Patient from "../views/registration/Patient.vue";
import Registration from "../views/registration/Registration.vue";
import Service from "../views/transaction/Service.vue";
import RegistrationDetail from "../views/registration/RegistrationDetail.vue";
import ServiceDetail from "../views/transaction/ServiceDetail.vue";

import Verification from "../views/blockchain/Verification.vue";

import Recovery from "../views/blockchain/Recovery.vue";
const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "dashboard",
        component: Dashboard,
      },
      {
        path: "patients",
        component: Patient,
      },
      {
        path: "service-types",
        component: ServiceType,
      },
      {
        path: "insurance",
        component: Insurance,
      },
      {
        path: "clinics",
        component: Clinic,
      },
      {
        path: "doctors",
        component: Doctors,
      },
      {
        path: "medicines",
        component: Medicine,
      },
      {
        path: "rooms",
        component: Room,
      },
      {
        path: "tariffs",
        component: Tariff,
      },
      {
        path: "form",
        name: "registration-form",
        component: Registration,
      },
      {
        path: "form",
        name: "registration-detail",
        component: RegistrationDetail,
      },
      {
        path: "service",
        name: "service-list",
        component: Service
      },
      {
        path: "service/detail",
        name: "service-detail",
        component: ServiceDetail
      },
      {
        path: "/payment",
        name: "payment",
        component: () =>
          import(
            "../views/payment/Payment.vue"
          ),
      },
      {
        path: "/payment/detail",
        name: "payment-detail",
        component: () =>
          import(
            "../views/payment/PaymentDetail.vue"
          ),
      },
      {
        path:"/report/visit",
        name:"report-visit",
        component:()=>import("../views/report/VisitReport.vue")
      },
      // {
      //   path: "/service/:id",
      //   name: "service-detail",
      //   component: () => import("../views/transaction/ServiceDetail.vue")
      // },
      // {
      //   path: "/rme/:id",
      //   name: "rme-form",
      //   component: () => import("../views/transaction/RmeForm.vue")
      // },
      {
        path: "/blockchain/explorer",

        component: Explorer,
      },

      {
        path: "/blockchain/verify",

        component: Verification,
      },

      {
        path: "/blockchain/recovery",

        component: Recovery,
      },
      {
        path: '/blockchain/integrity',
        component: () =>
          import(
            '../views/blockchain/Integrity.vue'
          )
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;