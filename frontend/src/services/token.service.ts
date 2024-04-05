import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'
import { Token } from '~/models/token'
import { User } from '~/models/user'
import client from './axios.service'

interface AccessTokenLocalStorage {
  timestamp: number
  value: string
}

const setAccessToken = (token: string): void => {
  const data: AccessTokenLocalStorage = {
    timestamp: Date.now(),
    value: token
  }
  localStorage.setItem('access_token', JSON.stringify(data))
}

const getAccessToken = (): string | null => {
  const dataRaw: string | null = localStorage.getItem('access_token')
  if (dataRaw) {
    const data: AccessTokenLocalStorage = JSON.parse(dataRaw)
    if (data.timestamp + 24 * 60 * 60 * 1000 > Date.now()) {
      return data.value
    } else {
      removeAccessToken()
    }
  }
  return null
}

const removeAccessToken = (): void => {
  localStorage.removeItem('access_token')
}

const setRefreshToken = (token: string): void => {
  localStorage.setItem('refresh_token', token)
}

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token')
}

const removeRefreshToken = (): void => {
  localStorage.removeItem('refresh_token')
}

const setUser = (user: User | undefined): void => {
  if (user) localStorage.setItem('user', JSON.stringify(user))
}

const getUser = (): User | undefined => {
  const userRaw: string | null = localStorage.getItem('user')
  if (userRaw) {
    return JSON.parse(userRaw)
  }
  return undefined
}

const removeUser = (): void => {
  localStorage.removeItem('user')
}

const generate = async (refresh_token: string): Promise<IResponse<Token>> => {
  return await client.post(routeApi.auth.generateToken, {
    refresh_token
  })
}

export default {
  setAccessToken,
  getAccessToken,
  removeAccessToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  setUser,
  getUser,
  removeUser,
  generate
}
