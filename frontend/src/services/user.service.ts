import { IResponse } from '~/models/IResponse'
import client from './axios.service'
import { UserDetail, UserUpdateEmailPayload, UserUpdateInfoPayload, UserUpdatePasswordPayload } from '~/models/user'
import routeApi from '~/configs/route.api'
import { Token } from '~/models/token'

const getUser = async (): Promise<IResponse<UserDetail>> => {
  return await client.get(routeApi.user.getUser)
}

const updateUser = async (payload: UserUpdateInfoPayload): Promise<IResponse<UserDetail>> => {
  return await client.put(routeApi.user.editUser, payload)
}

const changePassword = async (payload: UserUpdatePasswordPayload): Promise<IResponse<any>> => {
  return await client.put(routeApi.user.changePassword, payload)
}

const changeEmail = async (payload: UserUpdateEmailPayload): Promise<IResponse<Token>> => {
  return await client.put(routeApi.user.changeEmail, payload)
}

export default {
  getUser,
  updateUser,
  changePassword,
  changeEmail
}
