import MDEditor from '@uiw/react-md-editor'
import { Avatar, Badge, Pane, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useAppSelector } from '~/app/hook'
import routes from '~/configs/routes'
import { selectCurrentWorkspace, selectGetWorkspace } from '~/hooks/workspace/workspace.slice'
import { ActivityResponse } from '~/models/issue'
import activityService from '~/services/activity.service'
import { convertTimestamp } from '~/utils'

export const ActivityPage = () => {
  const params = useParams()

  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const loading = useAppSelector(selectGetWorkspace)

  const [activities, setActivities] = useState<ActivityResponse[]>([])

  useEffect(() => {
    if (params.permalink)
      activityService.getNew(params.permalink).then((res) => {
        setActivities(res.data!)
      })
  }, [params])

  return (
    <Pane>
      <h1>Danh sách bình luận</h1>
      {loading && <p>Loading...</p>}
      {!!currentWorkspace && (
        <Pane marginTop={majorScale(4)}>
          {activities.map((activity) => (
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
                <Pane
                  backgroundColor='#DCF2EA'
                  paddingX={majorScale(2)}
                  paddingY={majorScale(1)}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Pane>
                    <b>{activity.user.username}</b> đã bình luận {convertTimestamp(activity.created_at)}
                    {activity.is_edited && (
                      <Badge color='orange' marginLeft={majorScale(2)}>
                        Đã chỉnh sửa
                      </Badge>
                    )}
                  </Pane>
                  <Pane>
                    <Link
                      to={routes.workspace.issues.detail
                        .replace(':permalink', currentWorkspace.permalink)
                        .replace(':issuePermalink', (activity as any).issue)}
                    >
                      Xem chi tiết
                    </Link>
                  </Pane>
                </Pane>
                <MDEditor data-color-mode='light' value={activity.description} preview='preview' hideToolbar={true} />
              </Pane>
            </Pane>
          ))}
        </Pane>
      )}
    </Pane>
  )
}
