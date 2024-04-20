import { ProjectMinimize } from './project'
import { PaginationParams } from './utils'
import { WorkspaceParams, WorkspaceRole } from './workspace'

export interface Member {
  avatar: string
  first_name: string
  id: number
  last_name: string
  role: WorkspaceRole
  username: string
  project: ProjectMinimize[]
}

export interface WorkspaceGetMembersParams extends WorkspaceParams, PaginationParams {
  member_kw?: string
  role?: WorkspaceRole
}

export interface WorkspaceSetRolePayload {
  user_id: number
  role: WorkspaceRole
}

export interface WorkspaceRemoveMemberParams extends WorkspaceParams {
  user_id: number
}

export interface WorkspaceAddMembersPayload {
  user_ids: number[]
}
