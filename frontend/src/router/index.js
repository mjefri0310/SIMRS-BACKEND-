import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MainLayout from "../components/layout/MainLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import RegistrationDetail from "../views/RegistrationDetail.vue";
import Service from "../views/transaction/Service.vue";
import ServiceDetail from "../views/transaction/ServiceDetail.vue";
import Payment from "../views/payment/Payment.vue";

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
        path: "/dashboard",
        component: Dashboard,
      },

      {
        path: "/form",
        name: "registration-detail",
        component: RegistrationDetail,
      },
      {
        path: "/service",
        name: "service-list",
        component: Service,
      },
      {
        path: "/service/detail",
        name: "service-detail",
        component: ServiceDetail,
      },
      {
        path: "/payment",
        name: "payment",
        component: Payment,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;