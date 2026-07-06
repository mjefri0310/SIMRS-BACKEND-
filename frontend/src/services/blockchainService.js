import axios from "axios";
const api = import.meta.env.VITE_API_URL
const API_URL = `${api}/api`;

export const getExplorer = (params) =>
  axios.get(`${API_URL}/blockchain/explorer`, { params });

export const verifyBlockchain = () => axios.get(`${API_URL}/blockchain/verify`);

export const recoverBlockchain = (blockIndex) =>
  axios.post(`${API_URL}/blockchain/recover/${blockIndex}`);
export const getBlockDetail = (index) => axios.get(`${API_URL}/blockchain/block/${index}`);

export const checkIntegrity = (
  entity,
  entityId
) =>
  axios.get(
    `${API_URL}/blockchain/integrity/${entity}/${entityId}`
  );