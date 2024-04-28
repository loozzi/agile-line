import {
  Button,
  DotIcon,
  IconButton,
  Label,
  Pane,
  Popover,
  TextInputField,
  Textarea,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { TwitterPicker } from 'react-color'
import { CreateLabelPayload, LabelResponse } from '~/models/label'
import labelService from '~/services/label.service'

interface DialogUpdateLabelProps {
  data?: LabelResponse
  workspace_id?: number
  onComplete: () => void
}

export const DialogUpdateLabel = (props: DialogUpdateLabelProps) => {
  const { data, workspace_id, onComplete } = props
  let initialValues: CreateLabelPayload
  if (!!data) {
    initialValues = useMemo(
      () => ({
        id: data?.id,
        color: data?.color,
        title: data?.title,
        description: data?.description
      }),
      []
    )
  } else {
    initialValues = useMemo(
      () => ({
        workspace_id: workspace_id,
        color: '#abb8c3',
        title: '',
        description: ''
      }),
      []
    )
  }

  const payload = useFormik({
    initialValues,
    onSubmit: async (values) => {
      if (!!data) {
        labelService.update(values).then((data) => {
          if (data.status === 200) {
            toaster.success(data.message)
            onComplete()
          } else {
            toaster.danger(data.message)
          }
        })
      } else {
        labelService.create(values).then((data) => {
          if (data.status === 200) {
            toaster.success(data.message)
            onComplete()
          } else {
            toaster.danger(data.message)
          }
        })
      }
    },
    validateOnBlur: false
  })
  return (
    <form onSubmit={payload.handleSubmit}>
      <Pane display='flex' alignItems='flex-end' marginBottom={majorScale(2)}>
        <TextInputField
          label='Tên nhãn'
          name='title'
          value={payload.values.title}
          onChange={payload.handleChange}
          onBlur={payload.handleBlur}
          placeholder='Nhập tên nhãn'
          marginBottom={0}
          flex={1}
          marginRight={majorScale(1)}
          required
        />
        <Popover content={<TwitterPicker onChangeComplete={(c) => payload.setFieldValue('color', c.hex)} />}>
          <IconButton icon={<DotIcon color={payload.values.color} size={majorScale(6)} />} type='button' />
        </Popover>
      </Pane>
      <Label>Mô tả</Label>
      <Textarea placeholder='Nhập mô tả' onChange={(e: any) => payload.setFieldValue('description', e.target.value)} />
      <Pane display='flex' justifyContent='flex-end' marginTop={majorScale(2)}>
        <Button type='submit' appearance='primary'>
          {!!data ? 'Lưu' : 'Tạo mới'}
        </Button>
      </Pane>
    </form>
  )
}
