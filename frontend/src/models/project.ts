import { User } from './user'

export interface ProjectMinimize {
  id: number
  name: string
  icon?: string
  status: string
  roles: string[]
}

export type ProjectStatus = 'backlog' | 'planned' | 'inprogress' | 'completed' | 'cancelled' | 'paused'

export interface ProjectResponse {
  id: number
  permalink: string
  name: string
  description: string
  icon: string
  status: ProjectStatus
  start_date: string
  end_date: string
  leader: User
  members: User[]
  updated_at: string
}

export interface ProjectCreatePayload {
  workspace_id: number
  name: string
  description: string
  icon: string
  status: ProjectStatus
  start_day: number
  start_month: number
  start_year: number
  end_day: number
  end_month: number
  end_year: number
  leader_id: number
  members_id: number[] | string
}
