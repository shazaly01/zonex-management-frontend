import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- استيراد التخطيطات الرئيسية (Layouts) ---
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// --- استيراد الصفحات الأساسية ---
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

// --- استيراد صفحات النظام الجديد ديناميكياً ---
// إدارة النظام والمستخدمين
const UsersList = () => import('@/views/users/UsersList.vue')
const RolesList = () => import('@/views/roles/RolesList.vue')
const BackupsList = () => import('@/views/settings/BackupsList.vue')

// نظام حصر العشوائيات الجديد
const SlumSurveysList = () => import('@/views/slum-surveys/SlumSurveysList.vue')

const routes = [
  // --- المسارات العامة (لا تتطلب مصادقة) ---
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      // إعادة توجيه المسار الجذري إلى صفحة تسجيل الدخول
      { path: '', redirect: '/login' },
    ],
  },

  {
    path: '/print/assistance',
    name: 'PrintAssistance',
    component: () => import('@/views/reports/PrintAssistance.vue'),
    meta: { requiresAuth: true, layout: 'empty' }, // تأكد أن التخطيط لا يحتوي على Sidebar أو Navbar
  },

  {
    path: '/print/slum-surveys',
    name: 'PrintSlumSurveys',
    component: () => import('@/views/slum-surveys/SlumSurveysReportView.vue'),
    meta: { requiresAuth: true, layout: 'empty' },
  },

  // --- المسارات المحمية (تتطلب مصادقة) ---
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { permission: 'dashboard.view' },
      },

      // --- مسارات إدارة النظام ---
      {
        path: 'users',
        name: 'UsersList',
        component: UsersList,
        // تأكد من أن الصلاحية هنا تتطابق مع ما تم تعريفه في الباك اند
        meta: { permission: 'user.view' },
      },
      {
        path: 'roles',
        name: 'RolesList',
        component: RolesList,
        meta: { permission: 'role.view' },
      },
      {
        path: 'settings/backups',
        name: 'BackupsList',
        component: BackupsList,
        meta: { permission: 'backup.view' },
      },

      // --- مسارات إدارة نظام حصر العشوائيات ---
      {
        path: 'slum-surveys',
        name: 'SlumSurveysList',
        component: SlumSurveysList,
        meta: { permission: 'survey.view' },
      },

      // إعادة توجيه المسار الرئيسي للتطبيق إلى لوحة التحكم
      { path: '', redirect: '/app/dashboard' },
    ],
  },

  // مسار للتعامل مع الصفحات غير الموجودة (404 Fallback)
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- حارس التنقل العام (Global Navigation Guard) ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated, can } = authStore

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      authStore.returnUrl = to.fullPath
      next({ name: 'Login' })
    } else {
      const requiredPermission = to.meta.permission
      if (requiredPermission && !can(requiredPermission)) {
        console.warn(
          `Access denied: route "${String(to.name)}" requires permission "${requiredPermission}"`,
        )
        // توجيه المستخدم للوحة التحكم إذا لم تكن لديه الصلاحية
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
