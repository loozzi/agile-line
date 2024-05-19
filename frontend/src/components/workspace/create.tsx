import MDEditor from '@uiw/react-md-editor'
import { Button, Combobox, CrossIcon, Label, Pane, PlusIcon, TextInputField, majorScale, toaster } from 'evergreen-ui'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { Workspace, WorkspaceCreatePayload } from '~/models/workspace'
import { ImageUploaderComp } from '../image_uploader'
// No import is required in the WebPack.
import '@uiw/react-md-editor/markdown-editor.css'
// No import is required in the WebPack.
import '@uiw/react-markdown-preview/markdown.css'
import workspaceService from '~/services/workspace.service'

interface WorkspaceCreateProps {
  onCreateSuccess: (item: Workspace) => void
  onClose: () => void
}

export const WorkspaceCreate = (props: WorkspaceCreateProps) => {
  const { onCreateSuccess, onClose } = props

  const initialValues: WorkspaceCreatePayload = useMemo(
    () => ({
      title: '',
      logo: '',
      description: '',
      is_private: false
    }),
    []
  )

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required().min(6)
    }),
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      const payload: WorkspaceCreatePayload = { ...values }
      if (!payload.description) {
        payload.description = 'No description'
      }
      workspaceService.createWorkspace(payload).then((res) => {
        if (res.status === 200) {
          onClose()
          formik.resetForm()
          toaster.success(res.message)
          onCreateSuccess(res.data!)
        } else {
          toaster.danger(res.message)
        }
      })
    }
  })

  const onChangeDescription = (value: string | undefined) => {
    formik.setFieldValue('description', value)
  }

  const onChangeLogo = (value: string | undefined) => {
    formik.setFieldValue('logo', value)
  }

  const onChangePrivacy = (value: string | undefined) => {
    formik.setFieldValue('is_private', value === 'Riêng tư')
  }

  return (
    <form onSubmit={formik.handleSubmit} style={{ marginTop: majorScale(2), marginBottom: majorScale(2) }}>
      <TextInputField
        inputHeight={majorScale(5)}
        name='title'
        placeholder='Tiêu đề'
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.title}
        isInvalid={!!formik.errors.title}
        validationMessage={formik.errors.title}
        label='Thêm tiêu đề'
      />

      <div>
        <Label marginBottom={majorScale(1)} display='block'>
          Thêm mô tả
        </Label>
        <MDEditor
          data-color-mode='light'
          height={200}
          value={formik.values.description}
          onChange={onChangeDescription}
        />
      </div>
      <ImageUploaderComp
        label='Biểu tượng / Icon'
        description='Tải lên 1 tệp hình ảnh biểu tượng. File nhỏ hơn 5 MB.'
        maxSizeInBytes={5 * 1024 ** 2}
        marginTop={majorScale(2)}
        onChangeLogo={onChangeLogo}
      />

      <Pane display='flex' alignItems='flex-end' justifyContent='space-between'>
        <Pane>
          <Label marginBottom={majorScale(1)} display='block'>
            Quyền riêng tư
          </Label>
          <Combobox
            initialSelectedItem={formik.values.is_private ? 'Riêng tư' : 'Công khai'}
            openOnFocus
            items={['Công khai', 'Riêng tư']}
            onChange={(selected) => {
              onChangePrivacy(selected)
            }}
            placeholder='Quyền riêng tư'
          />
        </Pane>
        <Pane>
          <Button
            iconBefore={<PlusIcon />}
            marginRight={majorScale(1)}
            intent='success'
            appearance='primary'
            type='submit'
          >
            Tạo workspace
          </Button>
          <Button type='button' intent='danger' iconBefore={<CrossIcon />} onClick={onClose}>
            Hủy
          </Button>
        </Pane>
      </Pane>
    </form>
  )
}
