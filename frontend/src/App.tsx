import { Route, Routes, useLocation } from 'react-router'
import { Pane } from 'evergreen-ui'
import envConfig from './configs/env.config'
import NotFound from './pages/404'

function App() {
  const location = useLocation()

  return (
    <>
      <Routes location={location}>
        <Route path='/' element={<Pane>{envConfig.API_ENDPOINT}</Pane>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
