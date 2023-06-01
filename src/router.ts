import { createRouter, createWebHashHistory } from 'vue-router'
// @ts-ignore

const routes = [
  {
    path: '/test',
    name: '/test',
    component: () => import('./views/test.vue')
  },
  {
    path: '/',
    name: '/md',
    component: () => import('./views/README.md')
  },
]
// console.log(routes)
// 配置路由
const router = createRouter({
  //history: createWebHistory(),
  history: createWebHashHistory(),
  routes: routes
})


router.afterEach((to: any) => {
  // 导航位置处理

})
export default router
