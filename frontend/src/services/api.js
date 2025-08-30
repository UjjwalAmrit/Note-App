import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API endpoints
export const authAPI = {
  sendOTP: (email) => api.post("/auth/send-otp", { email }),
  verifyOTP: (email, otp, firstName, lastName, dob) =>
    api.post("/auth/verify-otp", { email, otp, firstName, lastName, dob }),
  login: (email, otp) => api.post("/auth/login", { email, otp }),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  testEmail: () => api.get("/auth/test-email"),
}

export const notesAPI = {
  getNotes: () => api.get("/notes"),
  createNote: (title, content) => api.post("/notes", { title, content }),
  updateNote: (id, title, content) => api.put(`/notes/${id}`, { title, content }),
  deleteNote: (id) => api.delete(`/notes/${id}`),
}

export default api
