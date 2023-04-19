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
    icon: 'activity',
    url: 'pages/seller/home'
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
    id: 'customer-listing',
    title: 'Quotation Listing',
    translate: 'MENU.HOME',
    icon: 'trello',
    type: 'collapsible',
    children: [
      {
        id: 'moving-service',
        icon: '',
        title: 'Moving Services',
        type: 'item',
        url: 'pages/seller/quotation-listing/640dfae607de5a58ffdd8a25'
      },
      {
        id: 'home-services',
        icon: '',
        title: 'Home Services',
        type: 'item',
        url: 'pages/seller/quotation-listing/640f3a8107de5a58ffdd8a3e'
      },
      {
        id: 'home-services',
        icon: '',
        title: 'Legal Services',
        type: 'item',
        url: 'pages/seller/quotation-listing/640f3ab407de5a58ffdd8a40'
      },
      {
        id: 'home-services',
        icon: '',
        title: 'Financial Services',
        type: 'item',
        url: 'pages/seller/quotation-listing/640f3ccb07de5a58ffdd8a47'
      },
      {
        id: 'home-services',
        icon: '',
        title: 'Insurance Services',
        type: 'item',
        url: 'pages/seller/quotation-listing/640f3d0707de5a58ffdd8a4c'
      },
      {
        id: 'home-services',
        icon: '',
        title: 'Hotels and Travel',
        type: 'item',
        url: 'pages/seller/quotation-listing/640f3d4407de5a58ffdd8a4f'
      },

    ]
  },
  {
    id: 'earnings',
    title: 'Earnings',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'pocket',
    url: 'pages/seller/earnings'
  },
  // {
  //   id: 'refferals',
  //   title: 'Refferals',
  //   translate: 'MENU.HOME',
  //   type: 'item',
  //   icon: 'home',
  //   url: 'pages/seller/refferals'
  // },
  {
    id: 'chat',
    title: 'Chat',
    type: 'item',
    icon: 'message-square',
    url: 'pages/seller/chats'
  },
  {
    id: 'settings',
    title: 'Profile',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'user',
    url: 'pages/seller/profile'
  },
  {
    id: 'payment',
    title: 'Payment',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'dollar-sign',
    url: 'pages/seller/payment'
  },
]
