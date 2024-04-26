import { Pane, PaneProps, SearchInput } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { WorkspaceGetMembersParams } from '~/models/member'
import workspaceService from '~/services/workspace.service'

interface PopupSearchMemberProps extends PaneProps {
  permalink: string
  setSelectedMember: (member: any) => void
}

export const PopupSearchMember = (props: PopupSearchMemberProps) => {
  const { permalink, setSelectedMember, ...paneProps } = props
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const getMembersParams: WorkspaceGetMembersParams = {
      permalink: permalink,
      member_kw: search
    }
    workspaceService.getMembers(getMembersParams).then((data) => {
      console.log(data)
    })
  }, [search])
  return (
    <Pane {...paneProps}>
      <SearchInput
        type='text'
        placeholder='Search member'
        value={search}
        onChange={(e: any) => setSearch(e.target.value)}
      />
    </Pane>
  )
}
