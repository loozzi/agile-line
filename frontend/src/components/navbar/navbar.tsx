import {
  Avatar,
  Button,
  CogIcon,
  ExpandAllIcon,
  InboxIcon,
  LayersIcon,
  LogOutIcon,
  MapIcon,
  Pane,
  PaneProps,
  PersonIcon,
  PropertyIcon,
  StyleIcon,
  UserIcon,
  majorScale
} from 'evergreen-ui'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/app/hook'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { GET_WORKSPACE, selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { WorkspaceParams } from '~/models/workspace'
import { CollapseComp } from '../collapse/collapse'
import { NavbarButtonComp } from './navbar-btn'
import { UsersGroupIcon } from '~/assets/icons'
import { selectUser } from '~/hooks/auth/auth.slice'

interface NavbarCompProps extends PaneProps {}

export const NavbarComp = (props: NavbarCompProps) => {
  const dispatch = useAppDispatch()
  const params = useParams()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const currentUser = useAppSelector(selectUser)

  const handleOpenModalWorkspace = () => {
    history.push(routes.workspace.root)
  }

  const handleRedirect = (route: string) => {
    history.push(route)
  }

  useEffect(() => {
    const { permalink } = params
    if (permalink) {
      const payload: WorkspaceParams = { permalink: permalink }
      dispatch({ type: GET_WORKSPACE, payload: payload })
    }
  }, [])

  return (
    <Pane {...props} display='flex' flexDirection='column' justifyContent='space-between' padding={majorScale(2)}>
      <Pane>
        <Pane display='flex' justifyContent='space-between' alignItems='center'>
          <NavbarButtonComp
            onClick={handleOpenModalWorkspace}
            beforeIcon={
              <Avatar
                name={currentWorkspace?.title}
                size={majorScale(4)}
                src={currentWorkspace?.logo}
                borderRadius={majorScale(1)}
              />
            }
            label={currentWorkspace?.title || 'Chọn workspace'}
            maxLabelWidth={majorScale(10)}
            labelBold={true}
            afterIcon={<ExpandAllIcon />}
          />
          <Button iconAfter={<StyleIcon />} paddingLeft='0'></Button>
        </Pane>
        <Pane marginTop={majorScale(2)}>
          <NavbarButtonComp
            beforeIcon={<InboxIcon size={majorScale(2)} />}
            label='Inbox'
            onClick={handleOpenModalWorkspace}
          />
          <NavbarButtonComp
            beforeIcon={<PropertyIcon size={majorScale(2)} />}
            label='My issues'
            onClick={handleOpenModalWorkspace}
          />
        </Pane>

        <CollapseComp
          label={
            <span
              style={{
                fontWeight: 600
              }}
            >
              Workspace
            </span>
          }
          marginTop={majorScale(2)}
        >
          <NavbarButtonComp label='Views' beforeIcon={<LayersIcon />} onClick={handleOpenModalWorkspace} />
          <NavbarButtonComp label='Roadmaps' beforeIcon={<MapIcon />} onClick={handleOpenModalWorkspace} />
          <NavbarButtonComp label='Teams' beforeIcon={<PersonIcon />} onClick={handleOpenModalWorkspace} />
        </CollapseComp>

        <CollapseComp
          label={
            <span
              style={{
                fontWeight: 600
              }}
            >
              Favourites
            </span>
          }
          marginTop={majorScale(2)}
        ></CollapseComp>

        <CollapseComp
          label={
            <span
              style={{
                fontWeight: 600
              }}
            >
              Projects
            </span>
          }
          marginTop={majorScale(2)}
        ></CollapseComp>
        <CollapseComp
          label={
            <span
              style={{
                fontWeight: 600
              }}
            >
              Cài đặt Workspace
            </span>
          }
        >
          <NavbarButtonComp
            label='Thông tin cơ bản'
            beforeIcon={<CogIcon />}
            onClick={() => handleRedirect(`/${params.permalink}/${routes.workspace.setting.slug}`)}
          />
          <NavbarButtonComp
            label='Thành viên'
            beforeIcon={<UsersGroupIcon />}
            onClick={() => handleRedirect(`/${params.permalink}/${routes.workspace.members.slug}`)}
          />
        </CollapseComp>
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
          onClick={() => handleRedirect(routes.auth.logout)}
        />
      </Pane>
    </Pane>
  )
}
