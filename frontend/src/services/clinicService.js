import api from "./api";

export const getAll = (params) => api.get("/clinics", { params });

export const getById = (id) => api.get(`/clinics/${id}`);

export const createData = (data) => api.post("/clinics", data);

export const updateData = (id, data) => api.put(`/clinics/${id}`, data);

export const deleteData = (id) => api.delete(`/clinics/${id}`);