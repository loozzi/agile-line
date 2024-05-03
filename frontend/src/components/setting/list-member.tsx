import {
  Avatar,
  Button,
  Combobox,
  Dialog,
  Pagination,
  Pane,
  PaneProps,
  Popover,
  Table,
  TrashIcon,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useState } from 'react'
import { useParams } from 'react-router'
import { Member, WorkspaceRemoveMemberParams, WorkspaceSetRolePayload } from '~/models/member'
import { PaginationResponse } from '~/models/utils'
import { WorkspaceParams, WorkspaceRole } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'
import { UserPopover } from '../user-popover'

interface ListMemberCompProps extends PaneProps {
  members: PaginationResponse<Member>
  handleChangePage: (page: number) => void
  filterByUsername: (username: string) => void
  filterByRole: (role: WorkspaceRole | 'all') => void
}

export const ListMemberComp = (props: ListMemberCompProps) => {
  const { members, handleChangePage, filterByUsername, filterByRole, ...paneProps } = props
  const params = useParams()

  const [roleSelected, setRoleSelected] = useState<
    { curRole: WorkspaceRole; nextRole: WorkspaceRole; user_id: number } | undefined
  >(undefined)
  const [removeUserId, setRemoveId] = useState<number | undefined>(undefined)

  const handleChangeRole = (role: WorkspaceRole, user_id: number) => {
    setRoleSelected({
      curRole: members.items.filter((m) => m.id === user_id)[0].role,
      nextRole: role,
      user_id: user_id
    })
  }

  const confirmChangeRole = () => {
    const _params: WorkspaceParams = { permalink: params.permalink || '' }
    const payload: WorkspaceSetRolePayload = {
      user_id: roleSelected?.user_id || 0,
      role: roleSelected?.nextRole || 'member'
    }
    workspaceService.changeRoleMember(_params, payload).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  const confirmRemoveMember = () => {
    const _params: WorkspaceRemoveMemberParams = {
      permalink: params.permalink || '',
      user_id: removeUserId || 0
    }
    workspaceService.removeMember(_params).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
        handleChangePage(members?.pagination.current_page || 1)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  return (
    <Pane {...paneProps}>
      <Table>
        <Table.Head>
          <Table.SearchHeaderCell onChange={filterByUsername} placeholder='Username'>
            Username
          </Table.SearchHeaderCell>
          {/* <Table.TextHeaderCell>Họ và tên</Table.TextHeaderCell> */}
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
          <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {members?.items.map((member: Member) => (
            <Table.Row key={member.id}>
              <Table.TextCell>
                <Popover content={({ close }) => <UserPopover close={close} member={member} />}>
                  <Pane display='flex' alignItems='center' cursor='pointer'>
                    <Avatar src={member.avatar} marginRight={majorScale(2)} />
                    {member.username}
                  </Pane>
                </Popover>
              </Table.TextCell>
              {/* <Table.TextCell>{`${member.first_name} ${member.last_name}`}</Table.TextCell> */}
              <Table.TextCell>
                <Combobox
                  items={['admin', 'moderator', 'member']}
                  width={majorScale(16)}
                  initialSelectedItem={member.role}
                  openOnFocus
                  onChange={(selected) => handleChangeRole(selected as WorkspaceRole, member.id)}
                />
              </Table.TextCell>
              <Table.TextCell>
                <Button intent='danger' iconBefore={<TrashIcon />} onClick={() => setRemoveId(member.id)}>
                  Xóa
                </Button>
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
      <Dialog
        isShown={!!removeUserId || !!roleSelected}
        onConfirm={() => {
          if (!!removeUserId) return confirmRemoveMember()
          else return confirmChangeRole()
        }}
        onCloseComplete={() => {
          if (!!roleSelected) {
            // Find a way to fix this
            window.location.reload()
          }
          setRemoveId(undefined)
          setRoleSelected(undefined)
        }}
        title={!!removeUserId ? 'Xác nhận xóa member' : 'Xác nhận thay đổi role'}
        intent={!!removeUserId ? 'danger' : 'none'}
        confirmLabel={!!removeUserId ? 'Xóa' : 'Xác nhận'}
        cancelLabel='Hủy bỏ'
      >
        {!!removeUserId ? (
          <p>Bạn có chắc chắn muốn xóa member này khỏi workspace?</p>
        ) : (
          <p>Bạn có chắc chắn muốn thay đổi role của member này?</p>
        )}
      </Dialog>
    </Pane>
  )
}
