import api from "./api";

export const getData = (params) => api.get("/doctors", { params });
export const getById = (id) => api.get(`/doctors/${id}`);
export const createData = (data) => api.post("/doctors", data);
export const updateData = (id, data) => api.put(`/doctors/${id}`, data);
export const deleteData = (id) => api.delete(`/doctors/${id}`);     