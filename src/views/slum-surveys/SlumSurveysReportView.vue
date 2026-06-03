<template>
  <div class="print-portrait-container bg-white text-black p-6 font-sans" dir="rtl">
    <!-- شريط التحكم العلوي - يتم إخفاؤه تلقائياً أثناء الطباعة الفعالية -->
    <div
      class="print:hidden flex justify-end gap-3 mb-6 bg-gray-50 border border-gray-200 p-3 rounded shadow-sm"
    >
      <button
        @click="printReport"
        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        طباعة التقرير الحالي
      </button>
    </div>

    <!-- ترويسة التقرير الرسمية والهوية البصرية للنظام -->
    <div class="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-6">
      <div class="flex items-center gap-4">
        <img src="/MainLogo2.png" alt="Logo" class="w-16 h-16 object-contain" />
        <div>
          <p class="text-base font-bold text-gray-600">نظام المخططات وإدارة حصر العشوائيات</p>
          <p class="text-xs text-gray-400 font-medium">منصة Zonex الرقمية الموحدة</p>
        </div>
      </div>
      <div class="text-center">
        <h2
          class="text-xl font-black border-2 border-black py-1 px-8 bg-gray-100 uppercase shadow-sm"
        >
          تقرير كشف سجلات الحصر الشامل
        </h2>
      </div>
      <div class="text-left text-xs font-medium text-gray-500 border-r-2 border-gray-200 pr-4">
        <p>تاريخ التقرير: {{ currentDate }}</p>
        <p>وقت الاستخراج: {{ currentTime }}</p>
      </div>
    </div>

    <!-- شريط عرض المعايير والفلاتر المطبقة على البيانات المستخرجة -->
    <div class="bg-gray-50 border border-gray-200 rounded p-3 mb-6">
      <p class="text-[10px] text-gray-500 font-bold uppercase mb-1">
        المعايير والمحددات المطبقة حالياً:
      </p>
      <p class="text-sm font-black text-gray-900 leading-relaxed">
        {{ activeFiltersText }}
      </p>
    </div>

    <!-- بطاقات الإحصائيات السريعة الملخصة لنتائج الحصر الميداني المفلتر -->
    <div class="grid grid-cols-5 gap-3 mb-6">
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">إجمالي الحالات</p>
        <p class="text-lg font-black">{{ printData?.reportData?.length || 0 }}</p>
      </div>
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">أسرة كبيرة (>=7)</p>
        <p class="text-lg font-black text-rose-700">{{ countStats.largeFamily }}</p>
      </div>
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">أسرة متوسطة (4-6)</p>
        <p class="text-lg font-black text-blue-700">{{ countStats.mediumFamily }}</p>
      </div>
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">أسرة صغيرة (1-3)</p>
        <p class="text-lg font-black text-emerald-700">{{ countStats.smallFamily }}</p>
      </div>
      <div class="border border-gray-300 p-2 rounded bg-white shadow-sm flex flex-col items-center">
        <p class="text-gray-500 text-[9px] font-bold mb-1">مُلاك بحساب مصرفي</p>
        <p class="text-lg font-black text-amber-700">{{ countStats.hasBankAccount }}</p>
      </div>
    </div>

    <!-- جدول البيانات الرئيسي المستعرض لكافة تفاصيل الاستمارة الميدانية -->
    <table class="w-full text-right border-collapse border-2 border-black shadow-sm">
      <thead>
        <tr class="bg-gray-800 text-white print:bg-gray-200 print:text-black text-[10px]">
          <th class="p-2 border border-black w-8 text-center">#</th>
          <th class="p-2 border border-black text-right">الاسم رباعي لرب الأسرة</th>
          <th class="p-2 border border-black text-center w-28">الرقم الوطني</th>
          <th class="p-2 border border-black text-center w-20">الحالة الاجتماعية</th>
          <th class="p-2 border border-black text-center">كتيب / ورقة العائلة</th>
          <th class="p-2 border border-black text-center w-16">أفراد الأسرة</th>
          <th class="p-2 border border-black text-center">العنوان الحالي للعقار</th>
          <th class="p-2 border border-black text-center w-36">المصرف المالي وحسابه</th>
        </tr>
      </thead>
      <tbody class="text-[11px]">
        <tr
          v-for="(item, index) in printData?.reportData"
          :key="item.id"
          class="border-b border-gray-400 break-inside-avoid odd:bg-white even:bg-gray-50/50"
        >
          <td class="p-2 border border-gray-400 text-center font-bold">{{ index + 1 }}</td>
          <td class="p-2 border border-gray-400 font-black text-xs">
            {{ item.full_name }}
          </td>
          <td class="p-2 border border-gray-400 text-center font-mono">{{ item.national_id }}</td>
          <td class="p-2 border border-gray-400 text-center">{{ item.marital_status || '-' }}</td>
          <td class="p-2 border border-gray-400 text-center text-[10px]">
            <div class="flex flex-col">
              <span v-if="item.family_book_number">كتيب: {{ item.family_book_number }}</span>
              <span v-if="item.family_paper_number">ورقة: {{ item.family_paper_number }}</span>
              <span v-if="!item.family_book_number && !item.family_paper_number">-</span>
            </div>
          </td>
          <td class="p-2 border border-gray-400 text-center font-bold text-sm">
            {{ item.family_members_count }}
          </td>
          <td class="p-2 border border-gray-400 text-right text-[10px] max-w-[180px] truncate">
            {{ item.current_address }}
          </td>
          <td class="p-2 border border-gray-400 text-center text-[10px]">
            <div v-if="item.bank_name" class="flex flex-col">
              <span class="font-bold text-gray-800">{{ item.bank_name }}</span>
              <span class="font-mono text-gray-500 text-[9px]" style="direction: ltr">{{
                item.account_number || 'لا يوجد حساب'
              }}</span>
            </div>
            <span v-else class="text-gray-400">غير متوفر</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- تذييل الاعتمادات والتوقيعات الرسمية للإدارات الفنية للتقرير المطبوع -->
    <div
      class="mt-12 grid grid-cols-3 gap-8 text-center pt-8 border-t-2 border-gray-100 break-inside-avoid"
    >
      <div class="space-y-12">
        <p class="font-bold text-gray-800 text-sm">إعداد الباحث الميداني المختص</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
      <div class="space-y-12">
        <p class="font-bold text-gray-800 text-sm">التدقيق ومطابقة السجلات</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
      <div class="space-y-12">
        <p class="font-bold text-gray-800 text-sm">يعتمد / رئيس اللجنة الفنية العليا</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
    </div>

    <!-- التذييل الثابت للصفحات المطبوعة لتوضيح الهوية ونظام المصدر -->
    <div
      class="fixed bottom-0 left-0 w-full text-center text-[9px] text-gray-400 py-2 hidden print:block border-t border-gray-100"
    >
      صفحة <span class="page-number"></span> | تم الاستخراج من منصة Zonex الرقمية الموحدة لإدارة
      وحصر العشوائيات
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const printData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-EG')
const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

