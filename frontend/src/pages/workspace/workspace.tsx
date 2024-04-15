import { Button, CrossIcon, Pane, PlusIcon, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useAppSelector } from '~/app/hook'
import { WorkspaceCreate } from '~/components/workspace/create'
import { WorkspaceList } from '~/components/workspace/list'
import { selectIsAuthenticated } from '~/hooks/auth/auth.slice'
import { Workspace, WorkspaceSearchParams } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'

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
      <Pane display='flex' flexDirection='column' marginY={majorScale(2)}>
        <Pane>
          <Button iconBefore={<PlusIcon />} intent='success' marginRight={majorScale(2)}>
            Tạo mới
          </Button>
          <Button iconBefore={<CrossIcon />} intent='danger'>
            Hủy bỏ
          </Button>
        </Pane>
        <WorkspaceCreate />
      </Pane>
      <WorkspaceList workspaces={workspaces} onSearch={onSearch} />
    </Pane>
  )
}
