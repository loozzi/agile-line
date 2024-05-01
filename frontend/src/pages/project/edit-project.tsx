import { Pane, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { ImagePickerComp } from '~/components/image_picker/image_picker'
import { ProjectResponse } from '~/models/project'
import projectService from '~/services/project.service'

interface EditProjectProps {
  project: ProjectResponse
}

export const EditProjectSideSheet = (props: EditProjectProps) => {
  const { project } = props
  const [projectDetail, setProjectDetail] = useState<ProjectResponse | undefined>(undefined)

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
        <span
          style={{
            fontSize: majorScale(4)
          }}
        >
          {project.name}
        </span>
      </Pane>
      <Pane paddingY={majorScale(2)}>
        <span>Thành viên</span>
        <Pane>{projectDetail?.members.map((member) => <Pane key={member.id}>{member.first_name}</Pane>)}</Pane>
      </Pane>
    </Pane>
  )
}
