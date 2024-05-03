import { LabelResponse } from './label'
import { User } from './user'
import { PaginationParams } from './utils'

export type IssueStatus = 'backlog' | 'todo' | 'inprogress' | 'done' | 'duplicate' | 'cancelled'

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent' | 'nopriority'

export interface IssueCreatePayload {
  project_id: number
  name: string
  description: string
  status: IssueStatus
  label: string[] | string
  priority: IssuePriority
  assignee_id?: number
  assignor_id?: number
  testor?: number
  milestone_id?: number
  resources?: string[] | string
}

export interface ResourceResponse {
  id: number
  link: string
  created_at?: string
  updated_at?: string
}

export interface IssueResponse {
  id: number
  project: {
    id: number
    permalink: string
    name: string
    icon: string
  }
  name: string
  status: IssueStatus
  label: LabelResponse[]
  priority: IssuePriority
  assignee: User
  assignor: User
  testor_id?: number
  milestone_id?: number
  permalink: string
  resources: ResourceResponse[]
  created_at?: string
  updated_at?: string
}

export interface IssueParams extends PaginationParams {
  username?: string
  project_id?: number
  keyword?: string
  status?: IssueStatus
  label?: string[] | string
  workspace_id: number
}
