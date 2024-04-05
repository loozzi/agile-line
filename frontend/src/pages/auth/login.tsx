import { Button, Label, Link as LinkComp, Pane, TextInputField, majorScale } from 'evergreen-ui'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppDispatch } from '~/app/hook'
import routes from '~/configs/routes'
import { authActions } from '~/hooks/auth/auth.slice'
import { LoginPayload } from '~/models/user'

export const LoginPage = () => {
  const dispatch = useAppDispatch()

  const initialValues: LoginPayload = useMemo(
    () => ({
      username: '',
      password: ''
    }),
    []
  )

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      dispatch(authActions.login(values))
    },
    validationSchema: Yup.object({
      username: Yup.string().required().min(6),
      password: Yup.string().required().min(6)
    }),
    validateOnChange: false,
    validateOnBlur: false
  })

  return (
    <Pane>
      <form onSubmit={formik.handleSubmit}>
        <TextInputField
          inputHeight={majorScale(5)}
          inputWidth={majorScale(40)}
          name='username'
          placeholder='Email or Username'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          isInvalid={!!formik.errors.username}
          validationMessage={formik.errors.username}
          label=''
        />
        <TextInputField
          inputHeight={majorScale(5)}
          inputWidth={majorScale(40)}
          placeholder='Password'
          name='password'
          type='password'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          isInvalid={formik.touched.password && !!formik.errors.password}
          validationMessage={formik.errors.password}
          label=''
        />
        <Button type='submit' appearance='primary' display='block' width='100%' height={majorScale(5)}>
          Đăng nhập
        </Button>
      </form>

      <Label float='right' marginTop={majorScale(2)}>
        <Link to={routes.auth.register}>Chưa có tài khoản? Đăng ký ngay</Link>
      </Label>
    </Pane>
  )
}
