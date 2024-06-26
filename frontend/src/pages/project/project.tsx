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
  StarEmptyIcon,
  StarIcon,
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
import { history } from '~/configs/history'

export const ProjectPage = () => {
  document.title = 'Danh sách dự án'
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false)
  const handleOpenModalCreateProject = () => {
    setShowCreateProjectDialog(true)
  }

  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [pagination, setPagination] = useState<IPagiantion>({ total_item: 0, total_page: 0, current_page: 0, count: 0 })
  const [page, setPage] = useState(1)
  const [favouriteProjects, setFavouriteProjects] = useState<ProjectResponse[]>([])

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

  const toggleFavourite = (project: ProjectResponse) => {
    const index = favouriteProjects.findIndex((f) => f.id === project.id)
    let newFavs = [...favouriteProjects]
    if (index === -1) {
      newFavs = [...favouriteProjects, project]
    } else {
      newFavs = favouriteProjects.filter((f) => f.id !== project.id)
    }
    setFavouriteProjects(newFavs)
    localStorage.setItem('favourites', JSON.stringify(newFavs))
  }

  useEffect(() => {
    if (currentWorkspace)
      workspaceService.allProjects({ permalink: currentWorkspace?.permalink || '', page: page }).then((data) => {
        setProjects(data.data!.items as ProjectResponse[])
        setPagination(data.data!.pagination as IPagiantion)
      })
  }, [currentWorkspace, page])

  useEffect(() => {
    const fav = localStorage.getItem('favourites')
    if (fav) {
      const favs = JSON.parse(fav) as ProjectResponse[]
      setFavouriteProjects(favs)
    }
  }, [])

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
            <Table.TextHeaderCell flexBasis={majorScale(8)} flexShrink={0} flexGrow={0}>
              Ghim
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>Dự án</Table.TextHeaderCell>
            <Table.TextHeaderCell>Trạng thái</Table.TextHeaderCell>
            <Table.TextHeaderCell>Ngày bắt đầu</Table.TextHeaderCell>
            <Table.TextHeaderCell>Ngày kết thúc</Table.TextHeaderCell>
            <Table.TextHeaderCell>Hành động</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {projects.map((project) => (
              <Table.Row key={project.id}>
                <Table.TextCell flexBasis={majorScale(8)} flexShrink={0} flexGrow={0}>
                  <IconButton
                    icon={favouriteProjects.some((f) => f.id === project.id) ? StarIcon : StarEmptyIcon}
                    appearance='minimal'
                    onClick={() => toggleFavourite(project)}
                  />
                </Table.TextCell>
                <Table.TextCell
                  cursor='pointer'
                  onClick={() => history.push(`/${currentWorkspace?.permalink}/projects/${project.permalink}`)}
                >
                  <Tooltip content='Xem chi tiết'>
                    <Pane display='flex' alignItems='center'>
                      <Avatar src={project.icon} marginRight={majorScale(1)} />
                      <span>{project.name}</span>
                    </Pane>
                  </Tooltip>
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
            Khởi tạo dự án
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
          <EditProjectSideSheet project={selectedProject} editMember={true} />
        </SideSheet>
      )}
    </Pane>
  )
}
