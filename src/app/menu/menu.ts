import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  // {
  //   id: 'home',
  //   title: 'Home',
  //   translate: 'MENU.HOME',
  //   type: 'item',
  //   icon: 'home',
  //   url: 'home'
  // },
  // {
  //   id: 'sample',
  //   title: 'Sample',
  //   translate: 'MENU.SAMPLE',
  //   type: 'item',
  //   icon: 'file',
  //   url: 'sample'
  // },



  {
    id: 'home',
    title: 'Dashboard',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'pages/seller/home'
  },
  {
    id: 'order-management',
    title: 'Order Management',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'pages/seller/order-management'
  },
  {
    id: 'customer-listing',
    title: 'Customer Listing',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'pages/seller/customer-listing'
  },
  {
    id: 'earnings',
    title: 'Earnings',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'pages/seller/earnings'
  },
  {
    id: 'refferals',
    title: 'Refferals',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'pages/seller/refferals'
  },
  {
    id: 'settings',
    title: 'Settings',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'pages/seller/settings'
  },
]
