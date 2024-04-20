import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'
import { WorkspaceAddMembersPayload, WorkspaceRemoveMemberParams, WorkspaceSetRolePayload } from '~/models/member'
import { Member, WorkspaceGetMembersParams } from '~/models/member'
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

const getMembers = async (params: WorkspaceGetMembersParams): Promise<IResponse<PaginationResponse<Member>>> => {
  return await client.get(routeApi.workspace.members.replace(':permalink', params.permalink), {
    params: params
  })
}

const changeRoleMember = async (
  params: WorkspaceParams,
  payload: WorkspaceSetRolePayload
): Promise<IResponse<Member>> => {
  return await client.put(routeApi.workspace.members.replace(':permalink', params.permalink), payload)
}

const removeMember = async (params: WorkspaceRemoveMemberParams): Promise<IResponse<undefined>> => {
  return await client.delete(routeApi.workspace.members.replace(':permalink', params.permalink), {
    params: params
  })
}

const addMembers = async (
  params: WorkspaceParams,
  payload: WorkspaceAddMembersPayload
): Promise<IResponse<PaginationResponse<Member>>> => {
  return await client.post(routeApi.workspace.members.replace(':permalink', params.permalink), payload)
}

export default {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  editWorkspace,
  getMembers,
  changeRoleMember,
  removeMember,
  addMembers
}
