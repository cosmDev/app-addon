import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import creatWallet from '../views/CreatWallet.vue'
import StartView from '../views/StartView.vue'
import AccountsView from '../views/AccountsView.vue'
import TxsView from '../views/TxsView.vue'
import StakingView from '../views/StakingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/index.html',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/start',
      name: 'start',
      component: StartView,
    },
    {
      path: '/create-wallet',
      name: 'create-wallet',
      component: creatWallet,
    },
    {
      path: '/add-wallet',
      name: 'add-wallet',
      component: HomeView,
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: AccountsView,
    },
    {
      path: '/txs',
      name: 'txs',
      component: TxsView,
    },
    {
      path: '/staking',
      name: 'staking',
      component: StakingView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
