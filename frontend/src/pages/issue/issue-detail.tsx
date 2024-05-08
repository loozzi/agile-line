import MDEditor from '@uiw/react-md-editor'
import { Badge, Button, IconButton, Label, LinkIcon, Pane, TextInputField, majorScale, toaster } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { IssuePropertyComp } from '~/components/issue/property'
import { IssueResponse } from '~/models/issue'
import { LabelResponse } from '~/models/label'
import { ProjectResponse } from '~/models/project'
import { WorkspaceParams } from '~/models/workspace'
import issueService from '~/services/issue.service'
import labelService from '~/services/label.service'
import projectService from '~/services/project.service'
import { convertTimestamp } from '~/utils'
import { IssueActivityComp } from './issue-activity'

export const IssueDetailPage = () => {
  const params = useParams()

  const [issue, setIssue] = useState<IssueResponse | undefined>(undefined)
  const [project, setProject] = useState<ProjectResponse | undefined>(undefined)
  const [labels, setLabels] = useState<LabelResponse[]>([])

  const [name, setName] = useState<string>('')
  const [editName, setEditName] = useState<boolean>(false)

  const [description, setDescription] = useState<string>('')
  const [editDescription, setEditDescription] = useState<boolean>(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toaster.success('Đã sao chép liên kết')
  }

  const handleChangeName = () => {
    if (name === '') {
      toaster.warning('Tên công việc không được để trống')
      return
    }

    issueService.update(params.issuePermalink || '', { name, description: issue?.description }).then((data) => {
      setEditName(false)
      if (data.status === 200) onUpdateSuccess(data.data!)
      else toaster.danger(data.message || 'Có lỗi xảy ra')
    })
  }

  const handleChangeDescription = () => {
    if (description === '') {
      toaster.warning('Mô tả không được để trống')
      return
    }

    issueService.update(params.issuePermalink || '', { name: issue?.name, description }).then((data) => {
      setEditDescription(false)
      if (data.status === 200) onUpdateSuccess(data.data!)
      else toaster.danger(data.message || 'Có lỗi xảy ra')
    })
  }

  const onUpdateSuccess = (issue: IssueResponse) => {
    setIssue(issue)
  }

  useEffect(() => {
    issueService.getDetail(params.issuePermalink || '').then((data) => {
      setIssue(data.data)
    })
  }, [])

  useEffect(() => {
    const _params: WorkspaceParams = {
      permalink: params.permalink || '',
      limit: 100
    }

    if (issue)
      projectService.get(issue?.project.permalink || '').then((data) => {
        setProject(data.data)
      })

    labelService.getAll(_params).then((data) => {
      setLabels(data.data || [])
    })

    setName(issue?.name || '')
  }, [issue])

  return (
    <Pane display='flex'>
      <Pane flex={1} marginRight={majorScale(2)}>
        {editName && (
          <Pane display='flex' alignItems='flex-end' justifyContent='space-between' marginTop={majorScale(1)}>
            <TextInputField
              label=''
              placeholder='Nhập tên công việc'
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              inputHeight={majorScale(4)}
              marginBottom={0}
              flex={1}
              marginRight={majorScale(2)}
            />
            <Pane>
              <Button onClick={handleChangeName}>Lưu thay đổi</Button>
              <Button
                marginLeft={majorScale(1)}
                appearance='minimal'
                onClick={() => {
                  setEditName(false)
                  setName(issue?.name || '')
                }}
              >
                Hủy
              </Button>
            </Pane>
          </Pane>
        )}
        {!editName && (
          <Pane display='flex' alignItems='flex-end' justifyContent='space-between'>
            <span
              style={{
                fontSize: majorScale(4),
                fontWeight: 500
              }}
            >
              {name}
            </span>
            <Button appearance='minimal' onClick={() => setEditName(true)}>
              Sửa
            </Button>
          </Pane>
        )}
        <Pane marginY={majorScale(2)}>
          <Badge color='blue' lineHeight={0} padding={majorScale(2)} marginRight={majorScale(1)}>
            {issue?.status}
          </Badge>
          <span>
            <b>{issue?.assignor.username}</b> đã mở {convertTimestamp(issue?.created_at || '')} •{' '}
            {issue?.activities?.filter((activity) => activity.action === 'comment').length || 0} bình luận
          </span>
        </Pane>
        <div data-color-mode='light'>
          <Label>Mô tả</Label>
          <MDEditor
            height={200}
            value={description}
            onChange={(value) => {
              setDescription(value || '')
            }}
            preview={editDescription ? 'live' : 'preview'}
          />
          {editDescription ? (
            <Pane marginTop={majorScale(1)}>
              <Button
                marginRight={majorScale(1)}
                onClick={() => {
                  setEditDescription(false)
                  setDescription(issue?.description || '')
                }}
                intent='danger'
              >
                Hủy
              </Button>
              <Button intent='success' onClick={handleChangeDescription}>
                Lưu
              </Button>
            </Pane>
          ) : (
            <Button marginTop={majorScale(1)} onClick={() => setEditDescription(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>
        {!!issue && <IssueActivityComp issue_id={issue.id} />}
      </Pane>
      <Pane width={majorScale(32)}>
        <Pane display='flex' justifyContent='space-between' alignItems='center'>
          <Label>Chi tiết</Label>
          <Pane>
            <IconButton appearance='minimal' icon={<LinkIcon />} onClick={handleCopyLink} />
          </Pane>
        </Pane>
        <Pane marginTop={majorScale(4)}>
          {issue && project && labels && (
            <IssuePropertyComp issue={issue} project={project} labels={labels} onUpdateSuccess={onUpdateSuccess} />
          )}
        </Pane>
      </Pane>
    </Pane>
  )
}
