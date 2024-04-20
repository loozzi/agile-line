import { Pane, SearchInput } from 'evergreen-ui'
import { useEffect, useState } from 'react'

export const WorkspaceAddMemberComp = () => {
  // const [newMembers, setNewMembers] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>('')

  // const handleAddMembers = () => {
  //   // TODO: handle call api to add members
  // }

  // const handleAddMember = (member: any) => {
  //   // TODO: handle add memeber to newMembers
  // }

  useEffect(() => {
    // TODO: Implement search user by username or email
  }, [keyword])

  return (
    <Pane>
      <SearchInput placeholder='Search by username' value={keyword} onChange={(e: any) => setKeyword(e.target.value)} />
      {/* TODO: Implement list member */}
      {/* TODO: Implement member queue */}
      {/* TODO: Implement button submit */}
    </Pane>
  )
}
