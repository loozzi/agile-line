import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ListMemberComp } from '~/components/setting/list-member'
import { Member, WorkspaceGetMembersParams } from '~/models/member'
import { PaginationResponse } from '~/models/utils'
import { WorkspaceRole } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'

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

  // TODO: Implement UI
  // TODO: Implement logic
  // TODO: Implement styles
  // TODO: Add member by email or username
  return (
    <div>
      {!!members && (
        <ListMemberComp
          members={members}
          handleChangePage={handleChangePage}
          filterByUsername={filterByUsername}
          filterByRole={filterByRole}
        />
      )}
    </div>
  )
}
