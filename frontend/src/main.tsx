import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { history } from '~/configs/history'
import { store } from '~/app/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={history}>
        <App />
      </HistoryRouter>
    </Provider>
  </React.StrictMode>
)
