import api from "./api";
export const getRME = (registration_id) =>
api.get(`/rme/${registration_id}`);
export const saveRME = (data) => api.post(`/rme`, data);