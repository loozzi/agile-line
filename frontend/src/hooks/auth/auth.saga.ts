import { toaster } from 'evergreen-ui'
import { all, call, fork, put, take } from 'redux-saga/effects'

import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { IResponse } from '~/models/IResponse'
import { Token } from '~/models/token'
import { LoginPayload, RegisterPayload } from '~/models/user'
import authService from '~/services/auth.service'
import tokenService from '~/services/token.service'
import { authActions } from './auth.slice'

function* handleLogin(payload: LoginPayload) {
  try {
    const resp: IResponse<Token> = yield call(authService.login, payload)
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

function* handleLogout() {
  yield put(authActions.logout())
  yield all([call(tokenService.removeAccessToken), call(tokenService.removeRefreshToken)])
}

function* handleRegister(payload: RegisterPayload) {
  try {
    console.log(payload)
    const resp: IResponse<Token> = yield call(authService.register, payload)
    if (resp.status === 200) {
      toaster.success(resp.message)
      const { access_token, refresh_token } = resp.data!
      yield put(authActions.registerSuccess())
      yield call(tokenService.setAccessToken, access_token)
      yield call(tokenService.setRefreshToken, refresh_token)
      setTimeout(() => {
        history.push(routes.auth.verify)
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

function* watchAuthFlow() {
  while (true) {
    let isLogin = false
    const access_token: string | null = yield call(tokenService.getAccessToken)
    const refresh_token: string | null = yield call(tokenService.getRefreshToken)
    if (access_token) {
      isLogin = true
    } else if (refresh_token) {
      // TODO: Generate new token here
    } else {
      isLogin = false
    }

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
