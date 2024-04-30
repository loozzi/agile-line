import MDEditor from '@uiw/react-md-editor'
import {
  Button,
  IconButton,
  Image,
  Label,
  LinkIcon,
  Menu,
  Pane,
  Popover,
  SelectField,
  TagIcon,
  TextInputField,
  UserIcon,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
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
  DuplicateIcon,
  InprogressIcon,
  TodoIcon
} from '~/assets/icons'
import { PopupSearchMember } from '~/components/popup_search_member'
import { PopupSelectedLabels } from '~/components/popup_selected_label'
import { selectUser } from '~/hooks/auth/auth.slice'
import { IssueCreatePayload } from '~/models/issue'
import { LabelResponse } from '~/models/label'
import { ProjectResponse } from '~/models/project'
import { User } from '~/models/user'
import { WorkspaceParams } from '~/models/workspace'
import labelService from '~/services/label.service'
import projectService from '~/services/project.service'
import workspaceService from '~/services/workspace.service'

interface CreateIssueDialogProps {
  closeDialog: () => void
  onCreateSuccess: (item: any) => void
}

export const CreateIssueDialog = (props: CreateIssueDialogProps) => {
  const { closeDialog } = props
  const params = useParams()
  const currentUser = useAppSelector(selectUser)

  const [assignee, setAssignee] = useState<User | undefined>(undefined)
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [project, setProject] = useState<ProjectResponse | undefined>(undefined)
  const [labels, setLabels] = useState<LabelResponse[]>([])

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

  const inititalValues: IssueCreatePayload = useMemo(
    () => ({
      project_id: 0,
      name: '',
      description: '',
      status: 'backlog',
      label: '[]',
      priority: 'nopriority',
      assignee_id: undefined,
      assignor_id: undefined,
      testor: undefined,
      milestone_id: undefined,
      resources: undefined
    }),
    []
  )

  const payload = useFormik({
    initialValues: inititalValues,
    onSubmit: (values) => {
      console.log(values)
    }
  })

  const onChangeDescription = (value?: string) => {
    payload.setFieldValue('description', value)
  }

  const onChooseProject = (id: number) => {
    const prj = projects.find((project) => project.id === id) || undefined
    if (prj) {
      projectService.get(prj.permalink).then((data) => {
        setProject(data.data)
      })
    }
  }

  const onChooseMember = (member: User) => {
    setAssignee(member)
    payload.setFieldValue('assignee_id', member.id)
  }

  const onChooseLabels = (_labels: LabelResponse[]) => {
    payload.setFieldValue('label', `[${_labels.join(',')}]`)
  }

  useEffect(() => {
    const _params: WorkspaceParams = {
      permalink: params.permalink || '',
      limit: 100
    }
    workspaceService.allProjects(_params).then((data) => {
      setProjects(data.data?.items || [])
    })

    labelService.getAll(_params).then((data) => {
      setLabels(data.data || [])
    })
  }, [])

  useEffect(() => {
    if (currentUser) {
      payload.setFieldValue('assignor_id', currentUser.id)
    }
  }, [currentUser])

  return (
    <form onSubmit={payload.handleSubmit}>
      <Pane>
        <SelectField
          label='Chọn dự án'
          description='Vui lòng chọn dự án trước khi tạo issue'
          onChange={(e) => onChooseProject(parseInt(e.target.value))}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </SelectField>
        <TextInputField
          label='Tên issue'
          placeholder='Nhập tên issue'
          required
          name='name'
          inputHeight={majorScale(6)}
          value={payload.values.name}
          onChange={payload.handleChange}
          onBlur={payload.handleBlur}
        />
        <div data-color-mode='light'>
          <Label>Thêm mô tả</Label>
          <MDEditor height={200} value={payload.values.description} onChange={onChangeDescription} />
        </div>
      </Pane>
      <Pane display='flex' marginTop={majorScale(2)}>
        <Popover
          content={
            <Menu>
              <Menu.Group>
                {issueStatus.map((status) => (
                  <Menu.Item
                    key={status.label}
                    textTransform='capitalize'
                    onSelect={() => payload.setFieldValue('status', status.label)}
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
          <Button
            type='button'
            iconBefore={issueStatus.find((status) => status.label === payload.values.status)?.icon || <TagIcon />}
            textTransform='capitalize'
            marginBottom={majorScale(1)}
            marginRight={majorScale(1)}
          >
            {payload.values.status}
          </Button>
        </Popover>
        <Popover
          content={
            <Menu>
              <Menu.Group>
                {issuePriority.map((priority) => (
                  <Menu.Item
                    key={priority.label}
                    textTransform='capitalize'
                    onSelect={() => payload.setFieldValue('priority', priority.label)}
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
            iconBefore={
              issuePriority.find((priority) => priority.label === payload.values.priority)?.icon || <TagIcon />
            }
            textTransform='capitalize'
            marginBottom={majorScale(1)}
            marginRight={majorScale(1)}
          >
            {payload.values.priority}
          </Button>
        </Popover>
        <Popover content={<PopupSearchMember members={project?.members || []} onChooseMember={onChooseMember} />}>
          <Button
            type='button'
            iconBefore={
              !!assignee ? (
                <Image
                  src={assignee.avatar || ''}
                  marginRight={majorScale(1)}
                  width={majorScale(3)}
                  height={majorScale(3)}
                  borderRadius={majorScale(2)}
                />
              ) : (
                <UserIcon />
              )
            }
            marginBottom={majorScale(1)}
            marginRight={majorScale(1)}
          >
            {!!assignee ? `${assignee.username}` : 'Assign to...'}
          </Button>
        </Popover>
        <PopupSelectedLabels labels={labels} onChooseLabels={onChooseLabels}>
          <Button iconBefore={<TagIcon />} type='button'>
            {payload.values.label.length > 2
              ? `Đã chọn ${payload.values.label.toString().split(',').length}`
              : 'Chọn nhãn'}
          </Button>
        </PopupSelectedLabels>
      </Pane>
      <Pane display='flex' justifyContent='space-between' marginY={majorScale(2)}>
        <Pane>
          <IconButton
            icon={<LinkIcon />}
            type='button'
            onClick={() => toaster.warning('Tính năng đang được phát triển')}
          />
        </Pane>
        <Pane display='flex'>
          <Button type='button' marginRight={majorScale(2)} onClick={closeDialog}>
            Đóng
          </Button>
          <Button type='submit' appearance='primary'>
            Tạo issue
          </Button>
        </Pane>
      </Pane>
    </form>
  )
}
