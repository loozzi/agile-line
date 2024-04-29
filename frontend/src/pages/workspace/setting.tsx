import MDEditor from '@uiw/react-md-editor'
import {
  Button,
  Dialog,
  EditIcon,
  Label,
  Pane,
  PaneProps,
  TextInputField,
  TrashIcon,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '~/app/hook'
import { ImagePickerComp } from '~/components/image_picker/image_picker'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { GET_WORKSPACE, selectCurrentWorkspace, selectGetWorkspace } from '~/hooks/workspace/workspace.slice'
import { WorkspaceParams, WorkspaceUpdatePayload } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'

interface SettingPaneProps extends PaneProps {
  heading: string
}

export const SettingPane = (props: SettingPaneProps) => {
  const { heading, children } = props

  return (
    <Pane borderTop='1px solid #ccc' paddingY={majorScale(4)}>
      <p
        style={{
          fontSize: majorScale(3)
        }}
      >
        {heading}
      </p>
      {children}
    </Pane>
  )
}

export const WorkspaceSettingPage = () => {
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const loading = useAppSelector(selectGetWorkspace)
  const dispatch = useAppDispatch()
  const [isShownConfirmDelete, setShownConfirmDelete] = useState<boolean>(false)
  const [confirmDeleteInput, setConfirmDeleteInput] = useState<string>('')

  const onChangeImage = (value: string | undefined): void => {
    const params: WorkspaceParams = {
      permalink: currentWorkspace!.permalink
    }
    const payload: WorkspaceUpdatePayload = {
      title: currentWorkspace!.title,
      description: currentWorkspace!.description,
      is_private: currentWorkspace!.is_private,
      permalink: currentWorkspace!.permalink,
      logo: value!
    }

    workspaceService.editWorkspace(params, payload).then((data) => {
      dispatch({
        type: GET_WORKSPACE,
        payload: params
      })
      if (data.status !== 200) {
        toaster.warning('Upload image failed')
      } else {
        toaster.success('Upload image successfully')
      }
    })
  }

  const initialValues: WorkspaceUpdatePayload = {
    title: '',
    description: '',
    is_private: false,
    permalink: '',
    logo: ''
  }
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      const params: WorkspaceParams = {
        permalink: currentWorkspace!.permalink
      }

      const payload = { ...values }

      if (!payload.description) {
        payload.description = 'No description'
      }

      const _currentWp: WorkspaceUpdatePayload = {
        title: currentWorkspace!.title,
        description: currentWorkspace!.description,
        is_private: currentWorkspace!.is_private,
        permalink: currentWorkspace!.permalink,
        logo: currentWorkspace!.logo
      }

      if (JSON.stringify(values) === JSON.stringify(_currentWp)) {
        toaster.warning('No change')
        return
      }
      workspaceService.editWorkspace(params, payload).then((data) => {
        dispatch({
          type: GET_WORKSPACE,
          payload: params
        })
        if (data.status !== 200) {
          toaster.warning('Update workspace failed')
        } else {
          toaster.success('Update workspace successfully')
          if (currentWorkspace?.permalink !== values.permalink) {
            window.location.href = `/${values.permalink}/settings`
          }
        }
      })
    },
    validateOnChange: true,
    validateOnBlur: false,
    validationSchema: Yup.object({
      title: Yup.string().required().min(1),
      permalink: Yup.string().required().min(1)
    })
  })

  const onChangeDescription = (value: string | undefined) => {
    formik.setFieldValue('description', value)
  }

  const handleDeleteWorkspace = () => {
    setShownConfirmDelete(true)
  }

  const confirmDeleteWorkspace = () => {
    if (confirmDeleteInput === `delete/${currentWorkspace?.permalink}`) {
      workspaceService.deleteWorkspace({ permalink: currentWorkspace?.permalink || '' }).then((data) => {
        if (data.status === 200) {
          toaster.success(data.message)
          history.push(routes.workspace.root)
        } else {
          toaster.danger(data.message)
        }
      })
    } else {
      toaster.danger('Xác nhận sai!')
    }
  }

  useEffect(() => {
    formik.setValues({
      title: currentWorkspace?.title || '',
      description: currentWorkspace?.description || '',
      is_private: currentWorkspace?.is_private || false,
      permalink: currentWorkspace?.permalink || '',
      logo: currentWorkspace?.logo || ''
    })
  }, [currentWorkspace])

  return (
    <Pane>
      <h1>Cài đặtWorkspace</h1>
      {loading && <p>Loading...</p>}
      {!!currentWorkspace && (
        <Pane marginTop={majorScale(4)}>
          <SettingPane heading='Logo'>
            <ImagePickerComp
              onChangeImage={onChangeImage}
              src={currentWorkspace.logo}
              width={majorScale(24)}
              height={majorScale(24)}
              borderRadius={majorScale(1)}
              marginTop={majorScale(2)}
              textOverlay='Chọn logo'
            />
            <p>(Lựa chọn logo cho workspace. Logo nên có dạng hình vuông)</p>
          </SettingPane>

          <SettingPane heading='Thông tin cơ bản'>
            <form onSubmit={formik.handleSubmit}>
              <TextInputField
                label='Tên workspace'
                name='title'
                value={formik.values.title}
                onChange={formik.handleChange}
                marginBottom={majorScale(2)}
                onBlur={formik.handleBlur}
                isInvalid={!!formik.errors.title}
                validationMessage={formik.errors.title}
              />
              <TextInputField
                label='Workspace URL'
                name='permalink'
                value={formik.values.permalink}
                onChange={formik.handleChange}
                marginBottom={majorScale(2)}
                isInvalid={!!formik.errors.permalink}
                validationMessage={formik.errors.permalink}
              />
              <div data-color-mode='light'>
                <Label>Chỉnh sửa mô tả</Label>
                <MDEditor height={200} value={formik.values.description} onChange={onChangeDescription} />
              </div>
              <Button
                appearance='primary'
                iconBefore={<EditIcon />}
                marginTop={majorScale(2)}
                height={majorScale(5)}
                type='submit'
              >
                Chỉnh sửa
              </Button>
            </form>
          </SettingPane>
          <SettingPane heading='Xóa worksapce'>
            <p
              style={{
                fontSize: majorScale(2),
                marginTop: majorScale(2),
                marginBottom: majorScale(2)
              }}
            >
              Nếu bạn muốn xóa vĩnh viễn không gian làm việc và tất cả dữ liệu của nó bao gồm các project và issue, bạn
              có thể thực hiện với nút bên dưới
            </p>
            <Button intent='danger' height={majorScale(5)} iconBefore={<TrashIcon />} onClick={handleDeleteWorkspace}>
              Xóa workspace
            </Button>
          </SettingPane>
        </Pane>
      )}
      <Dialog
        title='Xác nhận xóa workspace'
        intent='danger'
        isShown={isShownConfirmDelete}
        confirmLabel='Xóa'
        cancelLabel='Hủy bỏ'
        onConfirm={confirmDeleteWorkspace}
        onCloseComplete={() => {
          setShownConfirmDelete(false)
        }}
      >
        Nhập{' '}
        <b>
          <i>delete/{currentWorkspace?.permalink}</i>
        </b>{' '}
        để xác nhận xóa workspace
        <TextInputField
          onChange={(e: any) => setConfirmDeleteInput(e.target.value)}
          value={confirmDeleteInput}
          placeholder='Nhập thông tin'
        />
      </Dialog>
    </Pane>
  )
}
