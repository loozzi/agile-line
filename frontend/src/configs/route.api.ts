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
  members: '/workspace/:permalink/members'
}

export default {
  auth,
  workspace
}
