import { Label, Pane, SelectField } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ListIssueComp } from '~/components/project/issue_list'
import { ProjectResponse } from '~/models/project'
import workspaceService from '~/services/workspace.service'

export const IssuePage = () => {
  const params = useParams()

  const [selectedProjectId, setSelectedProjectId] = useState<number>(0)
  const [projects, setProjects] = useState<ProjectResponse[]>([
    {
      id: 0,
      name: 'Tất cả'
    } as ProjectResponse
  ])

  useEffect(() => {
    workspaceService.allProjects({ permalink: params.permalink || '' }).then((data) => {
      if (data.data) {
        setProjects([
          {
            id: 0,
            name: 'Tất cả'
          } as ProjectResponse,
          ...data.data.items
        ])
      }
    })
  }, [])

  return (
    <Pane>
      <Pane>
        <Label htmlFor='project'>Lựa chọn dự án</Label>
        <SelectField onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </SelectField>
      </Pane>
      <ListIssueComp project_id={selectedProjectId} />
      <Pane></Pane>
    </Pane>
  )
}
