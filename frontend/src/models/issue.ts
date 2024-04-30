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
