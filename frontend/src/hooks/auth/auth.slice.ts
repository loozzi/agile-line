import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { LoginPayload, RegisterPayload, User } from '~/models/user'

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
    login(state, actions: PayloadAction<LoginPayload>) {
      state.logging = true
      actions
    },
    register(state, actions: PayloadAction<RegisterPayload>) {
      state.logging = true
      actions
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
    }
  }
})

// Actions
export const authActions = authSlice.actions

// Selectors
export const selectLogging = (state: { auth: AuthState }) => state.auth.logging
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectUser = (state: { auth: AuthState }) => state.auth.users

// Reducers
const authReducer = authSlice.reducer
export default authReducer
