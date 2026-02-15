import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import { authService } from '@/auth/auth-service';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },

  // หน้า login
  {
    path: '/login',
    component: LoginPage
  },

  // tabs
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
        meta: { requiresAuth: true }   // ต้อง login ก่อนเข้า
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


// 🔥 AUTH GUARD
router.beforeEach(async (to) => {
  const user = await authService.getCurrentUser();

  // login แล้ว ห้ามกลับหน้า login
  if (to.path === "/login" && user) {
    return "/tabs/tab1";
  }

  // ถ้ายังไม่ login แต่จะเข้าหน้า tab
  if (to.meta.requiresAuth && !user) {
    return "/login";
  }

  return true;
});

export default router;