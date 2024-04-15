import { IResponse } from '~/models/IResponse'
import client from './axios.service'
import { PaginationResponse } from '~/models/utils'
import { Workspace, WorkspaceCreatePayload, WorkspaceSearchParams } from '~/models/workspace'
import routeApi from '~/configs/route.api'

const getWorkspaces = async (params: WorkspaceSearchParams): Promise<IResponse<PaginationResponse<Workspace>>> => {
  return await client.get(routeApi.workspace.getWorkspaces, {
    params: params
  })
}

const createWorkspace = async (payload: WorkspaceCreatePayload): Promise<IResponse<Workspace>> => {
  return await client.post('/workspaces', payload)
}

export default {
  getWorkspaces,
  createWorkspace
}
