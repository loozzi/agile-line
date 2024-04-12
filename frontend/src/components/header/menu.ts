import routes from '~/configs/routes'
import { MenuItem } from '~/models/menu'

const menuItem: MenuItem[] = [
  { label: 'Trang chủ', path: '/', icon: '', float: 'left', minimize: false },
  {
    label: 'Tính năng',
    path: '',
    icon: '',
    float: 'left',
    minimize: false,
    elements: [
      { label: 'Issues', path: '#', icon: '', float: 'left', minimize: false },
      { label: 'Projects', path: '#', icon: '', float: 'left', minimize: false },
      { label: 'Roadmaps', path: '#', icon: '', float: 'left', minimize: false }
    ]
  },
  { label: 'Phương thức', path: '#', icon: '', float: 'left', minimize: true },
  { label: 'Khách hàng', path: '#', icon: '', float: 'left', minimize: true },
  { label: 'Chi phí', path: '#', icon: '', float: 'left', minimize: false },
  { label: 'Đăng nhập', path: routes.auth.login, icon: '', float: 'right', minimize: false },
  { label: 'Đăng ký', path: routes.auth.register, float: 'right', minimize: false }
]

export default menuItem
