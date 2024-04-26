import {
  Badge,
  Button,
  ChevronRightIcon,
  Dialog,
  Group,
  IconButton,
  Image,
  Pane,
  PlusIcon,
  Table,
  Tooltip,
  majorScale
} from 'evergreen-ui'
import { useMemo, useState } from 'react'
import { useAppSelector } from '~/app/hook'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { CreateProjectDialog } from './create-project'

export const ProjectPage = () => {
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false)
  const handleOpenModalCreateProject = () => {
    setShowCreateProjectDialog(true)
  }

  const [selectedValueFilter, setSelectedValueFilter] = useState('all')
  const filterOptions = useMemo(
    () => [
      { label: 'Tất cả', value: 'all' },
      { label: 'Tồn đọng', value: 'backlog' },
      { label: 'Hoàn thành', value: 'completed' },
      { label: 'Đang thực hiện', value: 'inprogress' },
      { label: 'Đã hủy', value: 'canceled' },
      { label: 'Tạm dừng', value: 'paused' },
      { label: 'Đã kế hoạch', value: 'planned' }
    ],
    []
  )

  return (
    <Pane>
      <Pane borderBottom='solid 1px #ccc' paddingBottom={majorScale(2)} display='flex' justifyContent='space-between'>
        <Badge color='blue' padding={majorScale(2)} lineHeight={0}>
          Danh sách Project
        </Badge>
        <Tooltip content='Tạo project'>
          <IconButton icon={<PlusIcon />} onClick={handleOpenModalCreateProject} />
        </Tooltip>
      </Pane>
      <Pane paddingY={majorScale(2)} borderBottom='solid 1px #ccc'>
        <Group>
          {filterOptions.map(({ label, value }) => (
            <Button
              key={label}
              isActive={selectedValueFilter === value}
              onClick={() => setSelectedValueFilter(value)}
              backgroundColor={'#FDF4F4'}
            >
              {label}
            </Button>
          ))}
        </Group>
      </Pane>
      <Pane paddingY={majorScale(2)}>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>Project</Table.TextHeaderCell>
            <Table.TextHeaderCell>Status</Table.TextHeaderCell>
            <Table.TextHeaderCell>Roles</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.TextCell>Project 1</Table.TextCell>
              <Table.TextCell>Hoàn thành</Table.TextCell>
              <Table.TextCell>Admin</Table.TextCell>
            </Table.Row>
            <Table.Row>
              <Table.TextCell>Project 2</Table.TextCell>
              <Table.TextCell>Đang thực hiện</Table.TextCell>
              <Table.TextCell>Admin</Table.TextCell>
            </Table.Row>
            <Table.Row>
              <Table.TextCell>Project 3</Table.TextCell>
              <Table.TextCell>Hoàn thành</Table.TextCell>
              <Table.TextCell>Admin</Table.TextCell>
            </Table.Row>
          </Table.Body>
        </Table>
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
              <Image
                src={currentWorkspace?.logo}
                width={majorScale(3)}
                height={majorScale(3)}
                borderRadius={majorScale(1)}
                marginRight={majorScale(1)}
              />
              {currentWorkspace?.title}
            </Pane>
            <ChevronRightIcon />
            Tạo Project
          </Pane>
        }
        onCloseComplete={() => setShowCreateProjectDialog(false)}
        confirmLabel='Tạo project'
        width={majorScale(120)}
      >
        <CreateProjectDialog />
      </Dialog>
    </Pane>
  )
}
