import {
  Avatar,
  Badge,
  Button,
  ChevronDownIcon,
  DuplicateIcon,
  IconButton,
  Label,
  Menu,
  Pane,
  PlusIcon,
  Popover,
  SelectMenu,
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
import { history } from '~/configs/history'
import { IssuePriority, IssueResponse, IssueStatus } from '~/models/issue'
import { LabelResponse } from '~/models/label'
import { ProjectResponse } from '~/models/project'
import { User } from '~/models/user'
import issueService from '~/services/issue.service'
import { getContrastColor, transLabel } from '~/utils'
import { PopupSearchMember } from '../popup_search_member'

interface IssuePropertyCompProps {
  issue: IssueResponse
  project: ProjectResponse
  labels: LabelResponse[]
  onUpdateSuccess: (issue: IssueResponse) => void
}

export const IssuePropertyComp = (props: IssuePropertyCompProps) => {
  const { issue, labels, project, onUpdateSuccess } = props
  const params = useParams()

  const [assignee, setAssignee] = useState<User>(issue.assignee)
  const [selectedLabels, setSelectedLabels] = useState<LabelResponse[]>(issue.label)

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

  const onChooseMember = (member: User) => {
    setAssignee(member)
    issueService.updateAssignee(issue.permalink, member.id).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  const handleUpdateStatus = (status: IssueStatus) => {
    issueService.updateStatus(issue.permalink, status).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
        onUpdateSuccess(data.data!)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  const handleUpdatePriority = (priority: IssuePriority) => {
    issueService.updatePriority(issue.permalink, priority).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
        onUpdateSuccess(data.data!)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  useEffect(() => {
    issueService
      .updateLabel(
        issue.permalink,
        selectedLabels.map((label) => label.id)
      )
      .then((data) => {
        if (data.status === 200) {
          onUpdateSuccess(data.data!)
        } else {
          toaster.danger(data.message)
        }
      })
  }, [selectedLabels])

  return (
    <Pane>
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
        <Label display='block'>Người phụ trách</Label>
        <Popover content={<PopupSearchMember members={project?.members || []} onChooseMember={onChooseMember} />}>
          <Tooltip content={`${assignee.first_name} ${assignee.last_name}`}>
            <Button iconBefore={<Avatar src={assignee.avatar || ''} />} iconAfter={<ChevronDownIcon />}>
              {assignee.username}
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
                  <Menu.Item
                    key={status.label}
                    textTransform='capitalize'
                    onSelect={() => {
                      handleUpdateStatus(status.label as IssueStatus)
                    }}
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
          <Button
            type='button'
            iconBefore={issueStatus.find((status) => status.label === issue?.status)?.icon}
            textTransform='capitalize'
            iconAfter={<ChevronDownIcon />}
          >
            {transLabel(issue?.status)}
          </Button>
        </Popover>
      </Pane>
      <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
        <Label display='block'>Độ ưu tiên</Label>
        <Popover
          content={
            <Menu>
              <Menu.Group>
                {issuePriority.map((priority) => (
                  <Menu.Item
                    key={priority.label}
                    textTransform='capitalize'
                    onSelect={() => {
                      handleUpdatePriority(priority.label as IssuePriority)
                    }}
                    icon={priority.icon}
                  >
                    {transLabel(priority.label)}
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
            {transLabel(issue?.priority)}
          </Button>
        </Popover>
      </Pane>
      <Pane marginTop={majorScale(4)}>
        <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
          <Label display='block'>Nhãn</Label>
          <Pane maxWidth={majorScale(24)}>
            {selectedLabels.map((label) => (
              <Tooltip content={label.description} key={label.id}>
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
            <SelectMenu
              isMultiSelect
              options={labels.map((label) => ({
                label: (
                  <Badge
                    key={label.id}
                    color={getContrastColor(label.color) as any}
                    backgroundColor={label.color}
                    marginRight={majorScale(1)}
                  >
                    {label.title}
                  </Badge>
                ) as any,
                value: label.id.toString()
              }))}
              selected={selectedLabels.map((label) => label.id.toString())}
              onSelect={(item) => {
                const selectedLabel = labels.filter((label) => label.id === parseInt(item.value as string))[0]
                const selected = [...selectedLabels, selectedLabel]
                setSelectedLabels(selected)
              }}
              onDeselect={(item) => {
                const deselectedItemIndex = selectedLabels
                  .map((label) => label.id.toString())
                  .indexOf(item.value as string)
                const selectedItems = selectedLabels.filter((_item, i) => i !== deselectedItemIndex)
                setSelectedLabels(selectedItems)
              }}
            >
              <Tooltip content='Thêm'>
                <IconButton appearance='minimal' icon={PlusIcon} />
              </Tooltip>
            </SelectMenu>
          </Pane>
        </Pane>
      </Pane>
      <Pane marginTop={majorScale(4)}>
        <Pane display='flex' justifyContent='space-between' marginBottom={majorScale(1)} alignItems='center'>
          <Label display='block'>Dự án</Label>
          <Button
            iconBefore={<Avatar src={issue?.project.icon} marginRight={majorScale(1)} />}
            appearance='minimal'
            onClick={() => history.push(`/${params.permalink}/projects/${project.permalink}`)}
          >
            {issue?.project.name}
          </Button>
        </Pane>
      </Pane>
    </Pane>
  )
}
