import React from 'react'
import ReactDOM from 'react-dom/client'
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { history } from '~/configs/history'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HistoryRouter history={history}>
      <App />
    </HistoryRouter>
  </React.StrictMode>
)
