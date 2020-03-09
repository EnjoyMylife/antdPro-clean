export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './login/user' },
      { component: '404' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/welcome',
      },
      // dashboard
      {
        path: '/welcome',
        name: '欢迎',
        icon: 'smile',
        menuSign: 'welcome',
        routes:[
          {
            name: '欢迎2',
            icon: 'smile',
            path: '/welcome',
            component: './welcome',
          },
        ]
      },
      {
        name: '招聘信息管理',
        icon: 'smile',
        path: '/recruit',
        menuSign: 'recruit',
        routes: [
          {
            name: '实习管理',
            icon: 'smile',
            path: '/recruit/practice-management/',
            component: './practice-management',
          },
          {
            path: '/recruit/practice-management/new',
            name: '新建',
            component: './practice-form',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
];
