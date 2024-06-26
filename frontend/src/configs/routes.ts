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
    activity: '/:permalink/activity',
    setting: {
      page: '/:permalink/settings',
      slug: 'settings'
    },
    members: {
      page: '/:permalink/members',
      slug: 'members',
      detail: '/:permalink/members/:username'
    },
    projects: {
      page: '/:permalink/projects',
      slug: 'projects',
      detail: '/:permalink/projects/:projectPermalink'
    },
    labels: {
      page: '/:permalink/labels',
      slug: 'labels'
    },
    issues: {
      page: '/:permalink/issues',
      slug: 'issues',
      detail: '/:permalink/issues/:issuePermalink'
    }
  },
  profile: { page: '/user/:username', slug: 'user' }
}
