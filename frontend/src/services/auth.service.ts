import { IResponse } from '~/models/IResponse'
import client from './axios.service'

import { LoginPayload, RegisterPayload, VerifyPayload } from '~/models/auth'
import { Token } from '~/models/token'
import routeApi from '~/configs/route.api'

const login = async (payload: LoginPayload): Promise<IResponse<Token>> => {
  return await client.post(routeApi.auth.login, payload)
}

const register = async (payload: RegisterPayload): Promise<IResponse<Token>> => {
  return await client.post(routeApi.auth.register, payload)
}

const sendOTP = async (): Promise<IResponse<undefined>> => {
  return await client.get(routeApi.auth.sendOTP)
}

const verify = async (payload: VerifyPayload): Promise<IResponse<Token | undefined>> => {
  return await client.post(routeApi.auth.verify, payload)
}

export default {
  login,
  register,
  sendOTP,
  verify
}
