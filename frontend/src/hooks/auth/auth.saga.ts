import { toaster } from 'evergreen-ui'
import { all, call, fork, put, take } from 'redux-saga/effects'

import { PayloadAction } from '@reduxjs/toolkit'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { IResponse } from '~/models/IResponse'
import { LoginPayload, RegisterPayload, VerifyPayload } from '~/models/auth'
import { Token } from '~/models/token'
import { User } from '~/models/user'
import authService from '~/services/auth.service'
import tokenService from '~/services/token.service'
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_REGISTER, AUTH_VERIFY, authActions } from './auth.slice'

function* saveToLocalStorage(data: Token) {
  const { access_token, refresh_token, user } = data
  yield call(tokenService.setUser, user)
  yield call(tokenService.setAccessToken, access_token)
  yield call(tokenService.setRefreshToken, refresh_token)
}

function* handleLogin(payload: LoginPayload) {
  try {
    const resp: IResponse<Token> = yield call(authService.login, payload)
    if (resp.status === 200) {
      toaster.success(resp.message)
      yield call(saveToLocalStorage, resp.data!)
      yield put(authActions.loginSuccess(resp.data?.user))
      history.push('/')
    } else if (resp.status === 406) {
      toaster.warning(resp.message)
      yield call(saveToLocalStorage, resp.data!)
      history.push(routes.auth.verify)
    } else {
      resp.status === 500 ? toaster.danger(resp.message) : toaster.warning(resp.message)
      yield put(authActions.loginFailed())
    }
  } catch (error) {
    toaster.danger('Lỗi rồi, vui lòng thử lại')
    yield put(authActions.loginFailed())
  }
}

function* handleLogout() {
  yield put(authActions.logout())
  yield all([
    call(tokenService.removeAccessToken),
    call(tokenService.removeRefreshToken),
    call(tokenService.removeUser)
  ])
}

function* handleRegister(payload: RegisterPayload) {
  try {
    const resp: IResponse<Token> = yield call(authService.register, payload)
    if (resp.status === 200) {
      toaster.success(resp.message)
      yield put(authActions.registerSuccess())
      yield call(saveToLocalStorage, resp.data!)
      setTimeout(() => {
        history.push(routes.auth.verify)
      }, 1500)
    } else {
      resp.status === 500 ? toaster.danger(resp.message) : toaster.warning(resp.message)
      yield put(authActions.loginFailed())
    }
  } catch (error) {
    toaster.danger('Lỗi rồi, vui lòng thử lại')
    yield put(authActions.loginFailed())
  }
}

function* handleVerify(payload: VerifyPayload) {
  try {
    const resp: IResponse<Token> = yield call(authService.verify, payload)
    if (resp.status === 200) {
      toaster.success(resp.message)
      yield call(saveToLocalStorage, resp.data!)
      yield put(authActions.verifySuccess(resp.data?.user))
      history.push('/')
    } else {
      toaster.danger(resp.message)
    }
    return true
  } catch (error) {
    toaster.danger('Lỗi rồi, vui lòng thử lại')
  }
  return false
}

function* watchAuthFlow() {
  while (true) {
    let isLogin = false
    const access_token: string | null = yield call(tokenService.getAccessToken)
    const refresh_token: string | null = yield call(tokenService.getRefreshToken)
    if (access_token) {
      isLogin = true
      const user: User | undefined = yield tokenService.getUser()
      if (user || history.location.pathname === routes.auth.logout) {
        yield put(authActions.loginSuccess(user))
      } else {
        history.push(routes.auth.verify)
      }
    } else if (refresh_token) {
      const resp: IResponse<Token> = yield call(tokenService.generate, refresh_token)
      if (resp.status === 200) {
        yield put(authActions.loginSuccess(resp.data?.user))
        yield call(saveToLocalStorage, resp.data!)
        isLogin = true
      } else {
        yield call(handleLogout)
      }
    }

    if (isLogin) {
      let isVerify = false
      while (!isVerify) {
        const actions: PayloadAction<VerifyPayload | undefined> = yield take([AUTH_LOGOUT, AUTH_VERIFY])
        switch (actions.type) {
          case AUTH_LOGOUT:
            yield call(handleLogout)
            isVerify = true
            break
          case AUTH_VERIFY:
            isVerify = yield call(handleVerify, actions.payload as VerifyPayload)
            break
        }
      }
    } else {
      const actions: PayloadAction<LoginPayload | RegisterPayload> = yield take([AUTH_LOGIN, AUTH_REGISTER])
      switch (actions.type) {
        case AUTH_LOGIN:
          yield call(handleLogin, actions.payload as LoginPayload)
          break
        case AUTH_REGISTER:
          yield call(handleRegister, actions.payload as RegisterPayload)
          break
      }
    }
  }
}

export default function* authSaga() {
  yield fork(watchAuthFlow)
}
