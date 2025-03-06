import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const externalLinks: Record<string, string> ={
  github: 'https://github.com/rioyuda02'
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/my-cv',
    name: 'CV',
    component: () => import('../components/Cv_view.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const externalRoute = to.path.substring(0)

  if (externalLinks[externalRoute] || externalLinks[from.path]) {
    window.open(externalLinks[externalRoute], '_blank')
    next(false)
    return
  }
  next()
})

export default router