import { Route, Routes, useLocation } from 'react-router'
import routes from './configs/routes'
import NotFound from './pages/404'
import { AuthTemplate } from './pages/auth/auth'
import { LoginPage } from './pages/auth/login'
import { LogoutPage } from './pages/auth/logout'
import { RegisterPage } from './pages/auth/register'
import { VerifyPage } from './pages/auth/verify'
import { HomePage } from './pages/home'
import { WorkspacePage } from './pages/workspace/workspace'
import { WorkspaceTemplate } from './pages/workspace/template'

function App() {
  const location = useLocation()

  return (
    <>
      <Routes location={location}>
        <Route path='/' element={<HomePage />} />
        <Route path={routes.auth.root} element={<AuthTemplate />}>
          <Route path={routes.auth.login} element={<LoginPage />} />
          <Route path={routes.auth.register} element={<RegisterPage />} />
          <Route path={routes.auth.verify} element={<VerifyPage />} />
        </Route>
        <Route path={routes.auth.logout} element={<LogoutPage />} />
        <Route path={routes.workspace.root} element={<WorkspacePage />} />
        <Route path={routes.workspace.permalink} element={<WorkspaceTemplate />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
