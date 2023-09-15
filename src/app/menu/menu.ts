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

  // {
  //   id: 'refferals',
  //   title: 'Refferals',
  //   translate: 'MENU.HOME',
  //   type: 'item',
  //   icon: 'home',
  //   url: 'pages/seller/refferals'
  // },



  {
    id: 'home',
    title: 'Dashboard',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'activity',
    url: 'pages/seller/home'
  },
  {
    id: 'customer-listing',
    title: 'Active Listing',
    translate: 'MENU.HOME',
    icon: 'trello',
    type: 'collapsible',
    children: [
    ]
  },
  {
    id: 'order-management',
    title: 'Order Management',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'folder',
    url: 'pages/seller/order-management'
  },
  {
    id: 'chat',
    title: 'Chat',
    type: 'item',
    icon: 'message-square',
    url: 'pages/seller/chats'
  },
  {
    id: 'review',
    title: 'Reviews',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'star',
    url: 'pages/seller/reviews'
  },
  {
    id: 'earnings',
    title: 'Earnings',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'dollar-sign',
    url: 'pages/seller/earnings'
  },
  {
    id: 'verifications',
    title: 'Verifications',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'activity',
    url: 'pages/seller/verifications'
  },
  {
    id: 'settings',
    title: 'Setting',
    icon: 'settings',
    type: 'collapsible',
    children: [
      {
        id: 'profile',
        title: 'Profile',
        type: 'item',
        icon: 'user',
        url: 'pages/seller/profile'
      },
      {
        id: 'payment',
        title: 'Payment',
        type: 'item',
        icon: 'dollar-sign',
        url: 'pages/seller/payment'
      },
    ]
  },
  {
    id: 'contact',
    title: 'Help',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'help-circle',
    url: 'pages/seller/help'
  },
]
