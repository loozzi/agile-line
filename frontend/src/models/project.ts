export interface ProjectMinimize {
  id: number
  name: string
  icon: string
  status: string
  roles: string[]
}

export type ProjectStatus = 'backlog' | 'planned' | 'inprogress' | 'completed' | 'canceled' | 'paused'
