import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import envConfig from '~/configs/env.config'
import routeApi from '~/configs/route.api'
import tokenService from './token.service'
import { IResponse } from '~/models/IResponse'
import { Token } from '~/models/token'

const client = axios.create({
  baseURL: envConfig.API_ENDPOINT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  withCredentials: true
})

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const whiteList: string[] = [routeApi.auth.login, routeApi.auth.register, routeApi.auth.generateToken]

    const pass: boolean = whiteList.some((item: string) => config.url?.includes(item))
    if (pass) {
      return config
    }

    let access_token = tokenService.getAccessToken()
    const refresh_token = tokenService.getRefreshToken()
    if (!access_token && refresh_token) {
      const resp: IResponse<Token> = await tokenService.generate(refresh_token)
      if (resp.status === 200) {
        const data: Token | undefined = resp.data
        if (data) {
          access_token = data.access_token
          tokenService.setAccessToken(data.access_token)
          tokenService.setRefreshToken(data.refresh_token)
        }
      }
    }

    if (access_token) config.headers.Authorization = `Bearer ${access_token}`

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

client.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const resp = response.data

    return resp
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default client
