import { IResponse } from '~/models/IResponse'
import client from './axios.service'
import { ActivityResponse } from '~/models/issue'
import routeApi from '~/configs/route.api'

const get = async (issue_id: number): Promise<IResponse<ActivityResponse[]>> => {
  return client.get(routeApi.activity.get, { params: { issue_id } })
}

const getNew = async (permalink: string): Promise<IResponse<ActivityResponse[]>> => {
  return client.get(routeApi.activity.getNew, { params: { permalink } })
}

const create = async (issue_id: number, description: string): Promise<IResponse<ActivityResponse>> => {
  return client.post(routeApi.activity.create, { issue_id, description })
}

const update = async (activity_id: number, description: string): Promise<IResponse<ActivityResponse>> => {
  return client.put(routeApi.activity.get, { activity_id, description })
}

const remove = async (activity_id: number): Promise<IResponse<any>> => {
  return client.delete(routeApi.activity.get, { params: { activity_id } })
}

export default {
  get,
  getNew,
  create,
  update,
  remove
}
