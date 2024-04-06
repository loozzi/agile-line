import { IResponse } from '~/models/IResponse'
import client from './axios.service'

import { LoginPayload, RegisterPayload } from '~/models/user'
import { Token } from '~/models/token'
import routeApi from '~/configs/route.api'

const login = async (payload: LoginPayload): Promise<IResponse<Token>> => {
  return await client.post(routeApi.auth.login, payload)
}

const register = async (payload: RegisterPayload): Promise<IResponse<Token>> => {
  return await client.post(routeApi.auth.register, payload)
}

export default {
  login,
  register
}
