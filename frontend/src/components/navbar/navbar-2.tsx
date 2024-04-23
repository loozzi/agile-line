import { HomeIcon, LayerIcon, LogOutIcon, Pane, PaneProps, UserIcon, majorScale } from 'evergreen-ui'
import { NavbarButtonComp } from './navbar-btn'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { useAppSelector } from '~/app/hook'
import { selectUser } from '~/hooks/auth/auth.slice'

interface NavbarComp2Props extends PaneProps {}

export const NavbarComp2 = (props: NavbarComp2Props) => {
  const currentUser = useAppSelector(selectUser)

  const handleRedirect = (route: string) => {
    history.push(route)
  }
  return (
    <Pane {...props} display='flex' flexDirection='column' justifyContent='space-between' padding={majorScale(2)}>
      <Pane>
        <NavbarButtonComp label='Trang chủ' beforeIcon={<HomeIcon />} onClick={() => handleRedirect('/')} />
        <NavbarButtonComp
          label='Workspace'
          beforeIcon={<LayerIcon />}
          onClick={() => handleRedirect(routes.workspace.root)}
        />
      </Pane>
      <Pane>
        <NavbarButtonComp
          label='Thông tin cá nhân'
          beforeIcon={<UserIcon />}
          onClick={() => handleRedirect(`/${routes.profile.slug}/${currentUser?.username}`)}
        />
        <NavbarButtonComp
          label='Đăng xuất'
          beforeIcon={<LogOutIcon />}
          onClick={() => history.push(routes.auth.logout)}
        />
      </Pane>
    </Pane>
  )
}
