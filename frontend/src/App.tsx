import { Route, Routes, useLocation } from 'react-router'
import { Pane } from 'evergreen-ui'
import envConfig from './configs/env.config'
import NotFound from './pages/404'
import routes from './configs/routes'
import { LoginPage } from './pages/auth/login'
import { RegisterPage } from './pages/auth/register'
import { AuthTemplate } from './pages/auth/auth'
import { LogoutPage } from './pages/auth/logout'
import { VerifyPage } from './pages/auth/verify'

function App() {
  const location = useLocation()

  return (
    <>
      <Routes location={location}>
        <Route path='/' element={<Pane>{envConfig.API_ENDPOINT}</Pane>} />
        <Route path={routes.auth.root} element={<AuthTemplate />}>
          <Route path={routes.auth.login} element={<LoginPage />} />
          <Route path={routes.auth.register} element={<RegisterPage />} />
          <Route path={routes.auth.verify} element={<VerifyPage />} />
        </Route>
        <Route path={routes.auth.logout} element={<LogoutPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
