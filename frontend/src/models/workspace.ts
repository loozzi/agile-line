import { PaginationParams } from './utils'

export interface Workspace {
  id: number
  logo: string
  title: string
  description: string
  permalink: string
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface WorkspaceParams {
  permalink: string
}

export interface WorkspaceSearchParams extends PaginationParams {
  keyword?: string
}

export interface WorkspaceCreatePayload {
  title: string
  logo: string
  description: string
  is_private: boolean
}

export interface WorkspaceUpdatePayload extends WorkspaceCreatePayload {
  permalink: string
}

export type WorkspaceRole = 'admin' | 'member' | 'moderator'

export interface WorkspaceGetMembersParams extends WorkspaceParams, PaginationParams {
  member_kw?: string
  role?: WorkspaceRole
}
