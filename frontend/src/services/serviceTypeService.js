import api from "./api";

export const getAll = (params) => api.get("/service-types", { params });

export const getServiceTypes = (params) => api.get("/service-types", { params });

export const getById = (id) => api.get(`/service-types/${id}`);

export const createData = (data) => api.post("/service-types", data);

export const updateData = (id, data) => api.put(`/service-types/${id}`, data);

export const deleteData = (id) => api.delete(`/service-types/${id}`);