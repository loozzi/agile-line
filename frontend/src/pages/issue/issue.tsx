import { Button, Label, Pane, SearchInput, SelectField, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ListIssueComp } from '~/components/project/issue_list'
import { IssueStatus } from '~/models/issue'
import { ProjectResponse } from '~/models/project'
import workspaceService from '~/services/workspace.service'
import { transLabel } from '~/utils'

export const IssuePage = () => {
  const params = useParams()

  const [selectedProjectId, setSelectedProjectId] = useState<number>(0)
  const [projects, setProjects] = useState<ProjectResponse[]>([
    {
      id: 0,
      name: 'Tất cả'
    } as ProjectResponse
  ])

  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'backlog', value: 'backlog' },
    { label: 'todo', value: 'todo' },
    { label: 'inprogress', value: 'inprogress' },
    { label: 'done', value: 'done' },
    { label: 'cancelled', value: 'cancelled' },
    { label: 'duplicate', value: 'duplicate' }
  ]

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
      <Pane display='flex' justifyContent='space-between'>
        <Pane display='flex'>
          <Pane width={majorScale(24)} marginLeft={majorScale(2)}>
            <Label htmlFor='search'>Tìm kiếm</Label>
            <SearchInput
              marginTop={majorScale(1)}
              placeholder='Tên công việc...'
              width='100%'
              onChange={(e: any) => setSearchKeyword(e.target.value)}
            />
          </Pane>
          <Pane width={majorScale(16)} marginLeft={majorScale(2)}>
            <Label htmlFor='project'>Lựa chọn dự án</Label>
            <SelectField onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </SelectField>
          </Pane>
          <Pane width={majorScale(16)} marginLeft={majorScale(2)}>
            <Label htmlFor='status'>Trạng thái</Label>
            <SelectField onChange={(e) => setSelectedStatus(e.target.value)}>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {transLabel(status.label)}
                </option>
              ))}
            </SelectField>
          </Pane>
        </Pane>
        <Pane>
          <Button intent='success'>Tạo mới</Button>
        </Pane>
      </Pane>
      <ListIssueComp
        project_id={selectedProjectId}
        status={selectedStatus !== 'all' ? (selectedStatus as IssueStatus) : undefined}
        keyword={searchKeyword}
      />
      <Pane></Pane>
    </Pane>
  )
}
