import MDEditor from '@uiw/react-md-editor'
import {
  Button,
  Dialog,
  Label,
  LockIcon,
  Pane,
  SavedIcon,
  SendMessageIcon,
  TextInputField,
  majorScale,
  toaster
} from 'evergreen-ui'
import { useFormik } from 'formik'
import { Fragment, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import imgs from '~/assets/imgs'
import { ImagePickerComp } from '~/components/image_picker/image_picker'
import { UserDetail, UserUpdateEmailPayload, UserUpdateInfoPayload, UserUpdatePasswordPayload } from '~/models/user'
import tokenService from '~/services/token.service'
import userService from '~/services/user.service'

export const UserProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<UserDetail | undefined>(undefined)
  const [isShowDialog, setIsShowDialog] = useState(false)
  const [typeDialog, setTypeDialog] = useState<'info' | 'email' | 'password' | undefined>(undefined)
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(undefined)

  const onChangeImage = (value: string | undefined): void => {
    updateInfoFormik.setFieldValue('avatar', value)
    setCurrentAvatar(value)
    console.log(value)
  }

  const initialUpdateInfoValues: UserUpdateInfoPayload = useMemo(
    () => ({
      first_name: '',
      last_name: '',
      phone_number: '',
      username: '',
      avatar: '',
      description: '',
      password: ''
    }),
    []
  )

  const updateInfoFormik = useFormik({
    initialValues: initialUpdateInfoValues,
    onSubmit: (values) => {
      console.log(values)
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required().min(1),
      last_name: Yup.string().required().min(1),
      phone_number: Yup.string().required().min(10),
      username: Yup.string()
        .required()
        .matches(/^[A-Za-z0-9]+$/, 'Only letters from A-Z and numbers allowed')
        .min(6)
    }),
    validateOnChange: false,
    validateOnBlur: false
  })

  const initialUpdateEmailValues: UserUpdateEmailPayload = useMemo(
    () => ({
      email: '',
      password: ''
    }),
    []
  )

  const updateEmailFormik = useFormik({
    initialValues: initialUpdateEmailValues,
    onSubmit: (values) => {
      console.log(values)
    },
    validationSchema: Yup.object({
      email: Yup.string().required().email()
    }),
    validateOnChange: false,
    validateOnBlur: false
  })

  const initialUpdatePasswordValues: UserUpdatePasswordPayload = useMemo(
    () => ({
      password: '',
      new_password: ''
    }),
    []
  )

  const updatePasswordFormik = useFormik({
    initialValues: initialUpdatePasswordValues,
    onSubmit: (values) => {
      console.log(values)
    },
    validationSchema: Yup.object({
      password: Yup.string().required().min(6),
      new_password: Yup.string().required().min(6)
    }),
    validateOnChange: true,
    validateOnBlur: false
  })

  const onChangeDescription = (value: string | undefined) => {
    updateInfoFormik.setFieldValue('description', value)
  }

  const toggleShowComfirmDialog = (type?: 'info' | 'email' | 'password') => {
    setIsShowDialog(!isShowDialog)
    setTypeDialog(type)
  }

  const handleConfirmDialog = () => {
    const updateInfo = (payload: UserUpdateInfoPayload): void => {
      const _payload = { ...payload }
      if (currentUser?.username === payload.username) {
        _payload.username = ''
      }
      userService.updateUser(_payload).then((data) => {
        if (data.status === 200) {
          toaster.success(data.message)
          setIsShowDialog(false)
        } else {
          toaster.danger(data.message)
        }
      })
    }

    const updateEmail = (payload: UserUpdateEmailPayload): void => {
      userService.changeEmail(payload).then((data) => {
        if (data.status === 200) {
          toaster.success(data.message)
          tokenService.setAccessToken(data.data?.access_token ?? '')
          tokenService.setRefreshToken(data.data?.refresh_token ?? '')

          setIsShowDialog(false)
          toaster.success(data.message)
        } else {
          toaster.danger(data.message)
        }
      })
    }

    const updatePassword = (payload: UserUpdatePasswordPayload): void => {
      userService.changePassword(payload).then((data) => {
        if (data.status === 200) {
          toaster.success(data.message)
          setIsShowDialog(false)
        } else {
          toaster.danger(data.message)
        }
      })
    }

    switch (typeDialog) {
      case 'info':
        updateInfo(updateInfoFormik.values)
        updateEmailFormik.setFieldValue('password', '')
        break
      case 'email':
        updateEmail(updateEmailFormik.values)
        updateEmailFormik.setFieldValue('password', '')
        break
      case 'password':
        updatePassword(updatePasswordFormik.values)
        updatePasswordFormik.setFieldValue('password', '')
        updatePasswordFormik.setFieldValue('new_password', '')
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (currentUser) {
      updateInfoFormik.setValues({
        first_name: currentUser.first_name ?? '',
        last_name: currentUser.last_name ?? '',
        phone_number: currentUser.phone_number ?? '',
        username: currentUser.username,
        avatar: currentUser.avatar ?? '',
        description: currentUser.description ?? '',
        password: ''
      })
      updateEmailFormik.setValues({
        email: currentUser.email,
        password: ''
      })
      setCurrentAvatar(currentUser.avatar ?? '')
    }
  }, [currentUser])

  useEffect(() => {
    userService.getUser().then((data) => {
      if (data.status === 200) {
        setCurrentUser(data.data)
      } else {
        toaster.danger('Lỗi khi lấy thông tin người dùng')
      }
    })
  }, [])

  return (
    <Pane display='flex' justifyContent='center'>
      <Pane
        maxWidth={majorScale(92)}
        width='100%'
        margin={majorScale(2)}
        marginBottom={0}
        display='flex'
        flexDirection='column'
        alignItems='flex-start'
      >
        <h3>Thông tin cá nhân</h3>
        <Pane
          display='flex'
          flexDirection='column'
          width='100%'
          border='1px solid #EBF0FF'
          borderRadius={majorScale(2)}
          overflow='hidden'
        >
          <Pane padding={majorScale(4)} backgroundColor='#F9FAFC' width='100%' display='flex' flexDirection='column'>
            <Label fontSize={majorScale(3)} fontWeight='300'>
              Ảnh đại diện
            </Label>
            <ImagePickerComp
              src={!!currentAvatar ? currentAvatar : imgs.blank_avatar}
              onChangeImage={onChangeImage}
              width={majorScale(24)}
              height={majorScale(24)}
              borderRadius={majorScale(12)}
              marginTop={majorScale(2)}
              textOverlay='Thay avatar'
              alignSelf='center'
            />
          </Pane>
          <form
            onSubmit={updateInfoFormik.handleSubmit}
            style={{ padding: majorScale(3), display: 'flex', flexDirection: 'column' }}
          >
            <Label fontSize={majorScale(3)} fontWeight='300'>
              Thông tin cá nhân
            </Label>
            <Pane display='flex' justifyContent='space-between' marginTop={majorScale(2)}>
              <TextInputField
                inputHeight={majorScale(5)}
                inputWidth={majorScale(36)}
                maxWidth={majorScale(36)}
                name='username'
                placeholder='Username'
                value={updateInfoFormik.values.username}
                onChange={updateInfoFormik.handleChange}
                onBlur={updateInfoFormik.handleBlur}
                isInvalid={!!updateInfoFormik.errors.username}
                validationMessage={updateInfoFormik.errors.username}
                label='Username'
                flex='1'
              />
              <TextInputField
                inputHeight={majorScale(5)}
                inputWidth={majorScale(36)}
                maxWidth={majorScale(36)}
                name='phone_number'
                placeholder='Số điện thoại'
                value={updateInfoFormik.values.phone_number}
                onChange={updateInfoFormik.handleChange}
                onBlur={updateInfoFormik.handleBlur}
                isInvalid={!!updateInfoFormik.errors.phone_number}
                validationMessage={updateInfoFormik.errors.phone_number}
                label='Số điện thoại'
                flex='1'
              />
            </Pane>
            <Pane display='flex' justifyContent='space-between'>
              <TextInputField
                inputHeight={majorScale(5)}
                inputWidth={majorScale(36)}
                maxWidth={majorScale(36)}
                name='first_name'
                placeholder='Họ và tên đệm'
                value={updateInfoFormik.values.first_name}
                onChange={updateInfoFormik.handleChange}
                onBlur={updateInfoFormik.handleBlur}
                isInvalid={!!updateInfoFormik.errors.first_name}
                validationMessage={updateInfoFormik.errors.first_name}
                label='Họ và tên đệm'
              />
              <TextInputField
                inputHeight={majorScale(5)}
                inputWidth={majorScale(36)}
                maxWidth={majorScale(36)}
                name='last_name'
                placeholder='Tên'
                value={updateInfoFormik.values.last_name}
                onChange={updateInfoFormik.handleChange}
                onBlur={updateInfoFormik.handleBlur}
                isInvalid={!!updateInfoFormik.errors.last_name}
                validationMessage={updateInfoFormik.errors.last_name}
                label='Tên'
              />
            </Pane>
            <div data-color-mode='light'>
              <Label>Thêm mô tả</Label>
              <MDEditor height={200} value={updateInfoFormik.values.description} onChange={onChangeDescription} />
            </div>
            <Pane marginTop={majorScale(4)}>
              <Button
                alignSelf='flex-start'
                type='button'
                appearance='primary'
                iconBefore={<SavedIcon />}
                onClick={() => {
                  toggleShowComfirmDialog('info')
                }}
                marginRight={majorScale(2)}
              >
                Chỉnh sửa thông tin
              </Button>
              <Button
                alignSelf='flex-start'
                type='button'
                appearance='primary'
                intent='success'
                iconBefore={<SendMessageIcon />}
                onClick={() => {
                  toggleShowComfirmDialog('email')
                }}
                marginRight={majorScale(2)}
              >
                Đổi email
              </Button>
              <Button
                alignSelf='flex-start'
                type='button'
                intent='danger'
                appearance='primary'
                iconBefore={<LockIcon />}
                onClick={() => {
                  toggleShowComfirmDialog('password')
                }}
              >
                Đổi mật khẩu
              </Button>
            </Pane>
          </form>
        </Pane>
      </Pane>
      <Dialog
        isShown={isShowDialog}
        title={
          typeDialog === 'info' ? 'Xác nhận mật khẩu' : typeDialog === 'email' ? 'Thay đổi email' : 'Thay đổi mật khẩu'
        }
        intent='warning'
        onCloseComplete={() => {
          setIsShowDialog(false)
        }}
        onConfirm={handleConfirmDialog}
        confirmLabel='Xác nhận'
        cancelLabel='Hủy'
      >
        {typeDialog === 'email' && (
          <Fragment>
            <TextInputField
              inputHeight={majorScale(5)}
              placeholder='Email mới'
              type='email'
              name='email'
              onChange={updateEmailFormik.handleChange}
              onBlur={updateEmailFormik.handleBlur}
              value={updateEmailFormik.values.email}
              isInvalid={!!updateEmailFormik.errors.email}
              validationMessage={updateEmailFormik.errors.email}
              label=''
            />
            <TextInputField
              inputHeight={majorScale(5)}
              placeholder='Xác nhận mật khẩu'
              type='password'
              name='password'
              onChange={updateEmailFormik.handleChange}
              onBlur={updateEmailFormik.handleBlur}
              value={updateEmailFormik.values.password}
              isInvalid={!!updateEmailFormik.errors.password}
              validationMessage={updateEmailFormik.errors.password}
              label=''
            />
          </Fragment>
        )}
        {typeDialog === 'password' && (
          <Fragment>
            <TextInputField
              inputHeight={majorScale(5)}
              placeholder='Mật khẩu mới'
              type='password'
              name='new_password'
              onChange={updatePasswordFormik.handleChange}
              onBlur={updatePasswordFormik.handleBlur}
              value={updatePasswordFormik.values.new_password}
              isInvalid={!!updatePasswordFormik.errors.new_password}
              validationMessage={updatePasswordFormik.errors.new_password}
              label=''
            />
            <TextInputField
              inputHeight={majorScale(5)}
              placeholder='Xác nhận mật khẩu'
              type='password'
              name='password'
              onChange={updatePasswordFormik.handleChange}
              onBlur={updatePasswordFormik.handleBlur}
              value={updatePasswordFormik.values.password}
              isInvalid={!!updatePasswordFormik.errors.password}
              validationMessage={updatePasswordFormik.errors.password}
              label=''
            />
          </Fragment>
        )}
        {typeDialog === 'info' && (
          <TextInputField
            inputHeight={majorScale(5)}
            placeholder='Xác nhận mật khẩu'
            type='password'
            name='password'
            onChange={updateInfoFormik.handleChange}
            onBlur={updateInfoFormik.handleBlur}
            value={updateInfoFormik.values.password}
            isInvalid={!!updateInfoFormik.errors.password}
            validationMessage={updateInfoFormik.errors.password}
            label=''
          />
        )}
      </Dialog>
    </Pane>
  )
}
