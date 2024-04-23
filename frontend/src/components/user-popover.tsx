import { Pane, Image, Label, majorScale, TagIcon, Badge, Button, IconButton, TrashIcon } from 'evergreen-ui'
import { Member } from '~/models/member'

interface UserPopoverProps {
  close?: () => void
  member?: Member
}

export const UserPopover = (props: UserPopoverProps) => {
  const { member } = props

  return (
    <Pane display='flex' flexDirection='column' padding={majorScale(2)}>
      <Pane display='flex'>
        <Image src={member?.avatar} width={60} height={60} borderRadius={8} />
        <Pane display='flex' flexDirection='column' marginLeft={majorScale(2)}>
          <Badge
            height={majorScale(3)}
            lineHeight='24px'
            color={member?.role === 'admin' ? 'orange' : member?.role === 'moderator' ? 'green' : 'blue'}
          >
            {member?.role}
          </Badge>
          <Label>{`${member?.first_name} ${member?.last_name}`}</Label>
          <Label>{member?.username}</Label>
        </Pane>
      </Pane>
      <Pane display='flex' alignItems='center' marginTop={majorScale(1)}>
        <Button flex={1} marginRight={majorScale(2)}>
          Xem chi tiết
        </Button>
        <IconButton appearance='primary' intent='danger' icon={<TrashIcon />} />
      </Pane>
      <Pane marginTop={majorScale(2)}>
        {member?.project.map((project) => (
          <Pane key={project.id} display='flex' alignItems='center' marginTop={majorScale(1)}>
            <TagIcon color='green' marginRight={majorScale(1)} />
            <Label>{project.name}</Label>
          </Pane>
        ))}
        {member?.project.length === 0 && <Label fontWeight={300}>Chưa tham gia dự án nào</Label>}
      </Pane>
    </Pane>
  )
}
