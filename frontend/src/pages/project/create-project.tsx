import MDEditor from '@uiw/react-md-editor'
import { Button, Label, Menu, Pane, Popover, TagIcon, TextInputField, majorScale } from 'evergreen-ui'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import {
  BacklogIcon,
  CalendarOffIcon,
  CalendarStatsIcon,
  CanceledIcon,
  CompletedIcon,
  InprogressIcon,
  LoaderIcon,
  PausedIcon,
  PlannedIcon,
  UsersGroupIcon
} from '~/assets/icons'
import { PopupSearchMember } from '~/components/popup_search_member'
import { Member, WorkspaceGetMembersParams } from '~/models/member'
import { ProjectCreatePayload } from '~/models/project'
import workspaceService from '~/services/workspace.service'

export const CreateProjectDialog = () => {
  const projectStatus = [
    { label: 'backlog', icon: <BacklogIcon /> },
    { label: 'planned', icon: <PlannedIcon /> },
    { label: 'inprogress', icon: <InprogressIcon /> },
    { label: 'completed', icon: <CompletedIcon /> },
    { label: 'canceled', icon: <CanceledIcon /> },
    { label: 'paused', icon: <PausedIcon /> }
  ]

  const [workspaceMembers, setWorkspaceMembers] = useState<Member[]>([])
  const params = useParams()

  const initialValues: ProjectCreatePayload = useMemo(
    () => ({
      workspace_id: 0,
      name: '',
      description: '',
      icon: '',
      status: 'backlog',
      start_day: 0,
      start_month: 0,
      start_year: 0,
      end_day: 0,
      end_month: 0,
      end_year: 0,
      leader_id: 0,
      members_id: []
    }),
    []
  )

  const payloadFormik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values)
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required')
    })
  })

  const onChangeDescription = (value?: string) => {
    payloadFormik.setFieldValue('description', value)
  }

  const setSelectedMember = (member_id: number) => {}

  useEffect(() => {
    const _params: WorkspaceGetMembersParams = {
      permalink: params.permalink || '',
      member_kw: ''
    }
    workspaceService.getMembers(_params).then((data) => {})
  }, [])

  return (
    <form onSubmit={payloadFormik.handleSubmit}>
      <Pane>
        <TextInputField
          //   label='Name'
          name='name'
          placeholder='Tên dự án'
          inputHeight={majorScale(6)}
          value={payloadFormik.values.name}
          onChange={payloadFormik.handleChange}
          onBlur={payloadFormik.handleBlur}
          validationMessage={payloadFormik.touched.name && payloadFormik.errors.name}
        />
        <div data-color-mode='light'>
          <Label>Thêm mô tả</Label>
          <MDEditor height={200} value={payloadFormik.values.description} onChange={onChangeDescription} />
        </div>
      </Pane>
      <Pane marginTop={majorScale(2)}>
        <Popover
          content={
            <Menu>
              <Menu.Group>
                {projectStatus.map((status) => (
                  <Menu.Item
                    key={status.label}
                    textTransform='capitalize'
                    onSelect={() => payloadFormik.setFieldValue('status', status.label)}
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
            iconBefore={
              projectStatus.find((status) => status.label === payloadFormik.values.status)?.icon || <TagIcon />
            }
            textTransform='capitalize'
            marginBottom={majorScale(1)}
            marginRight={majorScale(1)}
          >
            {payloadFormik.values.status}
          </Button>
        </Popover>
        <Popover
          content={<PopupSearchMember permalink={params.permalink || ''} setSelectedMember={setSelectedMember} />}
        >
          <Button iconBefore={<LoaderIcon />} marginBottom={majorScale(1)} marginRight={majorScale(1)}>
            Leader
          </Button>
        </Popover>
        <Button iconBefore={<UsersGroupIcon />} marginBottom={majorScale(1)} marginRight={majorScale(1)}>
          Thành viên
        </Button>
        <Button iconBefore={<CalendarStatsIcon />} marginBottom={majorScale(1)} marginRight={majorScale(1)}>
          Ngày bắt đầu
        </Button>
        <Button iconBefore={<CalendarOffIcon />} marginBottom={majorScale(1)} marginRight={majorScale(1)}>
          Ngày kết thúc
        </Button>
      </Pane>
    </form>
  )
}
