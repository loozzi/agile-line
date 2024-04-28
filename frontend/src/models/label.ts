import { PaginationParams } from './utils'

export interface LabelResponse {
  id: number
  color: string
  title: string
  description: string
  created_at: string
  updated_at: string
  [key: string]: any
}

export interface DeleteLabelParams {
  id: number
}

export interface CreateLabelPayload {
  workspace_id?: number
  id?: number
  color: string
  title: string
  description: string
}

export interface GetLabelsParams extends PaginationParams {
  permalink: string
}
