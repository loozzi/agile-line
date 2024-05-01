import routeApi from '~/configs/route.api'
import client from './axios.service'
import { IssueCreatePayload, IssueParams, IssueResponse } from '~/models/issue'
import { IResponse } from '~/models/IResponse'
import { PaginationResponse } from '~/models/utils'

const create = async (payload: IssueCreatePayload): Promise<IResponse<IssueResponse>> => {
  return await client.post(routeApi.issue.create, payload)
}

const getAll = async (params: IssueParams): Promise<IResponse<PaginationResponse<IssueResponse>>> => {
  return await client.get(routeApi.issue.getAll, {
    params
  })
}

export default {
  create,
  getAll
}
