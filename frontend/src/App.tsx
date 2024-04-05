import { Route, Routes, useLocation } from 'react-router'
import { Pane } from 'evergreen-ui'
import envConfig from './configs/env.config'
import NotFound from './pages/404'
import routes from './configs/routes'
import { LoginPage } from './pages/auth/login'
import { RegisterPage } from './pages/auth/register'
import { AuthTemplate } from './pages/auth/auth'

function App() {
  const location = useLocation()

  return (
    <>
      <Routes location={location}>
        <Route path='/' element={<Pane>{envConfig.API_ENDPOINT}</Pane>} />
        <Route path={routes.auth.root} element={<AuthTemplate />}>
          <Route path={routes.auth.login} element={<LoginPage />} />
          <Route path={routes.auth.register} element={<RegisterPage />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
