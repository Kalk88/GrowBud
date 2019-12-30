import Vue from 'vue'
import Router from 'vue-router'
import DefaultLayout from './layouts/Default.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'
import AddWateringSchedule from './views/AddWateringSchedule.vue'
import MyWateringSchedules from './views/MyWateringSchedules.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: DefaultLayout,
    children: [{
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/about',
        name: 'about',
        component: About
      },
      {
        path: '/addWateringSchedule',
        name: 'addWateringSchedule',
        component: AddWateringSchedule
      },
      {
        path: '/myWateringSchedules',
        name: 'myWateringSchedules',
        component: MyWateringSchedules
      }
    ]
  }]
})