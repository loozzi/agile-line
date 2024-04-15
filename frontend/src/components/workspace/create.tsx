import { Pane, majorScale, Button, PlusIcon, CrossIcon, TextInputField } from 'evergreen-ui'
import { useFormik } from 'formik'
import { Fragment, useMemo, useState } from 'react'
import { WorkspaceCreatePayload } from '~/models/workspace'
import * as Yup from 'yup'
import { ImageUploaderComp } from '../image_uploader'
import MDEditor from '@uiw/react-md-editor'
// No import is required in the WebPack.
import '@uiw/react-md-editor/markdown-editor.css'
// No import is required in the WebPack.
import '@uiw/react-markdown-preview/markdown.css'

export const WorkspaceCreate = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const onToggleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm)
  }

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
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log(values)
    }
  })

  const onChangeDescription = (value: string | undefined) => {
    formik.setFieldValue('description', value)
  }

  return (
    <form onSubmit={formik.handleSubmit} style={{ marginTop: majorScale(2), marginBottom: majorScale(2) }}>
      {showCreateForm && (
        <Fragment>
          <hr
            style={{
              marginTop: majorScale(2),
              marginBottom: majorScale(2)
            }}
          />
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

          <h5>Thêm mô tả</h5>
          <MDEditor height={200} value={formik.values.description} onChange={onChangeDescription} />

          <ImageUploaderComp
            label='Biểu tượng / Icon'
            description='Tải lên 1 tệp hình ảnh biểu tượng. File nhỏ hơn 5 MB.'
            maxSizeInBytes={5 * 1024 ** 2}
            marginTop={majorScale(2)}
          />
        </Fragment>
      )}
      <Pane>
        {showCreateForm ? (
          <Button iconBefore={<PlusIcon />} intent='success' appearance='primary' type='submit'>
            Tạo workspace
          </Button>
        ) : (
          <Button iconBefore={<PlusIcon />} intent='success' onClick={onToggleShowCreateForm} type='button'>
            Tạo mới
          </Button>
        )}
        {showCreateForm && (
          <Button
            type='button'
            intent='danger'
            iconBefore={<CrossIcon />}
            marginLeft={majorScale(2)}
            onClick={onToggleShowCreateForm}
          >
            Hủy
          </Button>
        )}
      </Pane>
    </form>
  )
}
