import api from "./api";

export const getAll = (params) => api.get("/tariffs", { params });

export const getById = (id) => api.get(`/tariffs/${id}`);

export const createData = (data) => api.post("/tariffs", data);

export const updateData = (id, data) => api.put(`/tariffs/${id}`, data);

export const deleteData = (id) => api.delete(`/tariffs/${id}`);