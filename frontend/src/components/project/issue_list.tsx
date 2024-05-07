import {
  Pane,
  Table,
  majorScale,
  Tooltip,
  Popover,
  Menu,
  IconButton,
  TagIcon,
  Label,
  Badge,
  Avatar,
  Pagination,
  DuplicateIcon,
  toaster
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useAppSelector } from '~/app/hook'
import {
  BacklogIcon,
  TodoIcon,
  InprogressIcon,
  CompletedIcon,
  CanceledIcon,
  AntennaBars1Icon,
  AntennaBars2Icon,
  AntennaBars3Icon,
  AntennaBars4Icon,
  AntennaBars5Icon
} from '~/assets/icons'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { IssueParams, IssueResponse, IssueStatus } from '~/models/issue'
import { PaginationResponse } from '~/models/utils'
import issueService from '~/services/issue.service'
import { transLabel, getContrastColor, convertTimestamp } from '~/utils'
import { history } from '~/configs/history'
import { useParams } from 'react-router'

interface ListIssueCompProps {
  project_id: number
}

export const ListIssueComp = (props: ListIssueCompProps) => {
  const { project_id } = props
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const params = useParams()

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
    const _params: IssueParams = {
      project_id: project_id,
      workspace_id: currentWorkspace?.id || 0,
      limit: 20,
      page: currentPage
    }
    issueService.getAll(_params).then((data) => {
      setIssues(data?.data)
    })
  }, [project_id, currentPage])

  return (
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
              <Tooltip content={transLabel(issue.status)}>
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
                              {transLabel(status.label)}
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
                      {transLabel(issue.status)}
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
                  mở {convertTimestamp(issue.created_at || '')} bởi {issue.assignor.username} • cập nhật{' '}
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
        {!issues?.items.length && (
          <Table.Row>
            <Table.TextCell textAlign='center'>Không có công việc nào</Table.TextCell>
          </Table.Row>
        )}
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
  )
}
