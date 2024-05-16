import { Button, Dialog, Pane, PlusIcon, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useAppSelector } from '~/app/hook'
import { WorkspaceCreate } from '~/components/workspace/create'
import { WorkspaceList } from '~/components/workspace/list'
import { selectIsAuthenticated } from '~/hooks/auth/auth.slice'
import { Workspace, WorkspaceSearchParams } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'
import { ForbiddenPage } from '../403'

export const WorkspacePage = () => {
  document.title = 'Chọn Workspace'
  const isAuth = useAppSelector(selectIsAuthenticated)
  const [params, setParams] = useState<WorkspaceSearchParams>({ keyword: '', page: 1, limit: 10 })
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isShownCreate, setShownCreate] = useState<boolean>(false)

  const onSearch = (keyword: string) => {
    setParams({ ...params, keyword })
  }

  const onCreateSuccess = (item: Workspace): void => {
    setWorkspaces([item, ...workspaces])
  }

  useEffect(() => {
    workspaceService.getWorkspaces(params).then((res) => {
      const { data } = res
      setWorkspaces(data?.items || [])
    })
  }, [params])

  if (!isAuth) {
    return <ForbiddenPage />
  }

  return (
    <Pane marginX={majorScale(2)}>
      <h2 style={{ fontWeight: 600, fontSize: 36, marginTop: 24, marginBottom: 12, textAlign: 'center' }}>
        Danh sách Workspace
      </h2>
      <Pane maxWidth={majorScale(100)} margin='auto'>
        <Button
          iconBefore={<PlusIcon />}
          marginBottom={majorScale(1)}
          intent='success'
          onClick={() => setShownCreate(true)}
          type='button'
        >
          Tạo mới
        </Button>
        <WorkspaceList workspaces={workspaces} onSearch={onSearch} />
      </Pane>
      <Dialog
        isShown={isShownCreate}
        title='Tạo workspace'
        onCloseComplete={() => setShownCreate(false)}
        hasFooter={false}
      >
        <WorkspaceCreate onCreateSuccess={onCreateSuccess} onClose={() => setShownCreate(false)} />
      </Dialog>
    </Pane>
  )
}
