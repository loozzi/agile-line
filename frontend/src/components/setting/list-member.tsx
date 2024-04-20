import { Pane, PaneProps, Table, Image, majorScale, Combobox, Pagination } from 'evergreen-ui'
import { Member } from '~/models/user'
import { PaginationResponse } from '~/models/utils'
import { WorkspaceRole } from '~/models/workspace'

interface ListMemberCompProps extends PaneProps {
  members: PaginationResponse<Member>
  handleChangePage: (page: number) => void
  filterByUsername: (username: string) => void
  filterByRole: (role: WorkspaceRole | 'all') => void
}

export const ListMemberComp = (props: ListMemberCompProps) => {
  const { members, handleChangePage, filterByUsername, filterByRole, ...paneProps } = props

  const handleChangeRole = (role: WorkspaceRole, user_id: number) => {
    console.log(role, user_id)
  }

  return (
    <Pane {...paneProps}>
      <Table>
        <Table.Head>
          <Table.SearchHeaderCell onChange={filterByUsername} placeholder='Username'>
            Username
          </Table.SearchHeaderCell>
          <Table.TextHeaderCell>Họ và tên</Table.TextHeaderCell>
          <Table.TextHeaderCell>
            <Pane display='flex' alignItems='center'>
              Role
              <Combobox
                marginLeft={majorScale(2)}
                width={majorScale(16)}
                items={['all', 'admin', 'moderator', 'member']}
                initialSelectedItem={'all'}
                openOnFocus
                onChange={(selected) => filterByRole(selected)}
              />
            </Pane>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {members?.items.map((member: Member) => (
            <Table.Row key={member.id}>
              <Table.TextCell>
                <Pane display='flex' alignItems='center'>
                  <Image
                    src={member.avatar}
                    width={40}
                    height={40}
                    marginRight={majorScale(2)}
                    borderRadius={majorScale(15)}
                  />
                  {member.username}
                </Pane>
              </Table.TextCell>
              <Table.TextCell>{`${member.first_name} ${member.last_name}`}</Table.TextCell>
              <Table.TextCell>
                <Combobox
                  items={['admin', 'moderator', 'member']}
                  width={majorScale(16)}
                  initialSelectedItem={member.role}
                  openOnFocus
                  onChange={(selected) => handleChangeRole(selected as WorkspaceRole, member.id)}
                />
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        display='flex'
        marginTop={majorScale(2)}
        justifyContent='center'
        totalPages={members?.pagination.total_page || 1}
        page={members?.pagination.current_page || 1}
        onPageChange={(page) => handleChangePage(page)}
        onNextPage={() => handleChangePage(members?.pagination.current_page + 1)}
        onPreviousPage={() => handleChangePage(members?.pagination.current_page - 1)}
      />
    </Pane>
  )
}
