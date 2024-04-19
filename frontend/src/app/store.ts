import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'

import rootSaga from './rootSaga'
import authReducer from '~/hooks/auth/auth.slice'
import workspaceReducer from '~/hooks/workspace/workspace.slice'

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true
    }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)
