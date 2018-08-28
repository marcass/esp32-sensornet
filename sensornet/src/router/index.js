import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/pages/Hello'
import Login from '@/components/pages/Login'
import Userupdate from '@/components/pages/UserUpdate'
import Three from '@/components/pages/403'
import Four from '@/components/pages/404'
import Logout from '@/components/pages/Logout'
import Graphs from '@/components/pages/Graphs'
import CustomGraph from '@/components/pages/CustomGraph'

// Vue.router = Router
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/auth/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/graphs',
      name: 'Graphs',
      component: Graphs,
      meta: {auth: true}
    },
    {
      path: '/customgraphs',
      name: 'CustomGraph',
      component: CustomGraph,
      meta: {auth: true}
    },
    {
      path: '/userupdate',
      name: 'UpdatePassword',
      component: Userupdate,
      meta: {auth: ['admin', 'sensuser']}
    },
    {
      path: '/403',
      name: '403',
      component: Three
    },
    {
      path: '/404',
      name: '404',
      component: Four
    }
  ]
})
