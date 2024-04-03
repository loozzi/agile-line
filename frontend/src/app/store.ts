import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'

import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  // Add reducers here
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true
    }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)
