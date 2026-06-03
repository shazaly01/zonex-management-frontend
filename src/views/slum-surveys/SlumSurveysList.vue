<template>
  <div>
    <!-- عنوان الصفحة الرئيسي الصافي -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary">إدارة حصر العشوائيات</h1>
    </div>

    <!-- نموذج إضافة مستهدف جديد - يظهر فقط لمن يملك الصلاحية -->
    <div
      v-if="authStore.can('survey.create')"
      class="mb-8 bg-surface-section p-6 rounded-xl border border-surface-border"
    >
      <h2 class="text-xl font-bold mb-5 text-text-primary">إضافة سجل حصر جديد</h2>
      <SlumSurveyForm
        :key="formKey"
        :is-saving="isCreating"
        @submit="handleCreate"
        @cancel="cancelCreate"
      />
    </div>

    <!-- مكون الفلاتر المتقدمة مدمج به زر الإطلاق والتعطيل تفاعلياً للمصفوفة المفلترة -->
    <SlumSurveyFilters
      v-model:maritalStatusFilter="maritalStatusFilter"
      v-model:bankFilter="bankFilter"
      v-model:familySizeFilter="familySizeFilter"
      v-model:searchQuery="searchQuery"
      :disable-print="loading || slumSurveys.length === 0"
      @print="handlePrintReport"
    />

    <!-- جدول عرض سجلات الحصر الممررة من المخزن -->
    <SlumSurveysTable
      :slum-surveys="slumSurveys"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @edit-survey="openEditModal"
      @delete-survey="openDeleteDialog"
    />

    <!-- نافذة تعديل بيانات السجل الحالي -->
    <SlumSurveyModal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :survey="selectedSurvey"
      :is-saving="isEditing"
      @save="handleEdit"
    />

    <!-- نافذة تأكيد الحذف الطري (Soft Delete) -->
    <AppConfirmDialog
      v-model="isDeleteDialogOpen"
      title="تأكيد حذف سجل الحصر"
      :message="`هل أنت متأكد من رغبتك في حذف سجل الحصر الخاص بالمواطن '${surveyToDelete?.full_name}'؟`"
      @confirmed="deleteSelectedSurvey"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

// استيراد الـ Stores المعتمدة بالنظام
import { useAuthStore } from '@/stores/authStore'
import { useSlumSurveyStore } from '@/stores/slumSurveyStore'

// استيراد المكونات المشتركة لـ UI
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'

// استيراد المكونات التابعة لنظام الحصر
import SlumSurveyFilters from './SlumSurveyFilters.vue'
import SlumSurveysTable from './SlumSurveysTable.vue'
import SlumSurveyModal from './SlumSurveyModal.vue'
import SlumSurveyForm from './SlumSurveyForm.vue'

// تهيئة الـ Stores والـ Toast
const authStore = useAuthStore()
const slumSurveyStore = useSlumSurveyStore()

const { slumSurveys, loading, pagination } = storeToRefs(slumSurveyStore)
const toast = useToast()

// === إدارة الحالات التفاعلية للفلاتر المتقدمة ===
const maritalStatusFilter = ref('')
const bankFilter = ref('')
const familySizeFilter = ref('')
const searchQuery = ref('')
let searchTimeout = null

// دالة جلب البيانات المركزية وتمرير الفلاتر كاملة كمصفوفة بارامترات للمخزن
const handlePageChange = async (page = 1) => {
  await slumSurveyStore.fetchSlumSurveys(page, {
    search: searchQuery.value,
    marital_status: maritalStatusFilter.value,
    bank: bankFilter.value,
    family_size: familySizeFilter.value,
  })
}

// مراقبة حقل البحث النصي لتطبيق الـ Debounce (تأخير الإرسال 500 ملم ثانية)
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handlePageChange(1)
  }, 500)
})

// مراقبة الفلاتر المنسدلة لتحديث الجدول فوراً عند تغيير الاختيار
watch([maritalStatusFilter, bankFilter, familySizeFilter], () => {
  handlePageChange(1)
})

onMounted(() => {
  handlePageChange()
})

// === دالة تجهيز وإطلاق نافذة التقرير المستقلة ===
const handlePrintReport = () => {
  if (slumSurveys.value.length === 0) return

  const printPayload = {
    reportData: slumSurveys.value,
    filters: {
      marital_status: maritalStatusFilter.value,
      bank: bankFilter.value,
      family_size: familySizeFilter.value,
    },
    search: searchQuery.value,
  }

  sessionStorage.setItem('slumSurveysPrintData', JSON.stringify(printPayload))
  window.open('/print/slum-surveys', '_blank')
}

// === إدارة نموذج الإضافة المدمج (صلاحية الإنشاء) ===
const isCreating = ref(false)
const formKey = ref(0)

const handleCreate = async (formData) => {
  isCreating.value = true
  try {
    await slumSurveyStore.createSlumSurvey(formData)
    toast.success(`تم تسجيل بيانات حصر المواطن '${formData.full_name}' بنجاح.`)
    formKey.value++
    await handlePageChange(1)
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة سجل الحصر.'
    toast.error(errorMessage)
  } finally {
    isCreating.value = false
  }
}

const cancelCreate = () => {
  formKey.value++
}

// === إدارة تعديل السجلات (صلاحية التحديث) ===
const isModalOpen = ref(false)
const selectedSurvey = ref(null)
const isEditing = ref(false)

const openEditModal = (survey) => {
  if (!authStore.can('survey.update')) {
    toast.error('ليس لديك الصلاحية لتعديل سجلات الحصر.')
    return
  }
  selectedSurvey.value = { ...survey }
  isModalOpen.value = true
}

const handleEdit = async (formData) => {
  isEditing.value = true
  try {
    await slumSurveyStore.updateSlumSurvey(formData.id, formData)
    toast.success(`تم تحديث سجل حصر المواطن '${formData.full_name}' بنجاح.`)
    await handlePageChange(pagination.value.current_page || 1)
    isModalOpen.value = false
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء حفظ التعديلات.'
    toast.error(errorMessage)
  } finally {
    isEditing.value = false
  }
}

// === إدارة حذف السجلات (صلاحية الحذف) ===
const isDeleteDialogOpen = ref(false)
const surveyToDelete = ref(null)

const openDeleteDialog = (survey) => {
  if (!authStore.can('survey.delete')) {
    toast.error('ليس لديك الصلاحية لحذف سجلات الحصر.')
    return
  }
  surveyToDelete.value = survey
  isDeleteDialogOpen.value = true
}

const deleteSelectedSurvey = async () => {
  if (surveyToDelete.value) {
    try {
      await slumSurveyStore.deleteSlumSurvey(surveyToDelete.value.id)
      toast.success(`تم حذف سجل حصر المواطن '${surveyToDelete.value.full_name}' بنجاح.`)

      if (slumSurveys.value.length === 1 && pagination.value.current_page > 1) {
        await handlePageChange(pagination.value.current_page - 1)
      } else {
        await handlePageChange(pagination.value.current_page)
      }
    } catch (error) {
      const errorMessage =
        slumSurveyStore.error || error.response?.data?.message || 'فشل حذف سجل الحصر.'
      toast.error(errorMessage)
    } finally {
      isDeleteDialogOpen.value = false
      surveyToDelete.value = null
    }
  }
}
</script>
