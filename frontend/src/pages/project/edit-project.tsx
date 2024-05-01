import MDEditor from '@uiw/react-md-editor'
import { Image, Label, Pane, Table, TextInputField, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { ImagePickerComp } from '~/components/image_picker/image_picker'
import { ProjectResponse } from '~/models/project'
import projectService from '~/services/project.service'
import { reformatDate } from '~/utils'

interface EditProjectProps {
  project: ProjectResponse
}

export const EditProjectSideSheet = (props: EditProjectProps) => {
  const { project } = props
  const [projectDetail, setProjectDetail] = useState<ProjectResponse | undefined>(undefined)
  const [enableEdit, setEnableEdit] = useState<boolean>(false)

  useEffect(() => {
    projectService.get(project.permalink).then((data) => {
      setProjectDetail(data.data)
    })
  }, [])
  return (
    <Pane padding={majorScale(2)}>
      <Pane display='flex' alignItems='center' borderBottom='1px #ccc solid' paddingBottom={majorScale(4)}>
        <ImagePickerComp
          src={project.icon}
          width={majorScale(20)}
          height={majorScale(20)}
          borderRadius={majorScale(2)}
          marginRight={majorScale(2)}
        />
        {enableEdit ? (
          <TextInputField placeholder='Tên dự án' />
        ) : (
          <span
            style={{
              fontSize: majorScale(4)
            }}
          >
            {project.name}
          </span>
        )}
      </Pane>
      <Pane paddingY={majorScale(2)}>
        <Pane marginBottom={majorScale(2)}>
          <Pane display='flex' justifyContent='space-between'>
            <Label>Trạng thái</Label>
            <span
              style={{
                textTransform: 'capitalize'
              }}
            >
              {projectDetail?.status}
            </span>
          </Pane>
          <Pane display='flex' justifyContent='space-between'>
            <Label>Ngày bắt đầu</Label>
            <span>{reformatDate(projectDetail?.start_date!)}</span>
          </Pane>
          <Pane display='flex' justifyContent='space-between'>
            <Label>Ngày kết thúc</Label>
            <span>{reformatDate(projectDetail?.end_date!)}</span>
          </Pane>
          <Pane display='flex' justifyContent='space-between'>
            <Label>Leader</Label>
            <span>{`${projectDetail?.leader.first_name} ${projectDetail?.leader.last_name} (${projectDetail?.leader.username})`}</span>
          </Pane>
        </Pane>

        <div data-color-mode='light'>
          <Label>Mô tả</Label>
          <MDEditor height={200} value={projectDetail?.description || ''} preview='preview' />
        </div>
        <Pane marginTop={majorScale(2)}>
          <Label>Danh sách thành viên</Label>
          <Table>
            <Table.Head>
              <Table.TextHeaderCell flexBasis={majorScale(8)} flexShrink={0} flexGrow={0}>
                STT
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>Username</Table.TextHeaderCell>
              <Table.TextHeaderCell>Tên</Table.TextHeaderCell>
              <Table.TextHeaderCell>Vai trò</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
              {projectDetail?.members.map((member, index) => (
                <Table.Row key={member.id}>
                  <Table.TextCell flexBasis={majorScale(8)} flexShrink={0} flexGrow={0}>
                    {index + 1}
                  </Table.TextCell>
                  <Table.TextCell>
                    <Pane display='flex' alignItems='center'>
                      <Image
                        src={member.avatar || ''}
                        height={majorScale(4)}
                        width={majorScale(4)}
                        borderRadius={majorScale(2)}
                        marginRight={majorScale(1)}
                      />
                      {member.username}
                    </Pane>
                  </Table.TextCell>
                  <Table.TextCell>{`${member.first_name} ${member.last_name}`}</Table.TextCell>
                  <Table.TextCell>{member.roles.join(', ')}</Table.TextCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Pane>
      </Pane>
    </Pane>
  )
}
