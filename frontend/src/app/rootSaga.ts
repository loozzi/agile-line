import { all } from 'redux-saga/effects'
import authSaga from '~/hooks/auth/auth.saga'
import workspaceSaga from '~/hooks/workspace/worksapce.saga'
export default function* rootSaga() {
  yield all([authSaga(), workspaceSaga()])
}
