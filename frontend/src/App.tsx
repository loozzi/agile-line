import { Route, Routes, useLocation } from 'react-router'
import { Pane } from 'evergreen-ui'
import envConfig from './configs/env.config'

function App() {
  const location = useLocation()

  return (
    <>
      <Routes location={location}>
        <Route path='/' element={<Pane>{envConfig.API_ENDPOINT}</Pane>} />
      </Routes>
    </>
  )
}

export default App
