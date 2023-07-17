import Vue from 'vue';
import Router from 'vue-router';
import WelcomeView from '@/views/welcome/index.vue';
import FMwebView from '@/views/fmWeb/index.vue';
import VariAtionView from '@/views/variation/index.vue';
import LayoutComponent from '@/components/layout/index.vue';

Vue.use(Router)

export const viewsRouter = [
  {
    path: 'welcome',
    name: 'welcome',
    meta: {
      title: 'Welcome',
      icon: require('@/assets/icon/home.png')
    },
    component: WelcomeView
  },
  
  {
    path: 'fmWeb',
    name: 'fmWeb',
    meta: {
      title: 'FMWeb',
      icon: require('@/assets/icon/fmweb.png')
    },
    component: FMwebView
  },

  {
    path: 'variation',
    name: 'variation',
    meta: {
      title: 'Vari::Ation',
      icon: require('@/assets/icon/variation.png')
    },
    component: VariAtionView
  }
]

export const globalRouter = [
  {
    path: '/',
    name: 'home',
    redirect: '/welcome',
    component: LayoutComponent,
    children: [
      ...viewsRouter
    ]
  },
]

export default new Router({
  routes: [...globalRouter]
})
