import { Button, Label, Pane, TextInputField, majorScale } from 'evergreen-ui'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { useAppDispatch } from '~/app/hook'
import routes from '~/configs/routes'
import { AUTH_REGISTER } from '~/hooks/auth/auth.slice'
import { RegisterPayload } from '~/models/auth'

export const RegisterPage = () => {
  const dispatch = useAppDispatch()

  const initialValues: RegisterPayload = useMemo(
    () => ({
      email: '',
      username: '',
      password: ''
    }),
    []
  )

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      dispatch({ type: AUTH_REGISTER, payload: values })
    },
    validationSchema: Yup.object({
      email: Yup.string().required().email(),
      username: Yup.string()
        .required()
        .matches(/^[A-Za-z0-9]+$/, 'Only letters from A-Z and numbers allowed')
        .min(6),
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
          name='email'
          placeholder='Email'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          isInvalid={!!formik.errors.email}
          validationMessage={formik.errors.email}
          label=''
        />
        <TextInputField
          inputHeight={majorScale(5)}
          inputWidth={majorScale(40)}
          name='username'
          placeholder='Username'
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
          Đăng ký
        </Button>
      </form>

      <Label float='right' marginTop={majorScale(2)}>
        <Link to={routes.auth.login}>Đã có tài khoản? Đăng nhập ngay</Link>
      </Label>
    </Pane>
  )
}
