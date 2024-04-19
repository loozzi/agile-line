export interface Pagination {
  count: number
  current_page: number
  total_page: number
  total_item: number
}

export interface PaginationResponse<T> {
  items: T[]
  pagination: Pagination
}

export interface PaginationParams {
  page?: number
  limit?: number
}
