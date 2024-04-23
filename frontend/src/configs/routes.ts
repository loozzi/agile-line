export default {
  auth: {
    root: '/auth',
    login: '/auth/login',
    register: '/auth/register',
    verify: '/auth/verify',
    logout: '/auth/logout'
  },
  workspace: {
    root: '/workspace',
    create: '/workspace/create',
    list: '/workspace/list',
    permalink: '/:permalink',
    setting: {
      page: '/:permalink/settings',
      slug: 'settings'
    },
    members: {
      page: '/:permalink/members',
      slug: 'members',
      detail: '/:permalink/members/:username'
    }
  },
  profile: { page: '/user/:username', slug: 'user' }
}
