import { all } from 'redux-saga/effects'
import authSaga from '~/hooks/auth/auth.saga'
export default function* rootSaga() {
  yield all([authSaga()])
}
