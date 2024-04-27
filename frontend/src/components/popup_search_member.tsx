import { BanCircleIcon, Image, Menu, Pane, PaneProps, SearchInput, TickIcon, majorScale, toaster } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { Member, WorkspaceGetMembersParams } from '~/models/member'
import { Leader } from '~/pages/project/create-project'
import workspaceService from '~/services/workspace.service'

interface PopupSearchMemberProps extends PaneProps {
  permalink: string
  currentLeader: Leader
  selectLeader: (leader: Leader) => void
}

export const PopupSearchMember = (props: PopupSearchMemberProps) => {
  const { permalink, currentLeader, selectLeader, ...paneProps } = props
  const [search, setSearch] = useState<string>('')
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    const getMembersParams: WorkspaceGetMembersParams = {
      permalink: permalink,
      member_kw: search
    }
    workspaceService.getMembers(getMembersParams).then((data) => {
      if (data.status === 200) {
        setMembers(data.data?.items || [])
      } else {
        setMembers([])
        toaster.danger(data.message)
      }
    })
  }, [search])
  return (
    <Pane {...paneProps}>
      <SearchInput
        type='text'
        placeholder='Tìm kiếm leader'
        value={search}
        onChange={(e: any) => setSearch(e.target.value)}
      />
      <Menu>
        {members.map((member) => (
          <Menu.Item
            key={member.id}
            onSelect={() => selectLeader({ user_id: member.id, username: member.username, avatar: member.avatar })}
            icon={currentLeader?.user_id === member.id ? TickIcon : BanCircleIcon}
          >
            <Pane display='flex'>
              <Image
                src={member.avatar}
                marginRight={majorScale(1)}
                width={majorScale(3)}
                height={majorScale(3)}
                borderRadius={majorScale(2)}
              />
              {member.first_name + ' ' + member.last_name} ({member.username})
            </Pane>
          </Menu.Item>
        ))}
      </Menu>
    </Pane>
  )
}
