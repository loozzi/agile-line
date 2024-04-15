const auth = {
  login: '/auth/login',
  register: '/auth/register',
  generateToken: '/auth/refresh-token/',
  sendOTP: '/auth/send-otp',
  verify: '/auth/verify'
}

const workspace = {
  getWorkspaces: '/workspace/',
  createWorkspace: '/workspace/'
}

export default {
  auth,
  workspace
}
