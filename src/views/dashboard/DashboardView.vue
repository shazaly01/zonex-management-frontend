<template>
  <div class="space-y-8 animate-fade-in" dir="rtl">
    <!-- الترويسة العلوية للوحة التحكم -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-border/40 pb-5"
    >
      <div>
        <h1 class="text-3xl font-black text-text-primary tracking-tight">لوحة المؤشرات الحية</h1>
        <p class="text-sm text-text-muted mt-1 font-medium">
          متابعة لحظية لسير أعمال حصر العشوائيات والتحليلات الميدانية
        </p>
      </div>
      <div
        class="flex items-center gap-2 text-xs font-bold text-text-secondary bg-surface-section/40 border border-surface-border/40 py-2 px-4 rounded-xl backdrop-blur-sm shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>تحديث تلقائي مستمر</span>
      </div>
    </div>

    <!-- حالة التحميل (Loading State) -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="i in 4"
        :key="i"
        class="h-32 bg-surface-section/40 rounded-2xl animate-pulse border border-surface-border/30"
      ></div>
    </div>

    <!-- حالة الخطأ (Error State) -->
    <div
      v-else-if="error"
      class="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl font-bold text-center"
    >
      {{ error }}
    </div>

    <!-- محتوى لوحة التحكم الرئيسي -->
    <div v-else-if="stats" class="space-y-8">
      <!-- أولاً: بطاقات الملخص الرقمي الإجمالي العلوي (Stats Cards Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- بطاقة إجمالي سجلات الحصر -->
        <AppCard class="relative overflow-hidden group hover:border-emerald-500/30">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <p class="text-xs font-bold text-text-muted uppercase tracking-wider">
                إجمالي استمارات الحصر
              </p>
              <h3
                class="text-3xl font-black text-text-primary group-hover:text-emerald-400 transition-colors"
              >
                {{ stats.summary.total_surveys }}
              </h3>
            </div>
            <div
              class="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.05)]"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div
            class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
          ></div>
        </AppCard>

        <!-- بطاقة إجمالي الأفراد المشمولين -->
        <AppCard class="relative overflow-hidden group hover:border-blue-500/30">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <p class="text-xs font-bold text-text-muted uppercase tracking-wider">
                إجمالي أفراد الأسر
              </p>
              <h3
                class="text-3xl font-black text-text-primary group-hover:text-blue-400 transition-colors"
              >
                {{ stats.summary.total_family_members }}
              </h3>
            </div>
            <div class="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div
            class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
          ></div>
        </AppCard>

        <!-- بطاقة الحالات ذات الحسابات المصرفية الجاهزة -->
        <AppCard class="relative overflow-hidden group hover:border-amber-500/30">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <p class="text-xs font-bold text-text-muted uppercase tracking-wider">
                مُلاك بحساب مصرفي
              </p>
              <h3
                class="text-3xl font-black text-text-primary group-hover:text-amber-400 transition-colors"
              >
                {{ stats.summary.has_bank_account }}
              </h3>
            </div>
            <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
          <div
            class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
          ></div>
        </AppCard>

        <!-- بطاقة الحالات التي لا تملك حساب مصرفي -->
        <AppCard class="relative overflow-hidden group hover:border-rose-500/30">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <p class="text-xs font-bold text-text-muted uppercase tracking-wider">
                بدون حساب مصرفي
              </p>
              <h3
                class="text-3xl font-black text-text-primary group-hover:text-rose-400 transition-colors"
              >
                {{ stats.summary.no_bank_account }}
              </h3>
            </div>
            <div class="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div
            class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent"
          ></div>
        </AppCard>
      </div>

      <!-- ثانياً: قسم التحليلات الهيكلية والتوزيعية (الصفوف والرسوم البيانية المصغرة) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- صندوق توزيع الحالات الاجتماعية -->
        <AppCard class="flex flex-col justify-between">
          <div>
            <h4 class="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              التوزيع حسب الحالة الاجتماعية
            </h4>
            <div class="space-y-4">
              <div
                v-for="item in stats.marital_status_distribution"
                :key="item.label"
                class="space-y-1"
              >
                <div class="flex justify-between text-xs font-bold text-text-secondary">
                  <span>{{ item.label }}</span>
                  <span class="font-mono text-text-primary">{{ item.count }} حالة</span>
                </div>
                <!-- بار التقدم البصري مع وهج مخصص -->
                <div
                  class="w-full h-2 bg-surface-ground rounded-full overflow-hidden border border-surface-border/20"
                >
                  <div
                    class="h-full bg-gradient-to-l from-primary to-primary-light transition-all duration-500 shadow-[0_0_10px_rgba(var(--color-primary),0.3)]"
                    :style="{
                      width: `${calculatePercentage(item.count, stats.summary.total_surveys)}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- صندوق التوزيع حسب الكثافة وحجم الأسرة (Smart Ranges) -->
        <AppCard class="flex flex-col justify-between">
          <div>
            <h4 class="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              تصنيف حجم وكثافة الأسر
            </h4>
            <div class="space-y-4">
              <div
                v-for="item in stats.family_size_distribution"
                :key="item.label"
                class="space-y-1"
              >
                <div class="flex justify-between text-xs font-bold text-text-secondary">
                  <span>{{ item.label }}</span>
                  <span class="font-mono text-text-primary">{{ item.count }} أسرة</span>
                </div>
                <div
                  class="w-full h-2 bg-surface-ground rounded-full overflow-hidden border border-surface-border/20"
                >
                  <div
                    class="h-full bg-gradient-to-l from-blue-500 to-blue-400 transition-all duration-500"
                    :style="{
                      width: `${calculatePercentage(item.count, stats.summary.total_surveys)}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- صندوق أعلى 5 مصارف تجارية مسجلة -->
        <AppCard class="flex flex-col justify-between">
          <div>
            <h4 class="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              أعلى المصارف التجارية تكراراً
            </h4>
            <div
              v-if="stats.top_banks.length === 0"
              class="text-center py-8 text-xs text-text-muted font-bold"
            >
              لا توجد حسابات مصرفية مسجلة بعد.
            </div>
            <div v-else class="space-y-4">
              <div v-for="item in stats.top_banks" :key="item.bank" class="space-y-1">
                <div class="flex justify-between text-xs font-bold text-text-secondary">
                  <span class="truncate max-w-[180px]">{{ item.bank }}</span>
                  <span class="font-mono text-text-primary">{{ item.count }} مستفيد</span>
                </div>
                <div
                  class="w-full h-2 bg-surface-ground rounded-full overflow-hidden border border-surface-border/20"
                >
                  <div
                    class="h-full bg-gradient-to-l from-amber-500 to-amber-400 transition-all duration-500"
                    :style="{
                      width: `${calculatePercentage(item.count, stats.summary.has_bank_account)}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- ثالثاً: المنحنى الزمني لمعدل الحصر والإدخال اليومي (آخر 7 أيام) -->
      <AppCard>
        <h4 class="text-base font-bold text-text-primary mb-6 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          المنحنى الزمني للأداء الميداني الإدخالي (آخر 7 أيام)
        </h4>
        <div
          class="flex items-end justify-between gap-2 h-48 pt-6 px-4 bg-surface-ground/30 border border-surface-border/20 rounded-xl"
        >
          <div
            v-for="day in stats.registration_trend"
            :key="day.date"
            class="flex flex-col items-center flex-1 group"
          >
            <!-- شريط الـ Bar الذكي التفاعلي مع توهج زمردي ناعم يظهر عند الحوم فوقه -->
            <div
              class="w-full max-w-[32px] sm:max-w-[48px] rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 relative group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.1)] group-hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] flex justify-center"
              :style="{ height: `${calculateChartBarHeight(day.count)}%` }"
            >
              <!-- توليد الـ Tooltip الرقمي عند الإشارة بالإصبع أو الماوس -->
              <span
                class="absolute -top-8 bg-surface-section text-text-primary border border-surface-border px-2 py-0.5 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-10"
              >
                {{ day.count }} استمارة
              </span>
            </div>
            <span class="text-[10px] font-bold text-text-secondary mt-2 truncate max-w-full">
              {{ day.day_name }}
            </span>
            <span class="text-[8px] font-mono text-text-muted hidden sm:block">
              {{ formatDateString(day.date) }}
            </span>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import apiClient from '@/services/apiClient' // استيراد العميل المركزي المعتمد بمشروعك

const stats = ref(null)
const loading = ref(true)
const error = ref(null)

// دالة حساب النسب المئوية الدقيقة لبناء الأشرطة الرسومية المتجاوبة
const calculatePercentage = (count, total) => {
  if (!total || total === 0) return 0
  return Math.min(Math.round((count / total) * 100), 100)
}

// دالة حساب الارتفاع العمودي لشريط شارت الأيام بحد أدنى 6% لمنع اختفاء الأيام الصفرية بجمالية وثبات
const calculateChartBarHeight = (count) => {
  if (!stats.value) return 6
  const counts = stats.value.registration_trend.map((d) => d.count)
  const max = Math.max(...counts, 1)
  return Math.max((count / max) * 100, 6)
}

// دالة تنسيق مبسطة لعرض يوم وشهر الاستخراج الزمني أسفل الأعمدة
const formatDateString = (dateStr) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateStr
}

// جلب مصفوفة الإحصائيات الكاملة من الباك إند فور تحميل المكون
const fetchDashboardStats = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/dashboard')
    stats.value = response.data
  } catch (err) {
    console.error(err)
    error.value = 'فشل في جلب وتحميل مؤشرات لوحة التحكم، يرجى التحقق من اتصال السيرفر.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
