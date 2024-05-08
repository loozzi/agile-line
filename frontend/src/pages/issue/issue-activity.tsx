import MDEditor from '@uiw/react-md-editor'
import { Avatar, Button, Icon, Label, Pane, PaneProps, TagIcon, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useAppSelector } from '~/app/hook'
import { AntennaBars1Icon } from '~/assets/icons'
import { selectUser } from '~/hooks/auth/auth.slice'
import { ActivityResponse, IssueResponse } from '~/models/issue'
import { User } from '~/models/user'
import activityService from '~/services/activity.service'
import { convertTimestamp } from '~/utils'

interface IssueActivityCompProps extends PaneProps {
  issue: IssueResponse
}

export const IssueActivityComp = (props: IssueActivityCompProps) => {
  const { issue, ...rest } = props
  const currentUser = useAppSelector(selectUser)

  const [activities, setActivities] = useState<ActivityResponse[]>([])
  const [comment, setComment] = useState<string>('')

  const icons = {
    label: <TagIcon />,
    assignee: <Avatar />,
    status: <Icon icon={AntennaBars1Icon} />,
    priority: <Icon icon={AntennaBars1Icon} />
  }

  const handleComment = () => {
    if (comment.length === 0) return

    activityService.create(issue.id, comment).then((data) => {
      if (data.status === 200) {
        setActivities([...activities, data.data!])
        setComment('')
      }
    })
  }

  useEffect(() => {
    activityService.get(issue.id).then((data) => {
      if (data.status === 200) setActivities(data.data!)
    })
  }, [issue])

  const UserAvatarComp = (user: User) => (
    <Pane display='flex' alignItems='center' fontWeight={500} marginRight={majorScale(1)}>
      <Avatar src={user.avatar || ''} height={majorScale(3)} width={majorScale(3)} marginRight={majorScale(1)} />
      {user.username}
    </Pane>
  )

  return (
    <Pane marginY={majorScale(2)} paddingY={majorScale(4)} borderTop='1px solid #ccc' {...rest}>
      {activities.map((activity) => {
        if (activity.action === 'comment')
          return (
            <Pane key={activity.id} display='flex' position='relative' marginBottom={majorScale(4)}>
              <Pane
                position='absolute'
                left={majorScale(10)}
                top={-majorScale(4)}
                backgroundColor='#ddd'
                height={majorScale(4)}
                width={2}
              />
              <Avatar
                src={activity.user?.avatar || ''}
                width={majorScale(6)}
                height={majorScale(6)}
                marginRight={majorScale(2)}
              />
              <Pane border='1px solid #97D7BF' borderRadius={majorScale(1)} flex={1}>
                <Pane backgroundColor='#DCF2EA' padding={majorScale(2)}>
                  <b>{activity.user.username}</b> đã bình luận {convertTimestamp(activity.created_at)}
                </Pane>
                <Pane>
                  <MDEditor data-color-mode='light' value={activity.description} preview='preview' hideToolbar={true} />
                </Pane>
              </Pane>
            </Pane>
          )
        else {
          return (
            <Pane
              key={activity.id}
              display='flex'
              marginBottom={majorScale(4)}
              marginLeft={majorScale(8)}
              position='relative'
            >
              <Pane
                position='absolute'
                left={majorScale(2)}
                top={-majorScale(4)}
                backgroundColor='#ddd'
                height={majorScale(4)}
                width={2}
              />
              <Icon
                icon={TagIcon}
                display='flex'
                alignItems='center'
                justifyContent='center'
                backgroundColor='#ddd'
                borderRadius={majorScale(2)}
                height={majorScale(4)}
                width={majorScale(4)}
                border='2px solid #fff'
                marginRight={majorScale(2)}
              />
              <Pane display='flex' alignItems='center'>
                <UserAvatarComp {...activity.user} />{' '}
                {activity.action === 'create'
                  ? 'đã tạo công việc vào lúc'
                  : `đã ${activity.description?.toLocaleLowerCase()}`}{' '}
                {convertTimestamp(activity.created_at)}
              </Pane>
            </Pane>
          )
        }
      })}
      <Pane borderTop='1px solid #ccc' display='flex' paddingTop={majorScale(4)}>
        <Avatar
          src={currentUser?.avatar || ''}
          width={majorScale(6)}
          height={majorScale(6)}
          marginRight={majorScale(2)}
        />
        <Pane flex={1} display='flex' flexDirection='column'>
          <Label>Thêm bình luận</Label>
          <MDEditor data-color-mode='light' height={200} value={comment} onChange={(e) => setComment(e || '')} />
          <Button
            appearance='primary'
            marginTop={majorScale(2)}
            alignSelf='flex-end'
            disabled={comment.length === 0}
            onClick={handleComment}
          >
            Bình luận
          </Button>
        </Pane>
      </Pane>
    </Pane>
  )
}
