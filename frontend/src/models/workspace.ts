import { IssuePriority, IssueStatus } from './issue'
import { LabelResponse } from './label'
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

export interface WorkspaceParams extends PaginationParams {
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

export interface WorkspaceInfoResponse {
  workspace: Workspace
  members: {
    total: number
    admins: any[]
  }
  projects: {
    total: number
    items: any[]
  }
  labels: {
    total: number
    items: LabelResponse[]
  }
  issues: {
    total: number
    items: {
      id: number
      name: string
      permalink: string
      priority: IssuePriority
      status: IssueStatus
      [key: string]: any
    }[]
  }
}

export type WorkspaceRole = 'admin' | 'member' | 'moderator'
