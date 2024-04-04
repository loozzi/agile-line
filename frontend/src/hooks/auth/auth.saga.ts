import { call, fork, put, take } from 'redux-saga/effects'
import { toaster } from 'evergreen-ui'

import { authActions } from './auth.slice'
import authService from '~/services/auth.service'
import tokenService from '~/services/token.service'
import { LoginPayload, RegisterPayload } from '~/models/user'
import { IResponse } from '~/models/IResponse'
import { Token } from '~/models/token'
import { history } from '~/configs/history'

function* handleLogin(payload: LoginPayload) {
  try {
    const resp: IResponse<Token> = yield authService.login(payload)
    if (resp.status === 200) {
      toaster.success(resp.message)
      const { access_token, refresh_token } = resp.data!
      yield put(authActions.loginSuccess(resp.data?.user))
      yield call(tokenService.setAccessToken, access_token)
      yield call(tokenService.setRefreshToken, refresh_token)
      setTimeout(() => {
        history.push('/')
      }, 1500)
    } else {
      if (resp.status === 500) {
        toaster.danger(resp.message)
      } else {
        toaster.warning(resp.message)
      }
      yield put(authActions.loginFailed())
    }
  } catch (error) {
    toaster.danger('Lỗi rồi, vui lòng thử lại')
    yield put(authActions.loginFailed())
  }
}

function* handleLogout() {}

function* handleRegister(payload: RegisterPayload) {}

function* watchAuthFlow() {
  while (true) {
    // TODO: Handle refresh token
    let isLogin = false

    if (isLogin) {
      yield take(authActions.logout.type)
      yield call(handleLogout)
    } else {
      const { type, payload } = yield take([authActions.login.type, authActions.register.type])
      switch (type) {
        case authActions.login.type:
          yield call(handleLogin, payload)
          break
        case authActions.register.type:
          yield call(handleRegister, payload)
          break
      }
    }
  }
}

export default function* authSaga() {
  yield fork(watchAuthFlow)
}
