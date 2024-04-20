import { ProjectMinimize } from './project'
import { WorkspaceRole } from './workspace'

export interface User {
  id: number
  username: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar: string | null
}

export interface UserDetail extends User {
  description: string | null
  phone_number: string | null
  created_at: string
  updated_at: string
}

export interface Member {
  avatar: string
  first_name: string
  id: number
  last_name: string
  role: WorkspaceRole
  username: string
  project: ProjectMinimize[]
}
