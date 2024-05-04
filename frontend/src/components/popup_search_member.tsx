import { Avatar, Menu, Pane, majorScale } from 'evergreen-ui'
import { User } from '~/models/user'

interface PopupSearchMemberProps {
  members: User[]
  onChooseMember: (member: User) => void
}

export const PopupSearchMember = (props: PopupSearchMemberProps) => {
  const { members, onChooseMember, ...paneProps } = props

  return (
    <Pane {...paneProps}>
      <Menu>
        {members.map((member) => (
          <Menu.Item key={member.id} onSelect={() => onChooseMember(member)}>
            <Pane display='flex'>
              <Avatar src={member.avatar || ''} marginRight={majorScale(1)} />
              {`${member.first_name ? member.first_name + ' ' + member.last_name : ''} (${member.username})`}
            </Pane>
          </Menu.Item>
        ))}
      </Menu>
    </Pane>
  )
}
