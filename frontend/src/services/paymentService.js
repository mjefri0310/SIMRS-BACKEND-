import api from "./api";
export const getData = (params) => api.get("/payments", { params });
export const getById = (id) => api.get(`/payments/${id}`);
export const getByRegistration = (registrationId) =>
api.get(`/payments/registration/${registrationId}`);
export const generateBill = (registrationId) =>
api.post(`/payments/generate/${registrationId}`);
export const payBill = (id, payload) =>
api.post(`/payments/pay/${id}`, payload);