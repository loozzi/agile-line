import MDEditor from '@uiw/react-md-editor'
import { IconButton, Label, LinkIcon, Pane, TextInputField, majorScale, toaster } from 'evergreen-ui'
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

export const IssueDetailPage = () => {
  const params = useParams()

  const [issue, setIssue] = useState<IssueResponse | undefined>(undefined)
  const [project, setProject] = useState<ProjectResponse | undefined>(undefined)
  const [labels, setLabels] = useState<LabelResponse[]>([])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toaster.success('Đã sao chép liên kết')
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
  }, [issue])

  return (
    <Pane display='flex'>
      <Pane flex={1} marginRight={majorScale(2)}>
        <TextInputField label='Tên' value={issue?.name} inputHeight={majorScale(6)} disabled={true} />
        <div data-color-mode='light'>
          <Label>Mô tả</Label>
          <MDEditor height={200} value={issue?.description || ''} onChange={() => {}} preview='preview' />
        </div>
      </Pane>
      <Pane width={majorScale(32)}>
        <Pane display='flex' justifyContent='space-between'>
          <span>Chi tiết</span>
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
