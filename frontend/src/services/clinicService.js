import api from "./api";
export const getData = (params) => api.get("/clinics", { params });
export const createData = (data) => api.post("/clinics", data);
export const updateData = (id, data) => api.put(`/clinics/${id}`, data);
export const deleteData = (id) => api.delete(`/clinics/${id}`);
export const getAll = (params) => api.get("/clinics/all", { params });
export const getById = (id) => api.get(`/clinics/${id}`);