const printReport = () => window.print()

// صياغة النص المعبر عن المحددات والفلترة النشطة والذكية بالخلفية للتقرير الحالي
const activeFiltersText = computed(() => {
  if (!printData.value) return 'جاري جلب وتحضير مراجع التقرير...'
  const f = printData.value.filters || {}
  const s = printData.value.search
  const parts = []

  if (s) parts.push(`مفتاح البحث السريع: ${s}`)
  if (f.marital_status) parts.push(`الحالة الاجتماعية: ${f.marital_status}`)
  if (f.bank) parts.push(`تصفية المصرف: ${f.bank}`)

  if (f.family_size) {
    let sizeText = ''
    if (f.family_size === 'small') sizeText = 'أسرة صغيرة (1 - 3 أفراد)'
    if (f.family_size === 'medium') sizeText = 'أسرة متوسطة (4 - 6 أفراد)'
    if (f.family_size === 'large') sizeText = 'أسرة كبيرة (7 أفراد فما فوق)'
    if (f.family_size === 'none') sizeText = 'بدون عائلة (0)'
    parts.push(`حجم الكثافة الأسرية: ${sizeText}`)
  }

  return parts.length > 0
    ? parts.join(' | ')
    : 'عرض السجل الشامل لحصر العشوائيات (بدون فلاتر ومحددات خاضعة)'
})

// حساب الحالات الإحصائية لبيانات الجدول الحالي تفاعلياً
const countStats = computed(() => {
  const data = printData.value?.reportData || []
  return {
    smallFamily: data.filter(
      (i) => Number(i.family_members_count) >= 1 && Number(i.family_members_count) <= 3,
    ).length,
    mediumFamily: data.filter(
      (i) => Number(i.family_members_count) >= 4 && Number(i.family_members_count) <= 6,
    ).length,
    largeFamily: data.filter((i) => Number(i.family_members_count) >= 7).length,
    hasBankAccount: data.filter((i) => i.bank_name && i.bank_name.trim() !== '').length,
  }
})

// استعادة البيانات المخزنة مؤقتاً في جلسة sessionStorage المتفق عليها لإطلاق أمر الطباعة التلقائي
onMounted(() => {
  const savedData = sessionStorage.getItem('slumSurveysPrintData')
  if (savedData) {
    printData.value = JSON.parse(savedData)
    setTimeout(() => {
      window.print()
    }, 1000)
  }
})
</script>

<style scoped>
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  body {
    background-color: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page-number::after {
    content: counter(page);
  }
}
table {
  border-spacing: 0;
  width: 100%;
}
thead {
  display: table-header-group;
}
tfoot {
  display: table-footer-group;
}
tr {
  break-inside: avoid;
}
.print-portrait-container {
  counter-reset: page;
}
</style>
