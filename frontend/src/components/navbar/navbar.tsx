import {
  Avatar,
  CogIcon,
  Dialog,
  ExpandAllIcon,
  IconButton,
  InboxIcon,
  LayersIcon,
  LogOutIcon,
  MapIcon,
  Pane,
  PaneProps,
  ProjectsIcon,
  PropertyIcon,
  StyleIcon,
  TagIcon,
  UserIcon,
  majorScale
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/app/hook'
import { UsersGroupIcon } from '~/assets/icons'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { selectUser } from '~/hooks/auth/auth.slice'
import { GET_WORKSPACE, selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { Workspace, WorkspaceParams } from '~/models/workspace'
import { CreateIssueDialog } from '~/pages/issue/create-issue'
import { CollapseComp } from '../collapse/collapse'
import { NavbarButtonComp } from './navbar-btn'

interface NavbarCompProps extends PaneProps {}

interface NavbarButtonConfig {
  label: string
  beforeIcon?: any
  afterIcon?: any
  onClick: () => void
  maxLabelWidth?: number
}
interface NavbarCollapseConfig {
  label: string
  children: NavbarButtonConfig[]
}

export const NavbarComp = (props: NavbarCompProps) => {
  const dispatch = useAppDispatch()
  const params = useParams()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const currentUser = useAppSelector(selectUser)
  const [isShownCreate, setShownCreate] = useState<boolean>(false)

  const onCreateSuccess = (item: Workspace): void => {
    setShownCreate(false)
    item
  }

  const handleOpenModalWorkspace = () => {
    history.push(routes.workspace.root)
  }

  const handleRedirect = (route: string) => {
    history.push(route)
  }

  const navBarConfig: NavbarCollapseConfig[] = [
    {
      label: 'Workspace',
      children: [
        {
          label: 'Views',
          beforeIcon: <LayersIcon />,
          onClick: handleOpenModalWorkspace
        },
        {
          label: 'Roadmaps',
          beforeIcon: <MapIcon />,
          onClick: handleOpenModalWorkspace
        },
        {
          label: 'Projects',
          beforeIcon: <ProjectsIcon />,
          onClick: () => handleRedirect(`/${params.permalink}/${routes.workspace.projects.slug}`)
        }
      ]
    },
    {
      label: 'Favourites',
      children: []
    },
    {
      label: 'Projects',
      children: []
    },
    {
      label: 'Cài đặt Workspace',
      children: [
        {
          label: 'Thông tin cơ bản',
          beforeIcon: <CogIcon />,
          onClick: () => handleRedirect(`/${params.permalink}/${routes.workspace.setting.slug}`)
        },
        {
          label: 'Thành viên',
          beforeIcon: <UsersGroupIcon />,
          onClick: () => handleRedirect(`/${params.permalink}/${routes.workspace.members.slug}`)
        },
        {
          label: 'Nhãn',
          beforeIcon: <TagIcon />,
          onClick: () => handleRedirect(`/${params.permalink}/${routes.workspace.labels.slug}`)
        }
      ]
    }
  ]

  useEffect(() => {
    const { permalink } = params
    if (permalink) {
      const payload: WorkspaceParams = { permalink: permalink }
      dispatch({ type: GET_WORKSPACE, payload: payload })
    }
  }, [params])

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
          <IconButton icon={<StyleIcon />} onClick={() => setShownCreate(true)} />
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
            onClick={() => handleRedirect(`/${params.permalink}/${routes.workspace.issues.slug}`)}
          />
        </Pane>
        {navBarConfig.map((config, index) => (
          <CollapseComp key={index} label={config.label} marginTop={majorScale(2)}>
            {config.children.map((button, index) => (
              <NavbarButtonComp key={index} {...button} />
            ))}
          </CollapseComp>
        ))}
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
      <Dialog isShown={isShownCreate} title='Tạo issue' onCloseComplete={() => setShownCreate(false)} hasFooter={false}>
        <CreateIssueDialog onCreateSuccess={onCreateSuccess} closeDialog={() => setShownCreate(false)} />
      </Dialog>
    </Pane>
  )
}
