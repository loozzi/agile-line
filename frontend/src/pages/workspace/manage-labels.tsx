import {
  Badge,
  Button,
  Dialog,
  EditIcon,
  IconButton,
  Pane,
  PlusIcon,
  Table,
  TrashIcon,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useAppSelector } from '~/app/hook'
import { DialogUpdateLabel } from '~/components/dialog_CU_label'
import { selectCurrentWorkspace } from '~/hooks/workspace/workspace.slice'
import { LabelResponse } from '~/models/label'
import labelService from '~/services/label.service'
import { getContrastColor } from '~/utils'

export const ManageLabelPage = () => {
  document.title = 'Quản lý nhãn'
  const [isShowDialog, setIsShowDialog] = useState(false)
  const [dataCreateOrEdit, setDataCreateOrEdit] = useState<LabelResponse | undefined>(undefined)
  const [labels, setLabels] = useState<LabelResponse[]>([]) // [LabelResponse]
  const [count, setCount] = useState(0)
  const [removeId, setRemoveId] = useState<number | undefined>(undefined) // [number | undefined]
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const params = useParams()

  const handleCreate = () => {
    setIsShowDialog(true)
    setDataCreateOrEdit(undefined)
  }

  const handleRemove = () => {
    labelService.remove(removeId!).then((data) => {
      if (data.status === 200) {
        setCount(count + 1)
        toaster.success(data.message)
      } else {
        toaster.danger(data.message)
      }
      setRemoveId(undefined)
    })
  }

  useEffect(() => {
    labelService.getAll({ permalink: params.permalink || '' }).then((data) => {
      if (data.status === 200) {
        setLabels(data.data || [])
      }
    })
  }, [count])

  return (
    <Pane>
      <Pane
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        marginBottom={majorScale(4)}
        paddingBottom={majorScale(4)}
        borderBottom='1px solid #ccc'
      >
        <h1
          style={{
            display: 'block'
          }}
        >
          Quản lý nhãn
        </h1>
        <Button iconBefore={<PlusIcon />} onClick={handleCreate}>
          Tạo mới
        </Button>
      </Pane>
      <Table>
        <Table.Head>
          <Table.TextHeaderCell>Tên</Table.TextHeaderCell>
          <Table.TextHeaderCell>Mô tả</Table.TextHeaderCell>
          <Table.TextHeaderCell>Thao tác</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {labels.map((label, index) => (
            <Table.Row key={index}>
              <Table.TextCell>
                <Badge backgroundColor={label.color} padding={majorScale(2)} lineHeight={0}>
                  <p style={{ color: getContrastColor(label.color) }}>{label.title}</p>
                </Badge>
              </Table.TextCell>
              <Table.TextCell>{label.description}</Table.TextCell>
              <Table.TextCell>
                <IconButton
                  icon={<EditIcon />}
                  onClick={() => {
                    setIsShowDialog(true)
                    setDataCreateOrEdit(label)
                  }}
                  marginRight={majorScale(1)}
                />
                <IconButton icon={<TrashIcon />} intent='danger' onClick={() => setRemoveId(label.id)} />
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Dialog
        isShown={isShowDialog}
        hasFooter={false}
        title={!!dataCreateOrEdit ? 'Chỉnh sửa nhãn' : 'Tạo nhãn mới'}
        onCloseComplete={() => setIsShowDialog(false)}
      >
        <DialogUpdateLabel
          data={dataCreateOrEdit}
          workspace_id={currentWorkspace?.id}
          onComplete={() => {
            setIsShowDialog(false)
            setCount(count + 1)
          }}
        />
      </Dialog>
      <Dialog
        isShown={!!removeId}
        onConfirm={handleRemove}
        title='Xác nhận xóa nhãn'
        onCancel={() => setRemoveId(undefined)}
        confirmLabel='Xóa'
        intent='danger'
        cancelLabel='Hủy bỏ'
      >
        Mọi dữ liệu liên quan sẽ bị mất. Bạn có chắc chắn muốn xóa nhãn này không?
      </Dialog>
    </Pane>
  )
}
