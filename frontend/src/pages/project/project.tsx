import {
  Avatar,
  Badge,
  Button,
  ChevronRightIcon,
  Dialog,
  EditIcon,
  IconButton,
  Pagination,
  Pane,
  PlusIcon,
  SelectField,
  SideSheet,
  Table,
  Tooltip,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useAppSelector } from '~/app/hook'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { ProjectResponse, ProjectStatus } from '~/models/project'
import { Pagination as IPagiantion } from '~/models/utils'
import projectService from '~/services/project.service'
import workspaceService from '~/services/workspace.service'
import { reformatDate } from '~/utils'
import { CreateProjectDialog } from './create-project'
import { EditProjectSideSheet } from './edit-project'

export const ProjectPage = () => {
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false)
  const handleOpenModalCreateProject = () => {
    setShowCreateProjectDialog(true)
  }

  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [pagination, setPagination] = useState<IPagiantion>({ total_item: 0, total_page: 0, current_page: 0, count: 0 })
  const [page, setPage] = useState(1)

  const [selectedProject, setSelectedProject] = useState<ProjectResponse | undefined>(undefined)

  const options = [
    { label: 'Tồn đọng', value: 'backlog' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đang thực hiện', value: 'inprogress' },
    { label: 'Đã hủy', value: 'canceled' },
    { label: 'Tạm dừng', value: 'paused' },
    { label: 'Đã kế hoạch', value: 'planned' }
  ]

  const handleChangeStatus = (status: ProjectStatus, project_permalink: string) => {
    projectService.updateStatus(project_permalink, status).then((data) => {
      if (data.status === 200) {
        toaster.success(data.message)
      } else {
        toaster.danger(data.message)
      }
    })
  }

  useEffect(() => {
    if (currentWorkspace)
      workspaceService.allProjects({ permalink: currentWorkspace?.permalink || '', page: page }).then((data) => {
        setProjects(data.data!.items as ProjectResponse[])
        setPagination(data.data!.pagination as IPagiantion)
      })
  }, [currentWorkspace, page])

  return (
    <Pane>
      <Pane borderBottom='solid 1px #ccc' paddingBottom={majorScale(2)} display='flex' justifyContent='space-between'>
        <Badge color='blue' padding={majorScale(2)} lineHeight={0}>
          Danh sách dự án
        </Badge>
        <Tooltip content='Tạo dự án mới'>
          <Button intent='success' iconBefore={<PlusIcon />} onClick={handleOpenModalCreateProject}>
            Tạo dự án
          </Button>
        </Tooltip>
      </Pane>
      <Pane paddingY={majorScale(2)}>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>ID</Table.TextHeaderCell>
            <Table.TextHeaderCell>Dự án</Table.TextHeaderCell>
            <Table.TextHeaderCell>Trạng thái</Table.TextHeaderCell>
            <Table.TextHeaderCell>Ngày bắt đầu</Table.TextHeaderCell>
            <Table.TextHeaderCell>Ngày kết thúc</Table.TextHeaderCell>
            <Table.TextHeaderCell>Chỉnh sửa</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {projects.map((project) => (
              <Table.Row key={project.id}>
                <Table.TextCell>{project.id}</Table.TextCell>
                <Table.TextCell>
                  <Pane display='flex' alignItems='center'>
                    <Avatar src={project.icon} marginRight={majorScale(1)} />
                    <span>{project.name}</span>
                  </Pane>
                </Table.TextCell>
                <Table.TextCell>
                  <SelectField
                    defaultValue={project.status}
                    onChange={(e) => handleChangeStatus(e.target.value as ProjectStatus, project.permalink)}
                  >
                    {options.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </SelectField>
                </Table.TextCell>
                <Table.TextCell>{reformatDate(project.start_date)}</Table.TextCell>
                <Table.TextCell>{reformatDate(project.end_date)}</Table.TextCell>
                <Table.TextCell>
                  <IconButton icon={<EditIcon />} onClick={() => setSelectedProject(project)} />
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Pagination
          marginTop={majorScale(2)}
          display='flex'
          justifyContent='center'
          totalPages={pagination.total_page}
          page={pagination.current_page}
          onPageChange={(page) => setPage(page)}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
        />
      </Pane>
      <Dialog
        isShown={showCreateProjectDialog}
        title={
          <Pane display='flex' alignItems='center'>
            <Pane
              lineHeight={0}
              textTransform='uppercase'
              display='flex'
              alignItems='center'
              borderRadius={majorScale(1)}
              marginRight={majorScale(1)}
              overflow='hidden'
              border='solid 1px #ccc'
              padding={majorScale(1)}
              cursor='pointer'
              onClick={() => setShowCreateProjectDialog(false)}
            >
              <Avatar src={currentWorkspace?.logo} marginRight={majorScale(1)} />
              {currentWorkspace?.title}
            </Pane>
            <ChevronRightIcon />
            Tạo Project
          </Pane>
        }
        onCloseComplete={() => setShowCreateProjectDialog(false)}
        hasFooter={false}
        width={majorScale(120)}
      >
        <CreateProjectDialog closeDialog={() => setShowCreateProjectDialog(false)} />
      </Dialog>
      {selectedProject && (
        <SideSheet isShown={!!selectedProject} onCloseComplete={() => setSelectedProject(undefined)}>
          <EditProjectSideSheet project={selectedProject} />
        </SideSheet>
      )}
    </Pane>
  )
}
