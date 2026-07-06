import api from "./api";

/**
 * List ICD10 (pagination)
 */
export const getData = (params = {}) => {
  return api.get("/icd10", {
    params,
  });
};

/**
 * Semua ICD10
 */
export const getAll = () => {
  return api.get("/icd10/all");
};

/**
 * Detail ICD10
 */
export const getById = (id) => {
  return api.get(`/icd10/${id}`);
};

/**
 * Pencarian ICD10 untuk AutoComplete
 */
export const searchICD10 = (keyword) => {
  return api.get("/icd10/search", {
    params: {
      keyword,
    },
  });
};

/**
 * Tambah ICD10
 */
export const createData = (data) => {
  return api.post("/icd10", data);
};

/**
 * Update ICD10
 */
export const updateData = (id, data) => {
  return api.put(`/icd10/${id}`, data);
};

/**
 * Hapus ICD10
 */
export const deleteData = (id) => {
  return api.delete(`/icd10/${id}`);
};

/**
 * Riwayat Versi
 */
export const getVersions = (id) => {
  return api.get(`/icd10/${id}/versions`);
};