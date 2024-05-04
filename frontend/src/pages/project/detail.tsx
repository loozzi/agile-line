import { Button, Dialog, Image, Pane, Tab, Tablist, TextInputField, majorScale, toaster } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { EditMemberComp } from '~/components/edit-member'
import { ListIssueComp } from '~/components/project/issue_list'
import { history } from '~/configs/history'
import { ProjectResponse } from '~/models/project'
import projectService from '~/services/project.service'
import { EditProjectSideSheet } from './edit-project'

const ProjectDetailPage = () => {
  const [project, setProject] = useState<ProjectResponse | undefined>(undefined)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tabs] = useState(['Công việc', 'Thành viên', 'Thông tin'])
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const params = useParams()

  const handleDeleteProject = () => {
    projectService.deleteProject(project?.permalink || '', confirmPassword).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
        setConfirmDialog(false)
        history.push(`/workspace/${params.permalink}`)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  useEffect(() => {
    projectService.get(params.projectPermalink || '').then((data) => {
      setProject(data.data)
    })
  }, [params])

  return (
    <Pane>
      <Pane display='flex' alignItems='center' paddingBottom={majorScale(2)} borderBottom='1px solid #ccc'>
        <Image
          src={project?.icon}
          width={majorScale(10)}
          height={majorScale(10)}
          borderRadius={majorScale(1)}
          marginRight={majorScale(1)}
        />
        <span
          style={{
            fontSize: majorScale(4)
          }}
        >
          {project?.name}
        </span>
      </Pane>
      <Tablist marginTop={majorScale(2)} marginBottom={16} flexBasis={240} marginRight={24}>
        {tabs.map((tab, index) => (
          <Tab
            aria-controls={`panel-${tab}`}
            isSelected={index === selectedIndex}
            key={tab}
            onSelect={() => setSelectedIndex(index)}
          >
            {tab}
          </Tab>
        ))}
      </Tablist>
      <Pane padding={16} background='tint1' flex='1' borderRadius={majorScale(1)}>
        {tabs.map((tab, index) => (
          <Pane
            aria-labelledby={tab}
            aria-hidden={index !== selectedIndex}
            display={index === selectedIndex ? 'block' : 'none'}
            key={tab}
            role='tabpanel'
          >
            {tab === 'Công việc' && project && <ListIssueComp project_id={project.id} />}
            {tab === 'Thành viên' && project && (
              <EditMemberComp
                members={project.members}
                permalink={project.permalink}
                onUpdateSuccess={(data) => setProject(data)}
              />
            )}
            {tab === 'Thông tin' && project && (
              <Pane>
                <EditProjectSideSheet project={project} />
                <Pane
                  borderTop='1px solid #ccc'
                  paddingY={majorScale(4)}
                  paddingX={majorScale(2)}
                  display='flex'
                  justifyContent='flex-end'
                >
                  <Button intent='danger' appearance='primary' onClick={() => setConfirmDialog(true)}>
                    Xóa dự án
                  </Button>
                </Pane>
              </Pane>
            )}
          </Pane>
        ))}
      </Pane>
      <Dialog
        isShown={confirmDialog}
        onCloseComplete={() => setConfirmDialog(false)}
        hasHeader={false}
        confirmLabel='Xác nhận'
        cancelLabel='Hủy'
        intent='danger'
        onConfirm={handleDeleteProject}
      >
        <TextInputField
          marginTop={majorScale(8)}
          label='Nhập mật khẩu để xác nhận xóa'
          placeholder='Mật khẩu'
          type='password'
          value={confirmPassword}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
        />
      </Dialog>
    </Pane>
  )
}

export default ProjectDetailPage
