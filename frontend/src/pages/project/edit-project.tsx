import MDEditor from '@uiw/react-md-editor'
import {
  Button,
  DeleteIcon,
  EditIcon,
  Label,
  Menu,
  Pane,
  Popover,
  SavedIcon,
  TagIcon,
  TextInputField,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import {
  BacklogIcon,
  CalendarOffIcon,
  CalendarStatsIcon,
  CanceledIcon,
  CompletedIcon,
  InprogressIcon,
  PausedIcon,
  PlannedIcon
} from '~/assets/icons'
import { EditMemberComp } from '~/components/edit-member'
import { ImagePickerComp } from '~/components/image_picker/image_picker'
import { ProjectResponse, ProjectUpdatePayload } from '~/models/project'
import projectService from '~/services/project.service'
import { compareDates, reformatDate, transLabel } from '~/utils'

interface EditProjectProps {
  project: ProjectResponse
}

export const EditProjectSideSheet = (props: EditProjectProps) => {
  let { project } = props
  const [projectDetail, setProjectDetail] = useState<ProjectResponse | undefined>(undefined)
  const [enableEdit, setEnableEdit] = useState<boolean>(false)

  const projectStatus = [
    { label: 'backlog', icon: <BacklogIcon /> },
    { label: 'planned', icon: <PlannedIcon /> },
    { label: 'inprogress', icon: <InprogressIcon /> },
    { label: 'completed', icon: <CompletedIcon /> },
    { label: 'canceled', icon: <CanceledIcon /> },
    { label: 'paused', icon: <PausedIcon /> }
  ]

  const initialValues: ProjectUpdatePayload = useMemo(
    () => ({
      name: project.name,
      description: project.description,
      icon: project.icon,
      start_date: new Date(project.start_date).toISOString().substring(0, 10),
      end_date: new Date(project.end_date).toISOString().substring(0, 10),
      status: project.status
    }),
    []
  )

  const payload = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values)
    }
  })

  const handleUpdateProject = () => {
    projectService.updateStatus(project.permalink, payload.values.status).then((data) => {
      setProjectDetail(data.data)
    })
    const pl = {
      ...payload.values,
      start_date: payload.values.start_date + ' 00:00:00',
      end_date: payload.values.end_date + ' 00:00:00'
    }
    projectService.update(project.permalink, pl).then((data) => {
      if (data.status === 200) {
        setProjectDetail(data.data)
        setEnableEdit(false)
        toaster.success(data.message)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  const onChangeDescription = (value?: string) => {
    payload.setFieldValue('description', value)
  }

  const onUpdateMemberSuccess = (data: ProjectResponse) => {
    setProjectDetail(data)
  }

  useEffect(() => {
    projectService.get(project.permalink).then((data) => {
      setProjectDetail(data.data)
    })
  }, [])

  useEffect(() => {
    project = projectDetail || project
  }, [projectDetail])

  return (
    <Pane padding={majorScale(2)}>
      <Pane display='flex' justifyContent='space-between' borderBottom='1px #ccc solid' paddingBottom={majorScale(4)}>
        <Pane display='flex' alignItems='center'>
          <ImagePickerComp
            src={enableEdit ? payload.values.icon : projectDetail?.icon || ''}
            width={majorScale(20)}
            height={majorScale(20)}
            borderRadius={majorScale(2)}
            marginRight={majorScale(2)}
            onChangeImage={(value) => payload.setFieldValue('icon', value)}
          />
          {enableEdit ? (
            <TextInputField
              placeholder='Tên dự án'
              inputHeight={majorScale(6)}
              value={payload.values.name}
              onChange={payload.handleChange}
              name='name'
              onBlur={payload.handleBlur}
              required
            />
          ) : (
            <span
              style={{
                fontSize: majorScale(4)
              }}
            >
              {projectDetail?.name}
            </span>
          )}
        </Pane>
        <Pane>
          {enableEdit ? (
            <Pane display='flex'>
              <Button
                intent='warn'
                iconBefore={<SavedIcon />}
                marginRight={majorScale(2)}
                onClick={handleUpdateProject}
              >
                Lưu
              </Button>
              <Button intent='danger' iconBefore={<DeleteIcon />} onClick={() => setEnableEdit(false)}>
                Hủy bỏ
              </Button>
            </Pane>
          ) : (
            <Button intent='success' iconBefore={<EditIcon />} onClick={() => setEnableEdit(true)}>
              Chỉnh sửa
            </Button>
          )}
        </Pane>
      </Pane>
      <Pane paddingY={majorScale(2)}>
        <Pane marginBottom={majorScale(2)}>
          <Pane display='flex' justifyContent='space-between' marginBottom={enableEdit ? 0 : majorScale(2)}>
            <Label>Trạng thái</Label>
            {enableEdit ? (
              <Popover
                content={
                  <Menu>
                    <Menu.Group>
                      {projectStatus.map((status) => (
                        <Menu.Item
                          key={status.label}
                          textTransform='capitalize'
                          onSelect={() => payload.setFieldValue('status', status.label)}
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
                  iconBefore={
                    projectStatus.find((status) => status.label === payload.values.status)?.icon || <TagIcon />
                  }
                  textTransform='capitalize'
                  marginBottom={majorScale(1)}
                  marginRight={majorScale(1)}
                >
                  {transLabel(payload.values.status)}
                </Button>
              </Popover>
            ) : (
              <span
                style={{
                  textTransform: 'capitalize'
                }}
              >
                {transLabel(projectDetail?.status || '')}
              </span>
            )}
          </Pane>
          <Pane display='flex' justifyContent='space-between' marginBottom={enableEdit ? 0 : majorScale(2)}>
            <Label>Ngày bắt đầu</Label>
            {enableEdit ? (
              <Popover
                content={
                  <TextInputField
                    type='date'
                    onChange={(e: any) => payload.setFieldValue('start_date', e.target.value)}
                    value={payload.values.start_date}
                  />
                }
              >
                <Button
                  type='button'
                  iconBefore={<CalendarStatsIcon />}
                  marginBottom={majorScale(1)}
                  marginRight={majorScale(1)}
                >
                  {`Bắt đầu: ${reformatDate(payload.values.start_date)}`}
                </Button>
              </Popover>
            ) : (
              <span>{reformatDate(projectDetail?.start_date!)}</span>
            )}
          </Pane>
          <Pane display='flex' justifyContent='space-between' marginBottom={enableEdit ? 0 : majorScale(2)}>
            <Label>Ngày kết thúc</Label>
            {enableEdit ? (
              <Popover
                content={
                  <TextInputField
                    type='date'
                    onChange={(e: any) => payload.setFieldValue('end_date', e.target.value)}
                    value={payload.values.end_date}
                    min={
                      compareDates(new Date().toLocaleDateString(), payload.values.start_date)
                        ? payload.values.start_date
                        : new Date().toLocaleDateString()
                    }
                  />
                }
              >
                <Button
                  type='button'
                  iconBefore={<CalendarOffIcon />}
                  marginBottom={majorScale(1)}
                  marginRight={majorScale(1)}
                >
                  {`Kết thúc: ${reformatDate(payload.values.end_date)}`}
                </Button>
              </Popover>
            ) : (
              <span>{reformatDate(projectDetail?.end_date!)}</span>
            )}
          </Pane>
          <Pane display='flex' justifyContent='space-between' marginBottom={enableEdit ? 0 : majorScale(2)}>
            <Label>Trưởng nhóm</Label>
            <span>
              {projectDetail?.leader.first_name
                ? projectDetail?.leader.first_name +
                  ' ' +
                  projectDetail?.leader.last_name +
                  `(${projectDetail?.leader.username})`
                : `(${projectDetail?.leader.username})`}
            </span>
          </Pane>
        </Pane>

        <div data-color-mode='light'>
          <Label>Mô tả</Label>
          <MDEditor
            height={200}
            value={enableEdit ? payload.values.description : projectDetail?.description || ''}
            preview={enableEdit ? 'live' : 'preview'}
            onChange={onChangeDescription}
          />
        </div>
        {projectDetail?.members && (
          <EditMemberComp
            permalink={projectDetail.permalink}
            members={projectDetail.members}
            onUpdateSuccess={onUpdateMemberSuccess}
            marginTop={majorScale(3)}
          />
        )}
      </Pane>
    </Pane>
  )
}
