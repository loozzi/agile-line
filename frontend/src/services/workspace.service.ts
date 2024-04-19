import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'
import { PaginationResponse } from '~/models/utils'
import {
  Workspace,
  WorkspaceCreatePayload,
  WorkspaceParams,
  WorkspaceSearchParams,
  WorkspaceUpdatePayload
} from '~/models/workspace'
import client from './axios.service'

const getWorkspaces = async (params: WorkspaceSearchParams): Promise<IResponse<PaginationResponse<Workspace>>> => {
  return await client.get(routeApi.workspace.getWorkspaces, {
    params: params
  })
}

const createWorkspace = async (payload: WorkspaceCreatePayload): Promise<IResponse<Workspace>> => {
  return await client.post(routeApi.workspace.createWorkspace, payload)
}

const getWorkspace = async (params: WorkspaceParams): Promise<IResponse<Workspace>> => {
  return await client.get(routeApi.workspace.getWorkspaces + params.permalink)
}

const editWorkspace = async (
  params: WorkspaceParams,
  payload: WorkspaceUpdatePayload
): Promise<IResponse<Workspace>> => {
  return await client.put(routeApi.workspace.editWorkspace + params.permalink, payload)
}

export default {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  editWorkspace
}
