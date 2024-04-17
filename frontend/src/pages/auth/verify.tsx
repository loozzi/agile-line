import { Button, Pane, TextInputField, majorScale, toaster } from 'evergreen-ui'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import { useAppDispatch } from '~/app/hook'
import { AUTH_VERIFY } from '~/hooks/auth/auth.slice'
import { IResponse } from '~/models/IResponse'
import { VerifyPayload } from '~/models/auth'
import authService from '~/services/auth.service'

export const VerifyPage = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(60)
  const [isSent, setSent] = useState(false)

  const dispatch = useAppDispatch()

  const handleSendOTP = () => {
    if (isSent === false)
      authService.sendOTP().then((data: IResponse<undefined>) => {
        if (data.status === 200) {
          toaster.success(data.message)
          setSent(true)
        } else {
          toaster.warning(data.message)
        }
      })
  }

  const initialValues: VerifyPayload = useMemo(
    () => ({
      otp: ''
    }),
    []
  )

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (value: VerifyPayload) => {
      dispatch({
        type: AUTH_VERIFY,
        payload: value
      })
    },
    validationSchema: Yup.object({
      otp: Yup.string().required('Vui lòng nhập OTP').length(6)
    }),
    validateOnChange: false,
    validateOnBlur: false
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1)
      } else {
        clearInterval(intervalId)
        setSecondsRemaining(60)
        setSent(false)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [secondsRemaining])

  return (
    <Pane>
      <form onSubmit={formik.handleSubmit}>
        <TextInputField
          inputHeight={majorScale(5)}
          inputWidth={majorScale(40)}
          name='otp'
          placeholder='OTP'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.otp}
          isInvalid={!!formik.errors.otp}
          validationMessage={formik.errors.otp}
          label=''
        />
        <Button type='button' width='45%' height={majorScale(5)} onClick={handleSendOTP}>
          {isSent ? `Thử lại sau ${secondsRemaining}s...` : 'Gửi mã OTP'}
        </Button>
        <Button type='submit' appearance='primary' width='45%' float='right' height={majorScale(5)}>
          Xác thực
        </Button>
      </form>
    </Pane>
  )
}
