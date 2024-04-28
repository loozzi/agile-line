import { Button, IconButton, MinusIcon, Pane, PaneProps, PlusIcon, SearchInput, Table, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useAppSelector } from '~/app/hook'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { IResponse } from '~/models/IResponse'
import { WorkspaceAddMembersPayload } from '~/models/member'
import { User, UserSearchParams } from '~/models/user'
import { PaginationResponse } from '~/models/utils'
import { WorkspaceParams } from '~/models/workspace'
import userService from '~/services/user.service'
import workspaceService from '~/services/workspace.service'

interface WorkspaceAddMemberCompProps extends PaneProps {}

export const WorkspaceAddMemberComp = (props: WorkspaceAddMemberCompProps) => {
  const { ...paneProps } = props
  const [searchData, setSearchData] = useState<User[]>([])
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

  useEffect(() => {
    if (keyword.length > 0 && currentWorkspace) {
      const _params: UserSearchParams = { keyword: keyword, workspace_id: currentWorkspace!.id }
      userService.search(_params).then((data: IResponse<PaginationResponse<User>>) => {
        if (data.status === 200) {
          console.log(data.data!.items)
          setSearchData(data.data!.items)
        }
      })
    }
  }, [keyword])

  return (
    <Pane {...paneProps}>
      <SearchInput
        placeholder='Tìm kiếm bằng username'
        value={keyword}
        onChange={(e: any) => setKeyword(e.target.value)}
      />
      <Pane display='flex' marginTop={majorScale(1)} justifyContent='space-between'>
        <Table flex={1} marginRight={majorScale(1)}>
          <Table.Head>
            <Table.TextHeaderCell>Username</Table.TextHeaderCell>
            <Table.TextHeaderCell>Email</Table.TextHeaderCell>
            <Table.TextHeaderCell>Họ và tên</Table.TextHeaderCell>
            <Table.TextHeaderCell>Hành động</Table.TextHeaderCell>
          </Table.Head>

          <Table.Body>
            {searchData.map((user: User) => (
              <Table.Row key={user.id}>
                <Table.TextCell>{user.username}</Table.TextCell>
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
                <Table.TextCell>{user.username}</Table.TextCell>
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
