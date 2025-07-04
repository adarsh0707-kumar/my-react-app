import axios from 'axios'

const API_URL = `https://server-expence.onrender.com/api-v1`

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export function setAuthToken (token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  else {
    delete api.defaults.headers.common['Authorization']
  }
}

export default api
