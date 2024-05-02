import { ProjectCreatePayload, ProjectResponse, ProjectStatus, ProjectUpdatePayload } from '~/models/project'
import client from './axios.service'
import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'

const createProject = async (payload: ProjectCreatePayload): Promise<IResponse<ProjectResponse>> => {
  return await client.post(routeApi.project.create, { ...payload, members_id: `[${payload.members_id.toString()}]` })
}

const get = async (permalink: string): Promise<IResponse<ProjectResponse>> => {
  return await client.get(routeApi.project.get.replace(':permalink', permalink))
}

const updateStatus = async (permalink: string, status: ProjectStatus): Promise<IResponse<ProjectResponse>> => {
  return await client.put(
    routeApi.project.update.replace(':permalink', permalink),
    { status },
    {
      params: {
        target: 'status'
      }
    }
  )
}

const update = async (permalink: string, payload: ProjectUpdatePayload): Promise<IResponse<ProjectResponse>> => {
  return await client.put(routeApi.project.update.replace(':permalink', permalink), payload, {
    params: {
      target: 'all'
    }
  })
}

const updateMembers = async (permalink: string, members_id: number[]): Promise<IResponse<ProjectResponse>> => {
  return await client.put(
    routeApi.project.update.replace(':permalink', permalink),
    { members_id: `[${members_id.toString()}]` },
    {
      params: {
        target: 'members'
      }
    }
  )
}

export default {
  createProject,
  get,
  updateStatus,
  update,
  updateMembers
}
