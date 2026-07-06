import axios from 'axios'


const API_URL = import.meta.env.VITE_API_URL + '/api/auth'
export const registerUser = async (data) => {
  return axios.post(`${API_URL}/register`, data)
}

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/login`, data)
}

export const getProfile = async (token) => {
  return axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}