import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, takeLatest } from 'redux-saga/effects'
import { GET_LIST_WORKSPACE, GET_WORKSPACE, workspaceActions } from './workspace.slice'
import { Workspace, WorkspaceParams, WorkspaceSearchParams } from '~/models/workspace'
import workspaceService from '~/services/workspace.service'
import { IResponse } from '~/models/IResponse'

function* getWorkspace(data: PayloadAction<WorkspaceParams>) {
  const resp: IResponse<Workspace> = yield call(workspaceService.getWorkspace, data.payload)
  if (resp.status === 200) {
    yield put(workspaceActions.getWorkspaceSuccess(resp.data!))
  } else {
    yield put(workspaceActions.getWorkspaceFailed())
  }
}

function* getListWorkspace(data: PayloadAction<WorkspaceSearchParams>) {
  const resp: IResponse<Workspace[]> = yield call(workspaceService.getWorkspaces, data.payload)
  if (resp.status === 200) {
    yield put(workspaceActions.getListWorkspaceSuccess(resp.data!))
  } else {
    yield put(workspaceActions.getListWorksapceFailed())
  }
}

export default function* workspaceSaga() {
  yield takeLatest(GET_WORKSPACE, getWorkspace)
  yield takeLatest(GET_LIST_WORKSPACE, getListWorkspace)
}
