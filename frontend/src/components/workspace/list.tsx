import { Avatar, Badge, Table, majorScale } from 'evergreen-ui'
import { history } from '~/configs/history'
import { Workspace } from '~/models/workspace'

interface WorkspaceListProps {
  workspaces: Workspace[]
  onSearch: (keyword: string) => void
}

export const WorkspaceList = (props: WorkspaceListProps) => {
  const { workspaces, onSearch } = props

  return (
    <Table>
      <Table.Head>
        <Table.TextHeaderCell flexBasis='auto' flexShrink={0} flexGrow={0}>
          ID
        </Table.TextHeaderCell>
        <Table.SearchHeaderCell flexBasis='auto' placeholder='Tiêu đề...' onChange={onSearch} />
        <Table.TextHeaderCell flexBasis={majorScale(16)} flexShrink={0} flexGrow={0}>
          Quyền riêng tư
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flexBasis={majorScale(16)} flexShrink={0} flexGrow={0}>
          Ngày khởi tạo
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <Table.Row key={workspace.id} isSelectable onSelect={() => history.push(workspace.permalink)}>
              <Table.TextCell flexBasis='auto' flexShrink={0} flexGrow={0}>
                {workspace.id}
              </Table.TextCell>
              <Table.TextCell flexBasis='auto'>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    src={workspace.logo}
                    name={workspace.title}
                    size={majorScale(5)}
                    hashValue={workspace.permalink}
                    marginRight={majorScale(2)}
                  />
                  {workspace.title}
                </span>
              </Table.TextCell>
              <Table.TextCell flexBasis={majorScale(16)} flexShrink={0} flexGrow={0}>
                {workspace.is_private ? <Badge color='red'>Riêng tư</Badge> : <Badge color='green'>Công khai</Badge>}
              </Table.TextCell>
              <Table.TextCell flexBasis={majorScale(16)} flexShrink={0} flexGrow={0}>
                {workspace.created_at}
              </Table.TextCell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.TextCell>Không có dữ liệu...</Table.TextCell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
