import api from "./api";
export const getData = (params) => api.get("/rooms", { params });
export const getAll = (params) => api.get("/rooms/all", { params });
export const createData = (data) => api.post("/rooms", data);
export const updateData = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteData = (id) => api.delete(`/rooms/${id}`);