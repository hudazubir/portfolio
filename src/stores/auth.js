import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },

  actions: {
    async fetchUser() {
      try {
        const response = await api.get('/api/user')
        this.user = response.data
      } catch (error) {
        this.user = null

        if (error.response?.status !== 401) {
          throw error
        }
      } finally {
        this.initialized = true
      }
    },

    async login(credentials) {
      this.isLoading = true

      try {
        await api.get('/sanctum/csrf-cookie')
        const response = await api.post('/login', credentials)
        this.user = response.data.user
        this.initialized = true
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true

      try {
        await api.post('/logout')
      } finally {
        this.user = null
        this.initialized = true
        this.isLoading = false
      }
    },
  },
})
