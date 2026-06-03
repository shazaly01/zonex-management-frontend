<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="border-b border-surface-border pb-5">
      <h3 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <span class="w-1.5 h-5 bg-primary rounded-full"></span>
        البيانات الشخصية لرب الأسرة
      </h3>

      <div class="space-y-5">
        <AppInput
          id="survey-full-name"
          label="الاسم رباعي"
          v-model="form.full_name"
          placeholder="ادخل الاسم رباعي بالكامل"
          required
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <AppInput
              id="survey-national-id"
              label="الرقم الوطني"
              v-model="form.national_id"
              placeholder="ادخل الرقم الوطني المكون من 12 رقمًا"
              required
            />
            <p v-if="errors.national_id" class="text-rose-500 text-xs mt-1 font-bold">
              حقل الرقم الوطني مطلوب بشكل إلزامي.
            </p>
          </div>

          <AppInput
            id="survey-phone-number"
            label="رقم الهاتف"
            v-model="form.phone_number"
            placeholder="ادخل رقم هاتف رب الأسرة"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AppInput
            id="survey-employer"
            label="جهة العمل"
            v-model="form.employer"
            placeholder="مثال: القطاع العام، القطاع الخاص، متقاعد..."
          />

          <AppDropdown
            id="survey-marital-status"
            label="الحالة الاجتماعية"
            v-model="form.marital_status"
            :options="maritalStatusOptions"
            placeholder="اختر الحالة الاجتماعية"
          />
        </div>
      </div>
    </div>

    <div class="border-b border-surface-border pb-5">
      <h3 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <span class="w-1.5 h-5 bg-primary rounded-full"></span>
        بيانات العائلة
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AppInput
          id="survey-family-book"
          label="رقم كتيب العائلة"
          v-model="form.family_book_number"
          placeholder="ادخل رقم الكتيب"
        />

        <AppInput
          id="survey-family-paper"
          label="رقم ورقة العائلة"
          v-model="form.family_paper_number"
          placeholder="ادخل رقم الورقة"
        />

        <AppInput
          id="survey-family-members-count"
          label="عدد أفراد الأسرة"
          v-model="form.family_members_count"
          type="number"
          min="0"
          required
        />
      </div>
    </div>

    <div class="border-b border-surface-border pb-5">
      <h3 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <span class="w-1.5 h-5 bg-primary rounded-full"></span>
        بيانات العقار والوضع السكني
      </h3>

      <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="md:col-span-2">
            <AppInput
              id="survey-current-address"
              label="عنوان السكن الحالي بالتفصيل"
              v-model="form.current_address"
              placeholder="ادخل المدينة، المنطقة، الشارع الأقرب أو المعالم الدالة"
              required
            />
          </div>
          <div>
            <AppInput
              id="survey-area"
              label="المساحة التقريبية"
              v-model="form.area"
              placeholder="مثال: 150 متر مربع"
            />
          </div>
        </div>

        <div>
          <label
            for="survey-housing-condition"
            class="block text-sm font-bold text-text-primary mb-2"
          >
            وصف الحالة العامة للسكن
          </label>
          <textarea
            id="survey-housing-condition"
            v-model="form.housing_condition"
            rows="3"
            class="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-surface-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
            placeholder="اكتب وصفًا دقيقًا للهيكل الإنشائي أو الأضرار الموجودة بالعقار العشوائي..."
          ></textarea>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <span class="w-1.5 h-5 bg-primary rounded-full"></span>
        البيانات المالية والمصرفية
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppInput
          id="survey-bank-name"
          label="اسم المصرف"
          v-model="form.bank_name"
          placeholder="مثال: مصرف الجمهورية، التجاري الوطني، الأمان..."
        />

        <AppInput
          id="survey-account-number"
          label="رقم الحساب المصرفي"
          v-model="form.account_number"
          placeholder="ادخل رقم الحساب بالكامل"
        />
      </div>
    </div>

    <div
      class="mt-8 pt-4 border-t border-surface-border flex justify-end space-x-3 space-x-reverse"
    >
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء الأمر </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ والتحقق...</span>
        <span v-else>حفظ سجل الحصر</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

// استيراد مكونات الـ UI المعتمدة بمشروعك
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// إدارة الأخطاء التفاعلية للرقم الوطني
const errors = reactive({
  national_id: false,
})

// مصفوفة خيارات القائمة المنسدلة للحالة الاجتماعية المدمجة بالملف المرفق
const maritalStatusOptions = [
  { id: 'أعزب', name: 'أعزب' },
  { id: 'متزوج', name: 'متزوج' },
  { id: 'مطلق', name: 'مطلق' },
  { id: 'أرمل', name: 'أرمل' },
]

// دالة توليد كائن البيانات النموذجي الفارغ لربطه بالـ Form
const createFreshForm = () => ({
  id: null,
  full_name: '',
  national_id: '',
  employer: '',
  marital_status: '',
  family_book_number: '',
  family_paper_number: '',
  family_members_count: 0, // القيمة الافتراضية كما تم إقرارها في الـ Migration
  current_address: '',
  area: '',
  housing_condition: '',
  phone_number: '',
  bank_name: '',
  account_number: '',
})

const form = ref(createFreshForm())

// مراقبة البيانات المبدئية عند تحديث السجلات أو إلغاء العمليات
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        id: newData.id,
        full_name: newData.full_name || '',
        national_id: newData.national_id || '',
        employer: newData.employer || '',
        marital_status: newData.marital_status || '',
        family_book_number: newData.family_book_number || '',
        family_paper_number: newData.family_paper_number || '',
        family_members_count: Number(newData.family_members_count) || 0,
        current_address: newData.current_address || '',
        area: newData.area || '',
        housing_condition: newData.housing_condition || '',
        phone_number: newData.phone_number || '',
        bank_name: newData.bank_name || '',
        account_number: newData.account_number || '',
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

// دالة تسليم وتحقق النموذج المباشر
const handleSubmit = () => {
  errors.national_id = false

  // التحقق الإلزامي من ملء حقل الرقم الوطني
  if (!form.value.national_id || form.value.national_id.trim() === '') {
    errors.national_id = true
    return
  }

  // إرسال كائن البيانات كاملاً للشاشة الأم لمعالجته بالخدمات
  emit('submit', { ...form.value })
}

// التراجع وإعادة التصفير
const handleCancel = () => {
  emit('cancel')
}
</script>
