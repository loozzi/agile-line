import { User } from './user'

export interface Token {
  access_token: string
  refresh_token: string
  user: User
}
