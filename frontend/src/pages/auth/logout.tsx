import { useEffect } from 'react'
import { useAppDispatch } from '~/app/hook'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { authActions } from '~/hooks/auth/auth.slice'

export const LogoutPage = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(authActions.logout())
    setTimeout(() => {
      history.push(routes.auth.login)
    }, 3000)
  }, [])
  return <div>Redirect to home page after 3s..</div>
}
