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

interface UserUpdatePayload {
  password: string
}

export interface UserUpdateInfoPayload extends UserUpdatePayload {
  first_name: string
  last_name: string
  phone_number: string
  username: string
  avatar: string
  description: string
}

export interface UserUpdateEmailPayload extends UserUpdatePayload {
  email: string
}

export interface UserUpdatePasswordPayload extends UserUpdatePayload {
  new_password: string
}
