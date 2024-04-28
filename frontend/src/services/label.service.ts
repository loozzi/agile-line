import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'
import { CreateLabelPayload, GetLabelsParams, LabelResponse } from '~/models/label'
import { PaginationResponse } from '~/models/utils'
import client from './axios.service'

const getAll = async (params: GetLabelsParams): Promise<IResponse<PaginationResponse<LabelResponse>>> => {
  return await client.get(routeApi.workspace.labels.replace(':permalink', params.permalink), { params })
}

const create = async (payload: CreateLabelPayload): Promise<IResponse<LabelResponse>> => {
  return await client.post(routeApi.label.create, payload)
}

const update = async (payload: CreateLabelPayload): Promise<IResponse<LabelResponse>> => {
  return await client.put(routeApi.label.update, payload)
}

const remove = async () => {}

export default {
  getAll,
  create,
  update,
  remove
}
