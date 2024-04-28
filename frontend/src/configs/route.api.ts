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
  labels: '/workspace/:permalink/labels',
  deleteWorkspace: '/workspace/'
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
  create: '/project/'
}

const label = {
  create: '/label/',
  update: '/label/',
  delete: '/label/'
}

export default {
  auth,
  workspace,
  user,
  project,
  label
}
