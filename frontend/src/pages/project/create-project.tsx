import MDEditor from '@uiw/react-md-editor'
import { Button, Label, Menu, Pane, Popover, TagIcon, TextInputField, majorScale } from 'evergreen-ui'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import { useAppSelector } from '~/app/hook'
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
import { selectUser } from '~/hooks/auth/auth.slice'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { Member, WorkspaceGetMembersParams } from '~/models/member'
import { ProjectCreatePayload } from '~/models/project'
import workspaceService from '~/services/workspace.service'

interface CreateProjectDialogProps {
  closeDialog: () => void
}

export const CreateProjectDialog = (props: CreateProjectDialogProps) => {
  const { closeDialog } = props
  const projectStatus = [
    { label: 'backlog', icon: <BacklogIcon /> },
    { label: 'planned', icon: <PlannedIcon /> },
    { label: 'inprogress', icon: <InprogressIcon /> },
    { label: 'completed', icon: <CompletedIcon /> },
    { label: 'canceled', icon: <CanceledIcon /> },
    { label: 'paused', icon: <PausedIcon /> }
  ]

  const [workspaceMembers, setWorkspaceMembers] = useState<Member[]>([])
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  const params = useParams()

  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const currentUser = useAppSelector(selectUser)

  const initialValues: ProjectCreatePayload = useMemo(
    () => ({
      workspace_id: currentWorkspace?.id!,
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
      leader_id: currentUser?.id!,
      members_id: [currentUser?.id!]
    }),
    []
  )

  const payloadFormik = useFormik({
    initialValues: initialValues,
    validateOnBlur: false,
    validateOnChange: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Tên dự án không được để trống')
    }),
    onSubmit: (values) => {}
  })

  const onChangeDescription = (value?: string) => {
    payloadFormik.setFieldValue('description', value)
  }

  const setSelectedMember = (member_id: number) => {}

  const onChangeDate = (date: string, type: 'start' | 'end') => {
    const [year, month, day] = date.split('-')
    payloadFormik.setFieldValue(`${type}_day`, parseInt(day))
    payloadFormik.setFieldValue(`${type}_month`, parseInt(month))
    payloadFormik.setFieldValue(`${type}_year`, parseInt(year))
  }

  const compareDates = (date1: string, date2: string) => {
    const dateObj1 = new Date(date1)
    const dateObj2 = new Date(date2)

    const time1 = dateObj1.getTime()
    const time2 = dateObj2.getTime()

    if (time1 < time2) {
      return -1 // date1 is earlier
    } else if (time1 > time2) {
      return 1 // date1 is later
    } else {
      return 0 // dates are equal
    }
  }

  useEffect(() => {
    onChangeDate(startDate, 'start')
    onChangeDate(endDate, 'end')

    if (compareDates(currentDate, startDate) === -1 && compareDates(endDate, startDate) === -1) {
      setEndDate(startDate)
    }
  }, [startDate, endDate])

  useEffect(() => {
    const _params: WorkspaceGetMembersParams = {
      permalink: params.permalink || '',
      member_kw: ''
    }
    workspaceService.getMembers(_params).then((data) => {})
    const today = new Date()
    let year = today.getFullYear()
    let month = String(today.getMonth() + 1).padStart(2, '0')
    let day = String(today.getDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    setStartDate(formattedDate)
    setEndDate(formattedDate)
    setCurrentDate(formattedDate)
  }, [])

  return (
    <form onSubmit={payloadFormik.handleSubmit}>
      <Pane>
        <TextInputField
          label='Tên dự án'
          name='name'
          placeholder='Tên dự án'
          inputHeight={majorScale(6)}
          value={payloadFormik.values.name}
          onChange={payloadFormik.handleChange}
          onBlur={payloadFormik.handleBlur}
          validationMessage={payloadFormik.errors.name}
          isInvalid={!!payloadFormik.errors.name}
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
            type='button'
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
          <Button type='button' iconBefore={<LoaderIcon />} marginBottom={majorScale(1)} marginRight={majorScale(1)}>
            Leader
          </Button>
        </Popover>
        <Button type='button' iconBefore={<UsersGroupIcon />} marginBottom={majorScale(1)} marginRight={majorScale(1)}>
          Thành viên
        </Button>
        <Popover
          content={<TextInputField type='date' onChange={(e: any) => setStartDate(e.target.value)} value={startDate} />}
        >
          <Button
            type='button'
            iconBefore={<CalendarStatsIcon />}
            marginBottom={majorScale(1)}
            marginRight={majorScale(1)}
          >
            {`${payloadFormik.values.start_day}/${payloadFormik.values.start_month}/${payloadFormik.values.start_year}`}
          </Button>
        </Popover>
        <Popover
          content={
            <TextInputField
              type='date'
              onChange={(e: any) => setEndDate(e.target.value)}
              value={endDate}
              min={compareDates(currentDate, startDate) ? startDate : currentDate}
            />
          }
        >
          <Button
            type='button'
            iconBefore={<CalendarOffIcon />}
            marginBottom={majorScale(1)}
            marginRight={majorScale(1)}
          >
            {`${payloadFormik.values.end_day}/${payloadFormik.values.end_month}/${payloadFormik.values.end_year}`}
          </Button>
        </Popover>
      </Pane>
      <Pane marginY={majorScale(2)} display='flex' justifyContent='flex-end'>
        <Button type='button' marginRight={majorScale(2)} onClick={closeDialog}>
          Đóng
        </Button>
        <Button type='submit' appearance='primary'>
          Tạo dự án
        </Button>
      </Pane>
    </form>
  )
}
