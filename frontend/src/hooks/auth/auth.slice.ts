import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { User } from '~/models/user'
import tokenService from '~/services/token.service'
interface AuthState {
  isAuthenticated: boolean
  logging: boolean
  users?: User
}

const initialState: AuthState = {
  isAuthenticated: false,
  logging: false,
  users: undefined
}
const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login(state) {
      state.logging = true
    },
    register(state) {
      state.logging = true
    },
    loginSuccess(state, actions: PayloadAction<User | undefined>) {
      state.logging = false
      state.isAuthenticated = true
      state.users = actions.payload
    },
    registerSuccess(state) {
      state.logging = false
      state.isAuthenticated = true
      state.users = undefined
    },
    loginFailed(state) {
      state.logging = false
      state.isAuthenticated = false
      state.users = undefined
    },
    logout(state) {
      state.logging = false
      state.isAuthenticated = false
      state.users = undefined
    },
    verifySuccess(state, actions: PayloadAction<User | undefined>) {
      state.users = actions.payload
      tokenService.setUser(actions.payload)
    }
  }
})

// Actions
export const authActions = authSlice.actions
export const AUTH_LOGIN = 'AUTH_LOGIN'
export const AUTH_REGISTER = 'AUTH_REGISTER'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const AUTH_VERIFY = 'AUTH_VERIFY'

// Selectors
export const selectLogging = (state: { auth: AuthState }) => state.auth.logging
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectUser = (state: { auth: AuthState }) => state.auth.users

// Reducers
const authReducer = authSlice.reducer
export default authReducer
