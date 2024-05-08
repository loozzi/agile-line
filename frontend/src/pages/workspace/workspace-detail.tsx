import MDEditor from '@uiw/react-md-editor'
import { Avatar, Badge, Image, Label, Pane, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useAppSelector } from '~/app/hook'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { WorkspaceInfoResponse } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'
import { getContrastColor, transLabel } from '~/utils'

export const WorkspaceDetailPage = () => {
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const [details, setDetails] = useState<WorkspaceInfoResponse | undefined>(undefined)

  const getDetail = () => {
    if (currentWorkspace) {
      workspaceService.getInfo(currentWorkspace.permalink).then((res) => {
        setDetails(res.data)
      })
    }
  }

  useEffect(() => {
    getDetail()
  }, [currentWorkspace])

  return (
    <Pane>
      <Pane display='flex'>
        <Image
          src={currentWorkspace?.logo || ''}
          width={majorScale(20)}
          height={majorScale(20)}
          borderRadius={majorScale(1)}
          marginRight={majorScale(2)}
        />
        <Pane flex={1}>
          <Pane fontSize={majorScale(5)}>{currentWorkspace?.title}</Pane>
          <MDEditor
            height={100}
            data-color-mode='light'
            value={currentWorkspace?.description || ''}
            preview='preview'
            hideToolbar={true}
            style={{ border: 'none' }}
          />
        </Pane>
      </Pane>
      <Pane
        marginTop={majorScale(4)}
        display='flex'
        flexWrap='wrap'
        alignItems='flex-start'
        justifyContent='space-between'
      >
        <Pane
          borderRadius={majorScale(1)}
          border='1px solid #ccc'
          padding={majorScale(2)}
          onClick={() =>
            history.push(routes.workspace.members.page.replace(':permalink', currentWorkspace?.permalink || ''))
          }
          flexBasis='49%'
          marginBottom={majorScale(2)}
        >
          <Pane fontSize={majorScale(3)} marginBottom={majorScale(2)}>
            Số lượng thành viên: <b>{details?.members.total}</b>
          </Pane>
          <Pane>
            <p>Quản trị viên</p>
            {details?.members.admins.map((admin) => (
              <Pane display='flex' marginTop={majorScale(1)}>
                <Avatar src={admin.avatar} marginRight={majorScale(1)} />
                {`${admin.first_name} ${admin.last_name}`} ({admin.username})
              </Pane>
            ))}
          </Pane>
        </Pane>
        <Pane
          borderRadius={majorScale(1)}
          border='1px solid #ccc'
          padding={majorScale(2)}
          onClick={() =>
            history.push(routes.workspace.projects.page.replace(':permalink', currentWorkspace?.permalink || ''))
          }
          flexBasis='49%'
          marginBottom={majorScale(2)}
        >
          <Pane fontSize={majorScale(3)} marginBottom={majorScale(2)}>
            Số lượng dự án: <b>{details?.projects.total}</b>
          </Pane>
          <Pane>
            <p>{details?.projects.items.length} dự án mới cập nhật</p>
            {details?.projects.items.map((project) => (
              <Pane display='flex' marginTop={majorScale(1)}>
                <Avatar src={project.logo} marginRight={majorScale(1)} />
                {project.name}
              </Pane>
            ))}
          </Pane>
        </Pane>
        <Pane borderRadius={majorScale(1)} border='1px solid #ccc' padding={majorScale(2)} flexBasis='49%'>
          <Pane fontSize={majorScale(3)} marginBottom={majorScale(2)}>
            Số lượng công việc: <b>{details?.issues.total}</b>
          </Pane>
          <Pane>
            <p>{details?.issues.items.length} công việc mới cập nhật</p>
            {details?.issues.items.map((issue) => (
              <Pane
                display='flex'
                marginTop={majorScale(1)}
                borderBottom='1px solid #ccc'
                paddingBottom={majorScale(1)}
                onClick={() =>
                  history.push(
                    routes.workspace.issues.detail
                      .replace(':permalink', details.workspace.permalink || '')
                      .replace(':issuePermalink', issue.permalink)
                  )
                }
              >
                <Pane>
                  <Label fontSize={majorScale(2)}>{issue.name}</Label>
                  <p>
                    {transLabel(issue.status)} - {transLabel(issue.priority)}
                  </p>
                </Pane>
              </Pane>
            ))}
          </Pane>
        </Pane>
        <Pane
          borderRadius={majorScale(1)}
          border='1px solid #ccc'
          padding={majorScale(2)}
          onClick={() =>
            history.push(routes.workspace.labels.page.replace(':permalink', currentWorkspace?.permalink || ''))
          }
          flexBasis='49%'
          marginBottom={majorScale(2)}
        >
          <Pane fontSize={majorScale(3)} marginBottom={majorScale(2)}>
            Số lượng nhãn: <b>{details?.labels.total}</b>
          </Pane>
          <Pane>
            <p>Danh sách nhãn</p>
            {details?.labels.items.map((label) => (
              <Pane display='flex' marginTop={majorScale(1)} alignItems='center'>
                <Badge
                  backgroundColor={label.color as any}
                  color={getContrastColor(label.color) as any}
                  marginRight={majorScale(1)}
                  padding={majorScale(2)}
                  lineHeight={0}
                >
                  {label.title} <b>({label.count})</b>
                </Badge>
                {label.description}
              </Pane>
            ))}
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  )
}
