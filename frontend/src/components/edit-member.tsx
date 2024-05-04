import {
  Avatar,
  Button,
  DeleteIcon,
  Dialog,
  EditIcon,
  IconButton,
  Label,
  MinusIcon,
  Pagination,
  Pane,
  PaneProps,
  PlusIcon,
  SavedIcon,
  Table,
  TrashIcon,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Member } from '~/models/member'
import { ProjectResponse } from '~/models/project'
import { User } from '~/models/user'
import { Pagination as IPagination } from '~/models/utils'
import projectService from '~/services/project.service'
import workspaceService from '~/services/workspace.service'
import { transLabel } from '~/utils'

interface EditMemberProps extends PaneProps {
  members: User[]
  permalink: string
  onUpdateSuccess: (data: ProjectResponse) => void
}

export const EditMemberComp = (props: EditMemberProps) => {
  const { members, permalink, onUpdateSuccess, ...paneProps } = props
  const params = useParams()

  const [enableEdit, setEnableEdit] = useState<boolean>(false)
  const [editMemberList, setEditMemberList] = useState<any[]>([])

  const [addMemberDialog, setAddMemberDialog] = useState<boolean>(false)
  const [searchData, setSearchData] = useState<Member[]>([])
  const [pagination, setPagination] = useState<IPagination>({ total_item: 0, total_page: 1, count: 0, current_page: 0 })
  const [newMembers, setNewMembers] = useState<Member[]>([])

  const handleSelectMember = (index: number) => {
    if (editMemberList[index].id !== members.find((m) => m.roles.includes('leader'))!.id) {
      const newEditMemberList = [...editMemberList]
      newEditMemberList[index].selected = !newEditMemberList[index].selected
      setEditMemberList(newEditMemberList)
    }
  }

  const handleUpdateListMember = () => {
    const newListMembers = editMemberList.filter((m) => !m.selected).map((m) => m.id)
    const _newMembers = newMembers.map((m) => m.id)

    const payload: Set<number> = new Set([..._newMembers, newListMembers].flat())
    const _payload: number[] = Array.from(payload)

    projectService.updateMembers(permalink, _payload).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
        onUpdateSuccess(data.data!)
      } else {
        toaster.danger(data.message)
      }
    })
    setEnableEdit(false)
    setAddMemberDialog(false)
    setNewMembers([])
  }

  const handleChangePage = (page: number) => {
    if (page < 1) page = 1
    if (page > pagination.total_page) page = pagination.total_page

    setPagination({
      ...pagination,
      current_page: page
    })
  }

  const handleRemoveMember = (member: Member) => {
    setNewMembers(newMembers.filter((item) => item.id !== member.id))
  }

  useEffect(() => {
    setEditMemberList(members.map((m) => ({ ...m, selected: false })))
  }, [enableEdit])

  useEffect(() => {
    workspaceService
      .getMembers({ permalink: params.permalink || '', page: pagination.current_page, limit: 10 })
      .then((data) => {
        setSearchData(data.data!.items)
      })
  }, [addMemberDialog, pagination])

  return (
    <Pane {...paneProps}>
      <Pane display='flex' justifyContent='space-between' alignContent='center' marginBottom={majorScale(1)}>
        <Label>Danh sách thành viên</Label>
        {enableEdit ? (
          <Pane>
            <Button
              intent='success'
              iconBefore={SavedIcon}
              marginRight={majorScale(1)}
              onClick={handleUpdateListMember}
            >
              Lưu
            </Button>
            <Button intent='danger' iconBefore={DeleteIcon} onClick={() => setEnableEdit(false)}>
              Hủy
            </Button>
          </Pane>
        ) : (
          <Pane>
            <Button iconBefore={EditIcon} marginRight={majorScale(2)} onClick={() => setAddMemberDialog(true)}>
              Thêm thành viên
            </Button>
            <Button iconBefore={TrashIcon} intent='danger' onClick={() => setEnableEdit(true)}>
              Xóa thành viên
            </Button>
          </Pane>
        )}
      </Pane>
      <Table>
        <Table.Head>
          <Table.TextHeaderCell flexBasis={majorScale(8)} flexShrink={0} flexGrow={0}>
            STT
          </Table.TextHeaderCell>
          <Table.TextHeaderCell>Username</Table.TextHeaderCell>
          <Table.TextHeaderCell>Tên</Table.TextHeaderCell>
          <Table.TextHeaderCell>Vai trò</Table.TextHeaderCell>
          {enableEdit && <Table.TextHeaderCell>Thao tác</Table.TextHeaderCell>}
        </Table.Head>
        <Table.Body>
          {members.map((member, index) => (
            <Table.Row key={member.id}>
              <Table.TextCell flexBasis={majorScale(8)} flexShrink={0} flexGrow={0}>
                {index + 1}
              </Table.TextCell>
              <Table.TextCell>
                <Pane display='flex' alignItems='center'>
                  <Avatar src={member.avatar || ''} marginRight={majorScale(1)} />
                  {member.username}
                </Pane>
              </Table.TextCell>
              <Table.TextCell>{`${member.first_name ? member.first_name + ' ' + member.last_name : `Chưa cập nhật`}`}</Table.TextCell>
              <Table.TextCell>{member.roles.map((e: string) => transLabel(e)).join(', ')}</Table.TextCell>
              {enableEdit && (
                <Table.TextCell>
                  {editMemberList[index].selected ? (
                    <IconButton icon={PlusIcon} intent='success' onClick={() => handleSelectMember(index)} />
                  ) : (
                    <IconButton icon={<MinusIcon />} intent='danger' onClick={() => handleSelectMember(index)} />
                  )}
                </Table.TextCell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Dialog
        width={majorScale(120)}
        isShown={addMemberDialog}
        hasFooter={false}
        hasHeader={false}
        onCloseComplete={() => {
          setAddMemberDialog(false)
          setNewMembers([])
        }}
      >
        <Pane display='flex' marginTop={majorScale(1)} justifyContent='space-between'>
          <Pane flex={1} marginRight={majorScale(1)} display='flex' flexDirection='column'>
            <Table>
              <Table.Head>
                <Table.TextHeaderCell>Username</Table.TextHeaderCell>
                <Table.TextHeaderCell>Họ và tên</Table.TextHeaderCell>
                <Table.TextHeaderCell>Hành động</Table.TextHeaderCell>
              </Table.Head>

              <Table.Body>
                {searchData.map((user: Member) => (
                  <Table.Row key={user.id}>
                    <Table.TextCell>
                      <Pane display='flex' alignItems='center'>
                        <Avatar src={user.avatar} marginRight={majorScale(1)} />
                        {user.username}
                      </Pane>
                    </Table.TextCell>
                    <Table.TextCell>{`${user.first_name ? user.first_name + ' ' + user.last_name : `Chưa cập nhật`}`}</Table.TextCell>
                    <Table.TextCell>
                      <IconButton
                        icon={<PlusIcon />}
                        intent='success'
                        onClick={() => setNewMembers([...newMembers, user])}
                        disabled={
                          members.some((item) => item.id === user.id) || newMembers.some((item) => item.id === user.id)
                        }
                      />
                    </Table.TextCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Pagination
              totalPages={pagination.total_page}
              page={pagination.current_page}
              alignSelf='center'
              marginTop={majorScale(2)}
              onPageChange={handleChangePage}
              onNextPage={() => handleChangePage(pagination.current_page + 1)}
              onPreviousPage={() => handleChangePage(pagination.current_page - 1)}
            />
          </Pane>

          <Table flex={1} marginLeft={majorScale(1)}>
            <Table.Head>
              <Table.TextHeaderCell>Username</Table.TextHeaderCell>
              <Table.TextHeaderCell>Họ và tên</Table.TextHeaderCell>
              <Table.TextHeaderCell>Hành động</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
              {newMembers.map((user: Member) => (
                <Table.Row key={user.id}>
                  <Table.TextCell>
                    <Pane display='flex' alignItems='center'>
                      <Avatar src={user.avatar} marginRight={majorScale(1)} />
                      {user.username}
                    </Pane>
                  </Table.TextCell>
                  <Table.TextCell>{`${user.first_name ? user.first_name + ' ' + user.last_name : `Chưa cập nhật`}`}</Table.TextCell>
                  <Table.TextCell>
                    <IconButton icon={<MinusIcon />} intent='danger' onClick={() => handleRemoveMember(user)} />
                  </Table.TextCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Pane>
        <Pane display='flex' justifyContent='flex-end'>
          <Button appearance='primary' marginTop={majorScale(2)} onClick={handleUpdateListMember}>
            Thêm thành viên
          </Button>
        </Pane>
      </Dialog>
    </Pane>
  )
}
