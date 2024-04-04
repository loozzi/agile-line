import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'

import rootSaga from './rootSaga'
import authReducer from '~/hooks/auth/auth.slice'

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  auth: authReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true
    }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)
