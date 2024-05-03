import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Image,
  Label,
  Pane,
  TagIcon,
  TrashIcon,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useParams } from 'react-router'
import { history } from '~/configs/history'
import { Member, WorkspaceRemoveMemberParams } from '~/models/member'
import workspaceService from '~/services/workspace.service'

interface UserPopoverProps {
  close?: () => void
  member?: Member
}

export const UserPopover = (props: UserPopoverProps) => {
  const { member } = props
  const params = useParams()

  const handleRemoveMember = () => {
    const _params: WorkspaceRemoveMemberParams = {
      permalink: params.permalink || '',
      user_id: member?.id || 0
    }
    workspaceService.removeMember(_params).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  const handleViewDetail = () => {
    history.push(`/${params.permalink}/members/${member?.username}`)
  }

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
        <Button flex={1} marginRight={majorScale(2)} onClick={handleViewDetail}>
          Xem chi tiết
        </Button>
        <IconButton appearance='primary' intent='danger' icon={<TrashIcon />} onClick={handleRemoveMember} />
      </Pane>
      <Pane marginTop={majorScale(2)}>
        {member?.project.map((project) => (
          <Pane key={project.id} display='flex' alignItems='center' marginTop={majorScale(1)}>
            {!!project.icon ? (
              <Avatar src={project.icon} marginRight={majorScale(1)} />
            ) : (
              <TagIcon color='green' size={majorScale(4)} marginRight={majorScale(1)} />
            )}
            <Label>{project.name}</Label>
          </Pane>
        ))}
        {member?.project.length === 0 && <Label fontWeight={300}>Chưa tham gia dự án nào</Label>}
      </Pane>
    </Pane>
  )
}
