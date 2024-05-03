import MDEditor from '@uiw/react-md-editor'
import {
  Avatar,
  Badge,
  Button,
  ChevronDownIcon,
  DuplicateIcon,
  IconButton,
  Label,
  LinkIcon,
  Menu,
  Pane,
  PlusIcon,
  Popover,
  TextInputField,
  Tooltip,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
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
import { PopupSearchMember } from '~/components/popup_search_member'
import { IssueResponse } from '~/models/issue'
import { LabelResponse } from '~/models/label'
import { ProjectResponse } from '~/models/project'
import { User } from '~/models/user'
import { WorkspaceParams } from '~/models/workspace'
import issueService from '~/services/issue.service'
import labelService from '~/services/label.service'
import projectService from '~/services/project.service'
import { getContrastColor } from '~/utils'

export const IssueDetailPage = () => {
  const params = useParams()

  const [issue, setIssue] = useState<IssueResponse | undefined>(undefined)
  const [project, setProject] = useState<ProjectResponse | undefined>(undefined)
  const [labels, setLabels] = useState<LabelResponse[]>([])
  const [assignee, setAssignee] = useState<User | undefined>(undefined)

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toaster.success('Đã sao chép liên kết')
  }

  const onChooseMember = (member: User) => {
    setAssignee(member)
    // payload.setFieldValue('assignee_id', member.id)
  }

  useEffect(() => {
    issueService.getDetail(params.issuePermalink || '').then((data) => {
      setIssue(data.data)
    })
  }, [])

  useEffect(() => {
    const _params: WorkspaceParams = {
      permalink: params.permalink || '',
      limit: 100
    }

    projectService.get(issue?.project.permalink || '').then((data) => {
      setProject(data.data)
    })

    labelService.getAll(_params).then((data) => {
      setLabels(data.data || [])
    })
  }, [issue])

  return (
    <Pane display='flex'>
      <Pane flex={1} marginRight={majorScale(2)}>
        <TextInputField label='Tên' value={issue?.name} inputHeight={majorScale(6)} disabled={true} />
        <div data-color-mode='light'>
          <Label>Mô tả</Label>
          <MDEditor height={200} value={issue?.description || ''} onChange={() => {}} preview='preview' />
        </div>
      </Pane>
      <Pane width={majorScale(32)}>
        <Pane display='flex' justifyContent='space-between'>
          <span>Chi tiết</span>
          <Pane>
            <IconButton appearance='minimal' icon={<LinkIcon />} onClick={handleCopyLink} />
          </Pane>
        </Pane>
        <Pane marginTop={majorScale(4)}>
          <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
            <Label display='block'>Tạo bởi</Label>
            <Pane display='flex' alignItems='center'>
              <Avatar src={issue?.assignor.avatar || ''} marginRight={majorScale(1)} />
              <Tooltip content={`${issue?.assignor.first_name} ${issue?.assignor.last_name}`}>
                <span>{issue?.assignor.username}</span>
              </Tooltip>
            </Pane>
          </Pane>
          <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
            <Label display='block'>Giao cho</Label>
            <Popover content={<PopupSearchMember members={project?.members || []} onChooseMember={onChooseMember} />}>
              <Tooltip content={`${issue?.assignee.first_name} ${issue?.assignee.last_name}`}>
                <Button iconBefore={<Avatar src={issue?.assignee.avatar || ''} />} iconAfter={<ChevronDownIcon />}>
                  {issue?.assignee.username}
                </Button>
              </Tooltip>
            </Popover>
          </Pane>
          <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
            <Label display='block'>Trạng thái</Label>
            <Popover
              content={
                <Menu>
                  <Menu.Group>
                    {issueStatus.map((status) => (
                      <Menu.Item key={status.label} textTransform='capitalize' onSelect={() => {}} icon={status.icon}>
                        {status.label}
                      </Menu.Item>
                    ))}
                  </Menu.Group>
                  <Menu.Divider />
                </Menu>
              }
            >
              <Button
                type='button'
                iconBefore={issueStatus.find((status) => status.label === issue?.status)?.icon}
                textTransform='capitalize'
                iconAfter={<ChevronDownIcon />}
              >
                {issue?.status}
              </Button>
            </Popover>
          </Pane>
          <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
            <Label display='block'>Mức độ</Label>
            <Popover content={<PopupSearchMember members={project?.members || []} onChooseMember={onChooseMember} />}>
              <Popover
                content={
                  <Menu>
                    <Menu.Group>
                      {issuePriority.map((priority) => (
                        <Menu.Item
                          key={priority.label}
                          textTransform='capitalize'
                          onSelect={() => {}}
                          icon={priority.icon}
                        >
                          {priority.label}
                        </Menu.Item>
                      ))}
                    </Menu.Group>
                    <Menu.Divider />
                  </Menu>
                }
              >
                <Button
                  type='button'
                  iconBefore={issuePriority.find((priority) => priority.label === issue?.priority)?.icon}
                  textTransform='capitalize'
                  iconAfter={<ChevronDownIcon />}
                >
                  {issue?.priority}
                </Button>
              </Popover>
            </Popover>
          </Pane>
          <Pane marginTop={majorScale(4)}>
            <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
              <Label display='block'>Nhãn</Label>
              <Pane maxWidth={majorScale(24)}>
                {issue?.label.map((label) => (
                  <Tooltip content={label.description}>
                    <Badge
                      key={label.id}
                      color={getContrastColor(label.color) as any}
                      backgroundColor={label.color}
                      marginRight={majorScale(1)}
                    >
                      {label.title}
                    </Badge>
                  </Tooltip>
                ))}
                <IconButton appearance='minimal' icon={PlusIcon} />
              </Pane>
            </Pane>
          </Pane>
          <Pane marginTop={majorScale(4)}>
            <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
              <Label display='block'>Dự án</Label>
              <Button
                iconBefore={<Avatar src={issue?.project.icon} marginRight={majorScale(1)} />}
                appearance='minimal'
              >
                {issue?.project.name}
              </Button>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  )
}
