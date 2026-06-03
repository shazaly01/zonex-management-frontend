<template>
  <AppCard class="mb-6">
    <div class="p-4">
      <!-- [تخطيط الهواتف والتابلت]: شريط علوي مريح مدمج به زر الطباعة وزر خيارات التصفية -->
      <div
        class="flex flex-col sm:flex-row gap-3 items-center lg:hidden mb-0"
        :class="{ 'mb-4': isMobileFiltersOpen }"
      >
        <div class="relative w-full flex-1">
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
            placeholder="ابحث بالاسم رباعي أو الرقم الوطني..."
            class="block w-full pl-10 pr-4 py-2.5 border border-surface-border rounded-lg bg-surface-ground text-text-primary focus:ring-2 focus:ring-primary outline-none transition-all sm:text-sm"
          />
        </div>

        <div class="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            @click="isMobileFiltersOpen = !isMobileFiltersOpen"
            class="flex-1 sm:flex-none px-4 py-2.5 flex items-center justify-center gap-2 border border-surface-border rounded-lg bg-surface-ground text-text-primary hover:bg-surface-border transition-colors text-sm font-semibold"
          >
            <svg
              class="w-5 h-5 text-text-muted transition-transform duration-200"
              :class="{ 'rotate-180': isMobileFiltersOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>الفلاتر</span>
          </button>

          <button
            type="button"
            :disabled="disablePrint"
            @click="$emit('print')"
            class="flex-1 sm:flex-none px-4 py-2.5 flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>طباعة</span>
          </button>
        </div>
      </div>

      <!-- [تخطيط الشاشات الكبيرة]: شبكة مصفوفة من 5 أعمدة تدمج الفلاتر وزر الطباعة بتناسق كامل -->
      <div
        :class="[
          'lg:grid lg:grid-cols-5 lg:gap-4 lg:items-end',
          isMobileFiltersOpen
            ? 'grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-surface-border pt-4 lg:border-t-0 lg:pt-0'
            : 'hidden lg:grid',
        ]"
      >
        <!-- 1. فلتر الحالة الاجتماعية -->
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

        <!-- 2. فلتر المصرف التجاري -->
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

        <!-- 3. فلتر حجم الأسرة ونطاق عدد الأفراد (Smart Ranges) -->
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

        <!-- 4. فلتر البحث النصي لسطح المكتب -->
        <div class="w-full hidden lg:block">
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

        <!-- 5. زر طباعة التقرير التفاعلي المدمج في شبكة سطح المكتب -->
        <div class="w-full hidden lg:block">
          <AppButton
            type="button"
            variant="secondary"
            :disabled="disablePrint"
            @click="$emit('print')"
            class="w-full flex items-center justify-center gap-2 py-2 border-2"
          >
            <svg
              class="w-5 h-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>طباعة التقرير</span>
          </AppButton>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { ref } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  maritalStatusFilter: { type: String, default: '' },
  bankFilter: { type: String, default: '' },
  familySizeFilter: { type: String, default: '' },
  searchQuery: { type: String, default: '' },
  disablePrint: { type: Boolean, default: false },
})

defineEmits([
  'update:maritalStatusFilter',
  'update:bankFilter',
  'update:familySizeFilter',
  'update:searchQuery',
  'print',
])

const isMobileFiltersOpen = ref(false)

const maritalStatusOptions = [
  { id: '', name: 'الكل' },
  { id: 'أعزب', name: 'أعزب' },
  { id: 'متزوج', name: 'متزوج' },
  { id: 'مطلق', name: 'مطلق' },
  { id: 'أرمل', name: 'أرمل' },
]

const familySizeOptions = [
  { id: '', name: 'الكل' },
  { id: 'small', name: 'أسرة صغيرة (1 - 3 أفراد)' },
  { id: 'medium', name: 'أسرة متوسطة (4 - 6 أفراد)' },
  { id: 'large', name: 'أسرة كبيرة (7 أفراد فما فوق)' },
  { id: 'none', name: 'لم تسجل عائلته بعد (0)' },
]
</script>
