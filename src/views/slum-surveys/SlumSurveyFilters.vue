<template>
  <AppCard class="mb-6">
    <div class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div class="w-full">
          <h3 class="font-semibold text-sm mb-2 text-text-secondary">الحالة الاجتماعية</h3>
          <AppDropdown
            id="survey-marital-status-filter"
            label=""
            :model-value="maritalStatusFilter"
            @update:modelValue="$emit('update:maritalStatusFilter', $event)"
            :options="maritalStatusOptions"
            placeholder="الكل"
          />
        </div>

        <div class="w-full">
          <h3 class="font-semibold text-sm mb-2 text-text-secondary">المصرف</h3>
          <div class="relative">
            <select
              :value="bankFilter"
              @change="$emit('update:bankFilter', $event.target.value)"
              class="block w-full px-3 py-2 border border-surface-border rounded-lg bg-surface-ground text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all sm:text-sm appearance-none cursor-pointer"
            >
              <option value="">الكل</option>
              <option value="مصرف الجمهورية">مصرف الجمهورية</option>
              <option value="المصرف التجاري الوطني">المصرف التجاري الوطني</option>
              <option value="مصرف الأمان">مصرف الأمان</option>
              <option value="مصرف التجارة والتنمية">مصرف التجارة والتنمية</option>
              <option value="مصرف الوحدة">مصرف الوحدة</option>
            </select>
            <div class="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
              <svg
                class="w-4 h-4 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="w-full">
          <h3 class="font-semibold text-sm mb-2 text-text-secondary">حجم الأسرة</h3>
          <AppDropdown
            id="survey-family-size-filter"
            label=""
            :model-value="familySizeFilter"
            @update:modelValue="$emit('update:familySizeFilter', $event)"
            :options="familySizeOptions"
            placeholder="الكل"
          />
        </div>

        <div class="w-full">
          <h3 class="font-semibold text-sm mb-2 text-text-secondary">بحث سريع</h3>
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              :value="searchQuery"
              @input="$emit('update:searchQuery', $event.target.value)"
              type="text"
              placeholder="الاسم رباعي أو الرقم الوطني..."
              class="block w-full pl-10 pr-4 py-2 border border-surface-border rounded-lg bg-surface-ground text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/ui/AppCard.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  // فلتر الحالة الاجتماعية
  maritalStatusFilter: { type: String, default: '' },

  // فلتر المصرف
  bankFilter: { type: String, default: '' },

  // فلتر النطاقات الذكية لعدد أفراد الأسرة
  familySizeFilter: { type: String, default: '' },

  // فلتر البحث النصي الموحد
  searchQuery: { type: String, default: '' },
})

defineEmits([
  'update:maritalStatusFilter',
  'update:bankFilter',
  'update:familySizeFilter',
  'update:searchQuery',
])

// خيارات الحالة الاجتماعية للفرز المتوافق مع قاعدة البيانات
const maritalStatusOptions = [
  { id: '', name: 'الكل' },
  { id: 'أعزب', name: 'أعزب' },
  { id: 'متزوج', name: 'متزوج' },
  { id: 'مطلق', name: 'مطلق' },
  { id: 'أرمل', name: 'أرمل' },
]

// خيارات النطاقات الذكية لفرز الكثافة العددية للعائلات (Smart Ranges)
const familySizeOptions = [
  { id: '', name: 'الكل' },
  { id: 'small', name: 'أسرة صغيرة (1 - 3 أفراد)' },
  { id: 'medium', name: 'أسرة متوسطة (4 - 6 أفراد)' },
  { id: 'large', name: 'أسرة كبيرة (7 أفراد فما فوق)' },
  { id: 'none', name: 'لم تسجل عائلته بعد (0)' },
]
</script>
