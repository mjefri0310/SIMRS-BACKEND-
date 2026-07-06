import api from "./api";

export const getData = (params) => api.get("/medicines", { params });
export const getById = (id) => api.get(`/medicines/${id}`);
export const createData = (data) => api.post("/medicines", data);
export const updateData = (id, data) => api.put(`/medicines/${id}`, data);
export const deleteData = (id) => api.delete(`/medicines/${id}`);