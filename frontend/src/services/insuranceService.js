import api from "./api";

export const getData = (params) => api.get("/insurances", { params });

export const getById = (id) => api.get(`/insurances/${id}`);

export const createData = (data) => api.post("/insurances", data);

export const updateData = (id, data) => api.put(`/insurances/${id}`, data);

export const deleteData = (id) => api.delete(`/insurances/${id}`);