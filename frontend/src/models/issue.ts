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

export interface IssueResponse {
  id: number
  project: {
    id: number
    permalink: string
    name: string
    icon: string
  }
  name: string
  status: string
  label: string[]
  priority: string
  assignee_id: number
  assignor_id: number
  testor_id: number
  milestone_id: number
  permalink: string
  resources: [
    {
      id: number
      link: string
    }
  ]
  created_at: string
  updated_at: string
}
