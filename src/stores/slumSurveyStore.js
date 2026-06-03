import { defineStore } from 'pinia'
import { ref } from 'vue'
import slumSurveyService from '@/services/slumSurveyService'

export const useSlumSurveyStore = defineStore('slumSurvey', () => {
  const slumSurveys = ref([])
  const pagination = ref({})
  const currentSurvey = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // تحديث الدالة لتمرير كائن الفلاتر إلى طبقة الخدمة بأمان
  async function fetchSlumSurveys(page = 1, filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await slumSurveyService.get(page, filters)
      slumSurveys.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch slum surveys.'
      console.error(err)
      slumSurveys.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchSlumSurvey(id) {
    loading.value = true
    error.value = null
    currentSurvey.value = null
    try {
      const response = await slumSurveyService.find(id)
      currentSurvey.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch slum survey.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createSlumSurvey(payload) {
    loading.value = true
    error.value = null
    try {
      await slumSurveyService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create slum survey.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSlumSurvey(id, payload) {
    loading.value = true
    error.value = null
    try {
      await slumSurveyService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update slum survey.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSlumSurvey(id) {
    loading.value = true
    error.value = null
    try {
      await slumSurveyService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete slum survey.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    slumSurveys,
    pagination,
    currentSurvey,
    loading,
    error,
    fetchSlumSurveys,
    fetchSlumSurvey,
    createSlumSurvey,
    updateSlumSurvey,
    deleteSlumSurvey,
  }
})
