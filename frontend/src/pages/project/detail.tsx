import { Image, Pane, Tab, Tablist, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ListIssueComp } from '~/components/project/issue_list'
import { ProjectResponse } from '~/models/project'
import projectService from '~/services/project.service'

const ProjectDetailPage = () => {
  const [project, setProject] = useState<ProjectResponse | undefined>(undefined)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tabs] = useState(['Công việc', 'Thành viên', 'Thông tin'])

  const params = useParams()

  useEffect(() => {
    projectService.get(params.projectPermalink || '').then((data) => {
      setProject(data.data)
    })
  }, [params])

  return (
    <Pane>
      <Pane display='flex' alignItems='center' paddingBottom={majorScale(2)} borderBottom='1px solid #ccc'>
        <Image
          src={project?.icon}
          width={majorScale(10)}
          height={majorScale(10)}
          borderRadius={majorScale(1)}
          marginRight={majorScale(1)}
        />
        <span
          style={{
            fontSize: majorScale(4)
          }}
        >
          {project?.name}
        </span>
      </Pane>
      <Tablist marginTop={majorScale(2)} marginBottom={16} flexBasis={240} marginRight={24}>
        {tabs.map((tab, index) => (
          <Tab
            aria-controls={`panel-${tab}`}
            isSelected={index === selectedIndex}
            key={tab}
            onSelect={() => setSelectedIndex(index)}
          >
            {tab}
          </Tab>
        ))}
      </Tablist>
      <Pane padding={16} background='tint1' flex='1' borderRadius={majorScale(1)}>
        {tabs.map((tab, index) => (
          <Pane
            aria-labelledby={tab}
            aria-hidden={index !== selectedIndex}
            display={index === selectedIndex ? 'block' : 'none'}
            key={tab}
            role='tabpanel'
          >
            {tab === 'Công việc' && project && <ListIssueComp project_id={project.id} />}
            {tab === 'Thành viên' && <p>Thành viên</p>}
            {tab === 'Thông tin' && <p>Thông tin</p>}
          </Pane>
        ))}
      </Pane>
    </Pane>
  )
}

export default ProjectDetailPage
