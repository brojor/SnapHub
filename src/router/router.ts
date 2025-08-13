import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router