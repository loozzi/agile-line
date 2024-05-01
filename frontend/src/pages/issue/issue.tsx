import { Pagination, Pane, SelectField, Table, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useAppSelector } from '~/app/hook'
import { history } from '~/configs/history'
import { selectUser } from '~/hooks/auth/auth.slice'
import { IssueParams, IssueResponse } from '~/models/issue'
import { ProjectResponse } from '~/models/project'
import { PaginationResponse } from '~/models/utils'
import issueService from '~/services/issue.service'
import workspaceService from '~/services/workspace.service'

export const IssuePage = () => {
  const params = useParams()
  const currentUser = useAppSelector(selectUser)

  const [selectedProjectId, setSelectedProjectId] = useState<number>(0)
  const [projects, setProjects] = useState<ProjectResponse[]>([])

  const [issues, setIssues] = useState<PaginationResponse<IssueResponse> | undefined>(undefined)

  useEffect(() => {
    if (currentUser) {
      const _params: IssueParams = {
        project_id: selectedProjectId,
        username: currentUser.username
      }
      issueService.getAll(_params).then((data) => {
        setIssues(data.data)
      })
    }
  }, [selectedProjectId])

  useEffect(() => {
    workspaceService.allProjects({ permalink: params.permalink || '' }).then((data) => {
      if (data.data) {
        setProjects(data.data.items)
      }
    })
  }, [])

  return (
    <Pane>
      <Pane>
        <SelectField onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </SelectField>
      </Pane>
      <Pane>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>ID</Table.TextHeaderCell>
            <Table.TextHeaderCell>Issue</Table.TextHeaderCell>
            <Table.TextHeaderCell>Dự án</Table.TextHeaderCell>
            <Table.TextHeaderCell>Trạng thái</Table.TextHeaderCell>
            <Table.TextHeaderCell>Mức độ</Table.TextHeaderCell>
            <Table.TextHeaderCell>Giao cho</Table.TextHeaderCell>
            <Table.TextHeaderCell>Giao bởi</Table.TextHeaderCell>
            {/* <Table.TextHeaderCell>Tester</Table.TextHeaderCell> */}
            {/* <Table.TextHeaderCell>Tài liệu</Table.TextHeaderCell> */}
          </Table.Head>
          {issues?.items.map((issue) => (
            <Table.Row cursor='pointer' onClick={() => history.push(`/${params.permalink}/issues/${issue.permalink}`)}>
              <Table.TextCell>{issue.id}</Table.TextCell>
              <Table.TextCell>{issue.name}</Table.TextCell>
              <Table.TextCell>{issue.project.name}</Table.TextCell>
              <Table.TextCell>{issue.status}</Table.TextCell>
              <Table.TextCell>{issue.priority}</Table.TextCell>
              <Table.TextCell>{issue.assignee_id}</Table.TextCell>
              <Table.TextCell>{issue.assignor_id}</Table.TextCell>
              {/* <Table.TextCell>{issue.testor_id}</Table.TextCell> */}
              {/* <Table.TextCell>
                <IconButton icon={<EyeOpenIcon />} onClick={() => setShownResources(!isShownResources)} />
              </Table.TextCell> */}
            </Table.Row>
          ))}
        </Table>
        <Pagination
          marginTop={majorScale(2)}
          display='flex'
          justifyContent='center'
          totalPages={issues?.pagination.total_page || 0}
          page={issues?.pagination.current_page || 0}
        />
      </Pane>
      <Pane></Pane>
    </Pane>
  )
}
