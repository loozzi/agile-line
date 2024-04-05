import { ArrowLeftIcon, Button, LogInIcon, Pane, majorScale, toaster } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useAppSelector } from '~/app/hook'
import icons from '~/assets/icons'
import imgs from '~/assets/imgs'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { selectIsAuthenticated } from '~/hooks/auth/auth.slice'
import { User } from '~/models/user'
import tokenService from '~/services/token.service'

export const AuthTemplate = () => {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const isAuth = useAppSelector(selectIsAuthenticated)

  const toggleShowLoginForm = () => {
    setShowLoginForm(!showLoginForm)
  }

  const loginViaGithub = () => {
    toaster.warning('Tính năng chưa có sẵn')
  }

  useEffect(() => {
    const accessToken: string | null = tokenService.getAccessToken()
    const user: User | undefined = tokenService.getUser()
    if (accessToken && user) {
      history.push('/')
    } else if (accessToken) {
      history.push(routes.auth.verify)
    }
  }, [])

  useEffect(() => {
    const current_path = location.pathname.split('/').join('')
    if (current_path == routes.auth.root.split('/').join('')) {
      history.push(routes.auth.login)
    }
  }, [])

  useEffect(() => {
    if (isAuth) {
      history.push('/')
    }
  }, [isAuth])

  return (
    <Pane
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        position: 'relative',
        marginTop: 200
      }}
    >
      <img
        src={imgs.agile}
        alt='Logo'
        style={{
          width: '100px',
          height: '100px',
          marginBottom: 32
        }}
      />
      {!showLoginForm && (
        <Pane display='flex' flexDirection='column' marginTop={majorScale(4)}>
          <Button
            onClick={toggleShowLoginForm}
            width={majorScale(40)}
            height={majorScale(5)}
            marginBottom={majorScale(2)}
            appearance='primary'
            iconBefore={LogInIcon}
          >
            Đăng nhập bằng tài khoản
          </Button>
          <Button
            width={majorScale(40)}
            height={majorScale(5)}
            onClick={loginViaGithub}
            iconBefore={<img src={icons.github} />}
          >
            Đăng nhập bằng Github
          </Button>
        </Pane>
      )}
      {showLoginForm && (
        <span
          onClick={toggleShowLoginForm}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            justifyItems: ''
          }}
        >
          <ArrowLeftIcon marginRight={8} />
          Trở lại
        </span>
      )}
      {showLoginForm && <Outlet />}
    </Pane>
  )
}
