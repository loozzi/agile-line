import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'
import {
  IssueCreatePayload,
  IssueParams,
  IssuePriority,
  IssueResponse,
  IssueStatus,
  IssueUpdatePayload
} from '~/models/issue'
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

const getDetail = async (permalink: string): Promise<IResponse<IssueResponse>> => {
  return await client.get(routeApi.issue.get.replace(':permalink', permalink))
}

const updateStatus = async (permalink: string, status: IssueStatus): Promise<IResponse<IssueResponse>> => {
  return await client.put(routeApi.issue.updateStatus.replace(':permalink', permalink), {
    status
  })
}

const updateAssignee = async (permalink: string, id: number): Promise<IResponse<IssueResponse>> => {
  return await client.put(routeApi.issue.updateAssignee.replace(':permalink', permalink), {
    assignee_id: id
  })
}

const updatePriority = async (permalink: string, priority: IssuePriority): Promise<IResponse<any>> => {
  return await client.put(routeApi.issue.updatePriority.replace(':permalink', permalink), {
    priority
  })
}

const updateLabel = async (permalink: string, label_ids: number[]): Promise<IResponse<any>> => {
  return await client.put(routeApi.issue.updateLabel.replace(':permalink', permalink), {
    label: `[${label_ids.toString()}]`
  })
}

const update = async (permalink: string, payload: IssueUpdatePayload): Promise<IResponse<IssueResponse>> => {
  return await client.put(routeApi.issue.update.replace(':permalink', permalink), payload)
}

export default {
  create,
  getAll,
  getDetail,
  updateStatus,
  updateAssignee,
  updatePriority,
  updateLabel,
  update
}
