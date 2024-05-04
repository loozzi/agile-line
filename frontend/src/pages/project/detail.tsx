import { Pane } from 'evergreen-ui'
import { EditProjectSideSheet } from './edit-project'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import projectService from '~/services/project.service'
import { ProjectResponse } from '~/models/project'

const ProjectDetailPage = () => {
  const [project, setProject] = useState<ProjectResponse | undefined>(undefined)
  const params = useParams()

  useEffect(() => {
    projectService.get(params.projectPermalink || '').then((data) => {
      setProject(data.data)
    })
  }, [params])

  return <Pane>{project && <EditProjectSideSheet project={project} />}</Pane>
}

export default ProjectDetailPage
