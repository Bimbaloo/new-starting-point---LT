import Vue from 'vue'
import Router from 'vue-router'
/* 普通加载 -- 3个js文件 */ /* ![](https://ws1.sinaimg.cn/large/812ebe37gy1flhct364n1j20qm0hqabk.jpg) */
// import HelloWorld from '@/components/HelloWorld'
// import Edit from '@/components/Edit'
// import User from '@/components/User'

/* 普通的异步模块加载 -- 6个js文件 */  /* ![](https://ws1.sinaimg.cn/large/812ebe37gy1flhcsnvwpsj20qm0hqjtg.jpg) */
// const User = () => import('@/components/User')
// const Edit = () => import('@/components/Edit')
// const HelloWorld = () => import('@/components/HelloWorld')

/* 相同名称放一起的的异步模块加载 -- 5个js文件 */ /* ![](https://ws1.sinaimg.cn/large/812ebe37gy1flhctwd1ptj20qm0hq763.jpg) */
const User = () => import(/* webpackChunkName: "group-foo" */ '@/components/User')
const Edit = () => import(/* webpackChunkName: "group-foo" */ '@/components/Edit')
const HelloWorld = () => import(/* webpackChunkName: "HelloWorld" */ '@/components/HelloWorld')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/edit',
      name: 'edit',
      component: Edit
    }, {
      path: '/user',
      name: 'User',
      component: User
    }
  ],
  mode: 'history'
})

