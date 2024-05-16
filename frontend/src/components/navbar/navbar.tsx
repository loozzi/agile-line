import {
  Avatar,
  CogIcon,
  Dialog,
  ExpandAllIcon,
  IconButton,
  InboxIcon,
  LayersIcon,
  LogOutIcon,
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
import { ProjectResponse } from '~/models/project'
import { Workspace, WorkspaceParams } from '~/models/workspace'
import { CreateIssueDialog } from '~/pages/issue/create-issue'
import workspaceService from '~/services/workspace.service'
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
  collapsed?: boolean
}

export const NavbarComp = (props: NavbarCompProps) => {
  const dispatch = useAppDispatch()
  const params = useParams()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const currentUser = useAppSelector(selectUser)
  const [isShownCreate, setShownCreate] = useState<boolean>(false)
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [favProjects, setFavProjects] = useState<ProjectResponse[]>([])

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
          label: 'Cập nhật mới',
          beforeIcon: <InboxIcon />,
          onClick: () => handleRedirect(routes.workspace.activity.replace(':permalink', params.permalink!))
        },
        {
          label: 'Tổng quan',
          beforeIcon: <LayersIcon />,
          onClick: () => handleRedirect(`/${params.permalink}`)
        },
        {
          label: 'Danh sách dự án',
          beforeIcon: <ProjectsIcon />,
          onClick: () => handleRedirect(`/${params.permalink}/${routes.workspace.projects.slug}`)
        }
      ]
    },
    {
      label: 'Truy cập nhanh',
      children: favProjects.map((project) => ({
        label: project.name,
        beforeIcon: <Avatar src={project.icon} />,
        onClick: () => handleRedirect(`/${params.permalink}/${routes.workspace.projects.slug}/${project.permalink}`)
      }))
    },
    {
      label: 'Dự án',
      children: projects.map((project) => ({
        label: project.name,
        beforeIcon: <Avatar src={project.icon} />,
        onClick: () => handleRedirect(`/${params.permalink}/${routes.workspace.projects.slug}/${project.permalink}`)
      })),
      collapsed: true
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
      workspaceService.allProjects({ permalink: permalink }).then((data) => {
        setProjects(data.data!.items as ProjectResponse[])
      })
    }
  }, [params])

  useEffect(() => {
    const fav = localStorage.getItem('favourites')
    const projectIds = projects.map((p) => p.id)
    if (fav) {
      const favs = JSON.parse(fav) as ProjectResponse[]
      setFavProjects(favs.filter((f) => projectIds.includes(f.id)))
    }
  }, [projects])

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
          {/* <NavbarButtonComp
            beforeIcon={<InboxIcon size={majorScale(2)} />}
            label='Inbox'
            onClick={handleOpenModalWorkspace}
          /> */}
          <NavbarButtonComp
            beforeIcon={<PropertyIcon size={majorScale(2)} />}
            label='Danh sách công việc'
            onClick={() => handleRedirect(`/${params.permalink}/${routes.workspace.issues.slug}`)}
          />
        </Pane>
        {navBarConfig.map((config, index) => (
          <CollapseComp key={index} label={config.label} marginTop={majorScale(2)} collapsed={config.collapsed}>
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
      <Dialog
        isShown={isShownCreate}
        title='Tạo công việc'
        onCloseComplete={() => setShownCreate(false)}
        hasFooter={false}
      >
        <CreateIssueDialog onCreateSuccess={onCreateSuccess} closeDialog={() => setShownCreate(false)} />
      </Dialog>
    </Pane>
  )
}
