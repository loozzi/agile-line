import { Route, Routes, useLocation } from 'react-router'
import routes from './configs/routes'
import NotFound from './pages/404'
import { AuthTemplate } from './pages/auth/auth'
import { LoginPage } from './pages/auth/login'
import { LogoutPage } from './pages/auth/logout'
import { RegisterPage } from './pages/auth/register'
import { VerifyPage } from './pages/auth/verify'
import { HomePage } from './pages/home'
import { IssuePage } from './pages/issue/issue'
import { IssueDetailPage } from './pages/issue/issue-detail'
import { PrivateLayout } from './pages/private'
import ProjectDetailPage from './pages/project/detail'
import { ProjectPage } from './pages/project/project'
import { UserProfilePage } from './pages/user-profile'
import { ManageLabelPage } from './pages/workspace/manage-labels'
import { WorkspaceMemberPage } from './pages/workspace/members'
import { WorkspaceSettingPage } from './pages/workspace/setting'
import { WorkspaceTemplate } from './pages/workspace/template'
import { WorkspacePage } from './pages/workspace/workspace'
import { WorkspaceDetailPage } from './pages/workspace/workspace-detail'
import { ActivityPage } from './pages/activity-page'

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
        <Route path={routes.workspace.permalink} element={<WorkspaceTemplate />}>
          <Route path={routes.workspace.permalink} element={<WorkspaceDetailPage />} />
          <Route path={routes.workspace.setting.page} element={<WorkspaceSettingPage />} />
          <Route path={routes.workspace.members.page} element={<WorkspaceMemberPage />} />
          <Route path={routes.workspace.projects.page} element={<ProjectPage />} />
          <Route path={routes.workspace.projects.detail} element={<ProjectDetailPage />} />
          <Route path={routes.workspace.labels.page} element={<ManageLabelPage />} />
          <Route path={routes.workspace.issues.page} element={<IssuePage />} />
          <Route path={routes.workspace.issues.detail} element={<IssueDetailPage />} />
          <Route path={routes.workspace.activity} element={<ActivityPage />} />
        </Route>
        <Route path='/' element={<PrivateLayout />}>
          <Route path={routes.profile.page} element={<UserProfilePage />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
