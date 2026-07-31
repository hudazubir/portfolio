import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: 'projects',
          name: 'projects',
          component: () => import('@/views/ProjectsView.vue'),
        },
        {
          path: 'projects/:slug',
          name: 'project-details',
          component: () => import('@/views/ProjectDetailsView.vue'),
        },
        {
          path: 'experience',
          name: 'experience',
          component: () => import('@/views/ExperienceView.vue'),
        },
        {
          path: 'skills',
          name: 'skills',
          component: () => import('@/views/SkillsView.vue'),
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/ContactView.vue'),
        },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboardView.vue'),
          meta: {
            adminTitle: 'Overview',
          },
        },
        {
          path: 'messages',
          name: 'admin-messages',
          component: () => import('@/views/admin/AdminMessagesView.vue'),
          meta: {
            adminTitle: 'Messages',
          },
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('@/views/admin/AdminProjectsView.vue'),
          meta: {
            adminTitle: 'Projects',
          },
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth && !to.meta.guestOnly) return true

  const auth = useAuthStore()

  if (!auth.initialized) {
    try {
      await auth.fetchUser()
    } catch {
      if (to.meta.requiresAuth) {
        return {
          name: 'admin-login',
          query: { redirect: to.fullPath },
        }
      }
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'admin-login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'admin-dashboard' }
  }

  return true
})

export default router
