import { Button, CrossIcon, Pane, PlusIcon, Table, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useAppSelector } from '~/app/hook'
import { WorkspaceCreate } from '~/components/workspace/create'
import { WorkspaceList } from '~/components/workspace/list'
import { selectIsAuthenticated } from '~/hooks/auth/auth.slice'
import { Workspace, WorkspaceSearchParams } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'
import { history } from '~/configs/history'

export const WorkspacePage = () => {
  const isAuth = useAppSelector(selectIsAuthenticated)
  const [params, setParams] = useState<WorkspaceSearchParams>({ keyword: '', page: 1, limit: 10 })
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  const onSearch = (keyword: string) => {
    setParams({ ...params, keyword })
  }

  useEffect(() => {
    workspaceService.getWorkspaces(params).then((res) => {
      const { data } = res
      setWorkspaces(data?.items || [])
    })
  }, [params])

  if (!isAuth) {
    // TODO: return 403 page
    return <div>Not authenticated</div>
  }

  return (
    <Pane marginX={majorScale(2)}>
      <WorkspaceList workspaces={workspaces} onSearch={onSearch} />
      <WorkspaceCreate />
    </Pane>
  )
}
