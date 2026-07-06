import api from "./api";

export const getData = (params) => api.get("/patients", { params });
export const getById = (id) => api.get(`/patients/${id}`);
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const getLastRegistration = (id) => api.get(`/registrations/last/${id}`);
export const createData = (data) => api.post("/patients", data);
export const updateData = (id, data) => api.put(`/patients/${id}`, data);
export const deleteData = (id) => api.delete(`/patients/${id}`);