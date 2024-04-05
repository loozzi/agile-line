import { ArrowLeftIcon, Button, LogInIcon, Pane, majorScale, toaster } from 'evergreen-ui'
import { useState } from 'react'
import { Outlet } from 'react-router'
import icons from '~/assets/icons'
import imgs from '~/assets/imgs'

export const AuthTemplate = () => {
  const [showLoginForm, setShowLoginForm] = useState(false)

  const toggleShowLoginForm = () => {
    setShowLoginForm(!showLoginForm)
  }

  const loginViaGithub = () => {
    toaster.warning('Tính năng chưa có sẵn')
  }

  // TODO: Handle when logged in, redirect to home page

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
