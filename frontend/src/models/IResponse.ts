export interface IResponse<T> {
  status: number
  message?: string
  error?: any
  data?: T
}
