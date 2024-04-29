import { Pane, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { WorkspaceAddMemberComp } from '~/components/setting/add-member'
import { ListMemberComp } from '~/components/setting/list-member'
import { Member, WorkspaceGetMembersParams } from '~/models/member'
import { PaginationResponse } from '~/models/utils'
import { WorkspaceRole } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'
import { SettingPane } from './setting'

export const WorkspaceMemberPage = () => {
  const params = useParams()
  const [members, setMembers] = useState<PaginationResponse<Member> | undefined>(undefined)
  const [getParams, setGetParams] = useState<WorkspaceGetMembersParams>({ permalink: params.permalink! })

  const getMembers = () => {
    workspaceService.getMembers(getParams).then((data) => {
      if (data.status === 200) setMembers(data.data)
    })
  }

  const filterByUsername = (username: string) => {
    setGetParams({
      ...getParams,
      member_kw: username
    })
  }

  const filterByRole = (role: WorkspaceRole | 'all') => {
    if (role !== 'all')
      setGetParams({
        ...getParams,
        role: role
      })
    else {
      setGetParams({
        ...getParams,
        role: undefined
      })
    }
  }

  const handleChangePage = (page: number) => {
    if (page < 1) page = 1
    if (page > (members?.pagination.total_page || 1)) page = members?.pagination.total_page || 1

    setGetParams({
      ...getParams,
      page: page
    })
  }

  useEffect(() => {
    getMembers()
  }, [getParams])

  return (
    <Pane>
      <Pane marginBottom={majorScale(4)} paddingBottom={majorScale(4)} borderBottom='1px solid #ccc'>
        <h1>Quản lý thành viên</h1>
      </Pane>
      <Pane marginBottom={majorScale(4)}>
        {!!members && (
          <ListMemberComp
            members={members}
            handleChangePage={handleChangePage}
            filterByUsername={filterByUsername}
            filterByRole={filterByRole}
          />
        )}
      </Pane>
      <SettingPane heading='Thêm thành viên'>
        <WorkspaceAddMemberComp />
      </SettingPane>
    </Pane>
  )
}
