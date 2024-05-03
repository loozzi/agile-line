import {
  Avatar,
  Badge,
  DuplicateIcon,
  IconButton,
  Label,
  Menu,
  Pagination,
  Pane,
  Popover,
  SelectField,
  Table,
  TagIcon,
  Tooltip,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useAppSelector } from '~/app/hook'
import {
  AntennaBars1Icon,
  AntennaBars2Icon,
  AntennaBars3Icon,
  AntennaBars4Icon,
  AntennaBars5Icon,
  BacklogIcon,
  CanceledIcon,
  CompletedIcon,
  InprogressIcon,
  TodoIcon
} from '~/assets/icons'
import { history } from '~/configs/history'
import { selectUser } from '~/hooks/auth/auth.slice'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { IssueParams, IssueResponse, IssueStatus } from '~/models/issue'
import { ProjectResponse } from '~/models/project'
import { PaginationResponse } from '~/models/utils'
import issueService from '~/services/issue.service'
import workspaceService from '~/services/workspace.service'
import { convertTimestamp, getContrastColor } from '~/utils'

export const IssuePage = () => {
  const params = useParams()
  const currentUser = useAppSelector(selectUser)
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const [selectedProjectId, setSelectedProjectId] = useState<number>(0)
  const [projects, setProjects] = useState<ProjectResponse[]>([
    {
      id: 0,
      name: 'Tất cả'
    } as ProjectResponse
  ])

  const [issues, setIssues] = useState<PaginationResponse<IssueResponse> | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const issueStatus = [
    { label: 'backlog', icon: <BacklogIcon /> },
    { label: 'todo', icon: <TodoIcon /> },
    { label: 'inprogress', icon: <InprogressIcon /> },
    { label: 'done', icon: <CompletedIcon /> },
    { label: 'cancelled', icon: <CanceledIcon /> },
    { label: 'duplicate', icon: <DuplicateIcon /> }
  ]

  const issuePriority = [
    { label: 'nopriority', icon: <AntennaBars1Icon /> },
    { label: 'low', icon: <AntennaBars2Icon /> },
    { label: 'medium', icon: <AntennaBars3Icon /> },
    { label: 'high', icon: <AntennaBars4Icon /> },
    { label: 'urgent', icon: <AntennaBars5Icon /> }
  ]

  const handleUpdateStatus = (permalink: string, status: IssueStatus) => {
    issueService.updateStatus(permalink, status).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
        setIssues((prev) => {
          if (prev) {
            return {
              ...prev,
              items: prev.items.map((issue) => {
                if (issue.permalink === permalink) {
                  return {
                    ...issue,
                    status: status
                  }
                }
                return issue
              })
            }
          }
          return prev
        })
      } else {
        toaster.danger(data.message)
      }
    })
  }

  useEffect(() => {
    if (currentUser) {
      if (currentWorkspace) {
        const _params: IssueParams = {
          workspace_id: currentWorkspace.id,
          project_id: selectedProjectId,
          limit: 20,
          page: currentPage
        }
        issueService.getAll(_params).then((data) => {
          setIssues(data.data)
        })
      }
    }
  }, [selectedProjectId, currentWorkspace, currentPage])

  useEffect(() => {
    workspaceService.allProjects({ permalink: params.permalink || '' }).then((data) => {
      if (data.data) {
        setProjects([
          {
            id: 0,
            name: 'Tất cả'
          } as ProjectResponse,
          ...data.data.items
        ])
      }
    })
  }, [])

  return (
    <Pane>
      <Pane>
        <Label htmlFor='project'>Lựa chọn dự án</Label>
        <SelectField onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </SelectField>
      </Pane>
      <Pane>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell flexBasis={majorScale(8)} flexShrink={0} flexGrow={0}></Table.TextHeaderCell>
            <Table.TextHeaderCell flexBasis={majorScale(64)} flexShrink={0} flexGrow={0}>
              Tên công việc
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>Dự án</Table.TextHeaderCell>
            <Table.TextHeaderCell>Độ ưu tiên</Table.TextHeaderCell>
            <Table.TextHeaderCell>Người phụ trách</Table.TextHeaderCell>
          </Table.Head>
          {issues?.items.map((issue) => (
            <Table.Row>
              <Table.TextHeaderCell flexBasis={majorScale(4)} flexShrink={0} flexGrow={0}>
                <Tooltip content='Trạng thái'>
                  <Pane>
                    <Popover
                      content={
                        <Menu>
                          <Menu.Group>
                            {issueStatus.map((status) => (
                              <Menu.Item
                                key={status.label}
                                textTransform='capitalize'
                                onSelect={() => handleUpdateStatus(issue.permalink, status.label as IssueStatus)}
                                icon={status.icon}
                              >
                                {status.label}
                              </Menu.Item>
                            ))}
                          </Menu.Group>
                          <Menu.Divider />
                        </Menu>
                      }
                    >
                      <IconButton
                        type='button'
                        appearance='minimal'
                        icon={issueStatus.find((status) => status.label === issue.status)?.icon || <TagIcon />}
                        textTransform='capitalize'
                        marginBottom={majorScale(1)}
                        marginRight={majorScale(1)}
                      >
                        {issue.status}
                      </IconButton>
                    </Popover>
                  </Pane>
                </Tooltip>
              </Table.TextHeaderCell>
              <Table.TextCell
                flexBasis={majorScale(64)}
                flexShrink={0}
                flexGrow={0}
                cursor='pointer'
                onClick={() => history.push(`/${params.permalink}/issues/${issue.permalink}`)}
              >
                <Pane display='flex' flexDirection='column'>
                  <Pane display='flex'>
                    <Label display='block' marginRight={majorScale(2)} cursor='pointer'>
                      {issue.name}
                    </Label>
                    <Pane>
                      {issue.label.map((label) => (
                        <Badge
                          color={getContrastColor(label.color) as any}
                          backgroundColor={label.color}
                          marginRight={majorScale(1)}
                        >
                          {label.title}
                        </Badge>
                      ))}
                    </Pane>
                  </Pane>
                  <span>
                    #{issue.id} mở {convertTimestamp(issue.created_at || '')} bởi {issue.assignor.username} • cập nhật{' '}
                    {convertTimestamp(issue.updated_at || '')}
                  </span>
                </Pane>
              </Table.TextCell>
              <Table.TextCell
                cursor='pointer'
                onClick={() => history.push(`/${params.permalink}/projects/${issue.project.permalink}`)}
              >
                <Pane display='flex' alignItems='center'>
                  <Avatar src={issue.project.icon || ''} marginRight={majorScale(1)} />
                  {issue.project.name}
                </Pane>
              </Table.TextCell>
              <Table.TextCell>
                <Tooltip content={<span style={{ textTransform: 'capitalize', color: '#fff' }}>{issue.priority}</span>}>
                  <Pane>{issuePriority.find((priority) => priority.label === issue.priority)?.icon}</Pane>
                </Tooltip>
              </Table.TextCell>
              <Table.TextCell>
                <Pane display='flex' alignItems='center'>
                  <Avatar src={issue.assignee.avatar || ''} marginRight={majorScale(1)} />
                  {issue.assignee.username}
                </Pane>
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table>
        <Pagination
          marginTop={majorScale(2)}
          display='flex'
          justifyContent='center'
          totalPages={issues?.pagination.total_page || 0}
          page={issues?.pagination.current_page || 0}
          onPageChange={(page) => setCurrentPage(page)}
          onNextPage={() => setCurrentPage(currentPage + 1)}
          onPreviousPage={() => setCurrentPage(currentPage - 1)}
        />
      </Pane>
      <Pane></Pane>
    </Pane>
  )
}
