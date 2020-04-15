import Vue from 'vue'
import Router from 'vue-router'
import p2Login from '../views/project2/Login'
import p2Register from '../views/project2/Register'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios);
Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'p2login',
      component: p2Login
    },
    {
      path: 'login',
      name: 'p2login',
      component: p2Login
    },
    {
      path: '/p2/register',
      name: 'p2register',
      component: p2Register
    },
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "home" */ '../views/project2/main/Home'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/main',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/project2/page/Main.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/userinfo',
          component: () => import( '../views/project2/page/UserInfo.vue'),
          meta: { title: '个人中心' }
        },
        {
          path: '/userlist',
          component: () => import( '../views/project2/page/UserList.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: '/rolelist',
          component: () => import( '../views/project2/page/RoleList.vue'),
          meta: { title: '身份管理' }
        }
      ]
    }
  ]
})

