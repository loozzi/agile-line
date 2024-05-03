import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'
import { IssueCreatePayload, IssueParams, IssueResponse, IssueStatus } from '~/models/issue'
import { PaginationResponse } from '~/models/utils'
import client from './axios.service'

const create = async (payload: IssueCreatePayload): Promise<IResponse<IssueResponse>> => {
  return await client.post(routeApi.issue.create, payload)
}

const getAll = async (params: IssueParams): Promise<IResponse<PaginationResponse<IssueResponse>>> => {
  return await client.get(routeApi.issue.getAll, {
    params
  })
}

const updateStatus = async (permalink: string, status: IssueStatus): Promise<IResponse<IssueResponse>> => {
  return await client.put(routeApi.issue.updateStatus.replace(':permalink', permalink), {
    status
  })
}

export default {
  create,
  getAll,
  updateStatus
}
