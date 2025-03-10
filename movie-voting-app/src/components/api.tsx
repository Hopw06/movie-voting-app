import axios from 'axios'
import { useAuth } from './AuthProvider'

export const useApi = () => {
  const { accessToken } = useAuth()
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  })

  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  })

  return api
}
