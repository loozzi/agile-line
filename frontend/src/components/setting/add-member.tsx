import {
  Avatar,
  Button,
  IconButton,
  MinusIcon,
  Pagination,
  Pane,
  PaneProps,
  PlusIcon,
  SearchInput,
  Table,
  majorScale
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useAppSelector } from '~/app/hook'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { IResponse } from '~/models/IResponse'
import { WorkspaceAddMembersPayload } from '~/models/member'
import { User, UserSearchParams } from '~/models/user'
import { Pagination as IPagination, PaginationResponse } from '~/models/utils'
import { WorkspaceParams } from '~/models/workspace'
import userService from '~/services/user.service'
import workspaceService from '~/services/workspace.service'

interface WorkspaceAddMemberCompProps extends PaneProps {}

export const WorkspaceAddMemberComp = (props: WorkspaceAddMemberCompProps) => {
  const { ...paneProps } = props
  const [searchData, setSearchData] = useState<User[]>([])
  const [pagination, setPagination] = useState<IPagination>({ total_item: 0, total_page: 1, count: 0, current_page: 0 }) // [PaginationResponse<User> | undefined]
  const [newMembers, setNewMembers] = useState<User[]>([])
  const [keyword, setKeyword] = useState<string>('')
  const params = useParams()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const handleAddMembers = () => {
    const _params: WorkspaceParams = {
      permalink: params.permalink!
    }
    const payload: WorkspaceAddMembersPayload = {
      user_ids: newMembers.map((item) => item.id)
    }
    workspaceService.addMembers(_params, payload).then((data) => {
      if (data.status === 200) {
        setNewMembers([])
      } else {
      }
    })
  }

  const handleRemoveMember = (member: User) => {
    setNewMembers(newMembers.filter((item) => item.id !== member.id))
  }

  const handleChangePage = (page: number) => {
    if (page < 1) page = 1
    if (page > pagination.total_page) page = pagination.total_page

    setPagination({
      ...pagination,
      current_page: page
    })
  }

  useEffect(() => {
    if (keyword.length > 0 && currentWorkspace) {
      const _params: UserSearchParams = {
        keyword: keyword,
        workspace_id: currentWorkspace!.id,
        page: pagination.current_page,
        limit: 10
      }
      userService.search(_params).then((data: IResponse<PaginationResponse<User>>) => {
        if (data.status === 200) {
          setSearchData(data.data!.items)
          setPagination(data.data!.pagination)
        }
      })
    }
  }, [keyword, pagination.current_page])

  return (
    <Pane {...paneProps}>
      <SearchInput
        placeholder='Tìm kiếm bằng username'
        value={keyword}
        onChange={(e: any) => setKeyword(e.target.value)}
      />
      <Pane display='flex' marginTop={majorScale(1)} justifyContent='space-between'>
        <Pane flex={1} marginRight={majorScale(1)} display='flex' flexDirection='column'>
          <Table>
            <Table.Head>
              <Table.TextHeaderCell>Username</Table.TextHeaderCell>
              <Table.TextHeaderCell>Email</Table.TextHeaderCell>
              <Table.TextHeaderCell>Họ và tên</Table.TextHeaderCell>
              <Table.TextHeaderCell>Hành động</Table.TextHeaderCell>
            </Table.Head>

            <Table.Body>
              {searchData.map((user: User) => (
                <Table.Row key={user.id}>
                  <Table.TextCell>
                    <Pane display='flex' alignItems='center'>
                      <Avatar src={user.avatar || ''} marginRight={majorScale(1)} />
                      {user.username}
                    </Pane>
                  </Table.TextCell>
                  <Table.TextCell>{user.email}</Table.TextCell>
                  <Table.TextCell>{`${user.first_name} ${user.last_name}`}</Table.TextCell>
                  <Table.TextCell>
                    <IconButton
                      icon={<PlusIcon />}
                      intent='success'
                      onClick={() => setNewMembers([...newMembers, user])}
                      disabled={newMembers.some((item) => item.id === user.id) || user.in_workspace}
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
            <Table.TextHeaderCell>Email</Table.TextHeaderCell>
            <Table.TextHeaderCell>Họ và tên</Table.TextHeaderCell>
            <Table.TextHeaderCell>Hành động</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {newMembers.map((user: User) => (
              <Table.Row key={user.id}>
                <Table.TextCell>
                  <Pane display='flex' alignItems='center'>
                    <Avatar src={user.avatar || ''} marginRight={majorScale(1)} />
                    {user.username}
                  </Pane>
                </Table.TextCell>
                <Table.TextCell>{user.email}</Table.TextCell>
                <Table.TextCell>{`${user.first_name} ${user.last_name}`}</Table.TextCell>
                <Table.TextCell>
                  <IconButton icon={<MinusIcon />} intent='danger' onClick={() => handleRemoveMember(user)} />
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>
      <Pane display='flex' justifyContent='flex-end'>
        <Button appearance='primary' marginTop={majorScale(2)} onClick={handleAddMembers}>
          Thêm thành viên
        </Button>
      </Pane>
    </Pane>
  )
}
