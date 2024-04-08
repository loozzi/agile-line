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
