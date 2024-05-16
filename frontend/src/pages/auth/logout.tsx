import { useEffect } from 'react'
import { useAppDispatch } from '~/app/hook'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { AUTH_LOGOUT } from '~/hooks/auth/auth.slice'

export const LogoutPage = () => {
  document.title = 'Đăng xuất'
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch({ type: AUTH_LOGOUT })
    setTimeout(() => {
      history.push(routes.auth.login)
    }, 3000)
  }, [])
  return <div>Redirect to home page after 3s..</div>
}
