import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Workspace } from '~/models/workspace'

interface WorkspaceState {
  loading: boolean
  current?: Workspace
  listWorkspaces: Workspace[]
}

const initialState: WorkspaceState = {
  current: undefined,
  loading: false,
  listWorkspaces: []
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: initialState,
  reducers: {
    getWorkspace(state) {
      state.loading = true
    },
    getWorkspaceSuccess(state, actions: PayloadAction<Workspace | undefined>) {
      state.loading = false
      state.current = actions.payload
    },
    getWorkspaceFailed(state) {
      state.loading = false
      state.current = undefined
    },
    getListWorkspace(state) {
      state.loading = true
    },
    getListWorkspaceSuccess(state, actions: PayloadAction<Workspace[]>) {
      state.loading = false
      state.listWorkspaces = actions.payload
    },
    getListWorksapceFailed(state) {
      state.loading = false
      state.listWorkspaces = []
    }
  }
})

// Actions
export const workspaceActions = workspaceSlice.actions

// Selectors
export const selectGetWorkspace = (state: { workspace: WorkspaceState }) => state.workspace.loading
export const selectCurrentWorkspace = (state: { workspace: WorkspaceState }) => state.workspace.current
export const selectListWorkspace = (state: { workspace: WorkspaceState }) => state.workspace.listWorkspaces

// Reducers
const workspaceReducer = workspaceSlice.reducer
export default workspaceReducer
