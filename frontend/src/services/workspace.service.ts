import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'
import { PaginationResponse } from '~/models/utils'
import { Workspace, WorkspaceCreatePayload, WorkspaceSearchParams } from '~/models/workspace'
import client from './axios.service'

const getWorkspaces = async (params: WorkspaceSearchParams): Promise<IResponse<PaginationResponse<Workspace>>> => {
  return await client.get(routeApi.workspace.getWorkspaces, {
    params: params
  })
}

const createWorkspace = async (payload: WorkspaceCreatePayload): Promise<IResponse<Workspace>> => {
  return await client.post(routeApi.workspace.createWorkspace, payload)
}

export default {
  getWorkspaces,
  createWorkspace
}
