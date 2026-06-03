<template>
  <div class="space-y-4">
    <AppTable
      :headers="tableHeaders"
      :items="slumSurveys"
      :is-loading="loading"
      :row-clickable="false"
    >
      <template #cell-full_name="{ item }">
        <span class="font-bold text-text-primary">
          {{ item.full_name }}
        </span>
      </template>

      <template #cell-contact_info="{ item }">
        <div class="flex flex-col">
          <span class="font-mono text-sm font-bold text-text-primary" title="الرقم الوطني">
            {{ item.national_id }}
          </span>
          <span
            class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1"
            title="رقم الهاتف"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            <span dir="ltr">{{ item.phone_number || 'لا يوجد' }}</span>
          </span>
        </div>
      </template>

      <template #cell-family_info="{ item }">
        <div class="flex flex-col text-xs text-gray-600 dark:text-gray-400">
          <span v-if="item.family_book_number">كتيب: {{ item.family_book_number }}</span>
          <span v-if="item.family_paper_number">ورقة: {{ item.family_paper_number }}</span>
          <span v-if="!item.family_book_number && !item.family_paper_number" class="text-gray-400"
            >غير مدخل</span
          >
        </div>
      </template>

      <template #cell-address_info="{ item }">
        <div class="flex items-center text-sm text-gray-700 dark:text-text-secondary">
          <svg
            class="w-4 h-4 ml-1.5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span class="truncate max-w-[200px] lg:max-w-[250px]" :title="item.current_address">
            {{ item.current_address }}
          </span>
        </div>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center justify-end gap-3">
          <button
            v-if="authStore.can('survey.update')"
            @click.stop="$emit('edit-survey', item)"
            class="text-primary hover:text-primary-dark p-1 rounded transition-colors"
            title="تعديل بيانات سجل الحصر"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </button>

          <button
            v-if="authStore.can('survey.delete')"
            @click.stop="$emit('delete-survey', item)"
            class="text-danger hover:text-red-700 p-1 rounded transition-colors"
            title="حذف سجل الحصر"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </template>
    </AppTable>

    <AppPagination
      v-if="pagination && pagination.total > 0"
      :current-page="pagination.current_page"
      :total-pages="pagination.last_page"
      :total-items="pagination.total"
      :per-page="pagination.per_page"
      @page-change="(page) => $emit('page-change', page)"
    />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import AppTable from '@/components/ui/AppTable.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

const props = defineProps({
  slumSurveys: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => ({}),
  },
})

// تعريف الأحداث المرتدة للشاشة الأم الرئيسية
defineEmits(['edit-survey', 'delete-survey', 'page-change'])

const authStore = useAuthStore()

// مصفوفة ترويسة الجدول المهيكلة لتغطية حقول استمارة حصر العشوائيات
const tableHeaders = [
  { key: 'full_name', label: 'الاسم رباعي' },
  { key: 'contact_info', label: 'الهوية والتواصل' },
  { key: 'family_info', label: 'كتيب / ورقة العائلة' },
  { key: 'family_members_count', label: 'أفراد الأسرة', cellClass: 'text-center' },
  { key: 'address_info', label: 'عنوان السكن الحالي' },
  { key: 'actions', label: '', cellClass: 'w-24' },
]
</script>
