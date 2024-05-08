const auth = {
  login: '/auth/login',
  register: '/auth/register',
  generateToken: '/auth/refresh-token',
  sendOTP: '/auth/send-otp',
  verify: '/auth/verify'
}

const workspace = {
  getWorkspaces: '/workspace/',
  createWorkspace: '/workspace/',
  editWorkspace: '/workspace/',
  members: '/workspace/:permalink/members',
  projects: '/workspace/:permalink/project',
  labels: '/workspace/:permalink/labels',
  deleteWorkspace: '/workspace/:permalink/delete'
}

const user = {
  getUser: '/user/',
  getUserByUsername: '/user/:username',
  editUser: '/user/',
  changePassword: '/user/password',
  changeEmail: '/user/email',
  search: '/user/search'
}

const project = {
  create: '/project/',
  get: '/project/:permalink',
  update: '/project/:permalink',
  delete: '/project/:permalink/delete'
}

const label = {
  create: '/label/',
  update: '/label/',
  delete: '/label/'
}

const issue = {
  create: '/issue/',
  getAll: '/issue/',
  get: '/issue/:permalink',
  updateStatus: '/issue/:permalink/status',
  updateAssignee: '/issue/:permalink/assignee',
  updatePriority: '/issue/:permalink/priority',
  updateLabel: '/issue/:permalink/label',
  update: '/issue/:permalink/name',
  delete: '/issue/:permalink'
}

const activity = {
  get: '/activity',
  create: '/activity',
  update: '/activity',
  delete: '/activity'
}

export default {
  auth,
  workspace,
  user,
  project,
  label,
  issue,
  activity
}
