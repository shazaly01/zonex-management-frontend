//src\services\dashboardService.js
import apiClient from './apiClient'

const resource = '/dashboard'

export default {
  getStats() {
    return apiClient.get(resource)
  },
}
