type Float = 'left' | 'right'

export interface MenuItem {
  label: string
  path: string
  icon?: any
  minimize: boolean
  float: Float
  elements?: MenuItem[]
}
