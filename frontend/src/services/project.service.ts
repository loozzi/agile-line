import { ProjectCreatePayload, ProjectResponse } from '~/models/project'
import client from './axios.service'
import routeApi from '~/configs/route.api'
import { IResponse } from '~/models/IResponse'

const createProject = async (payload: ProjectCreatePayload): Promise<IResponse<ProjectResponse>> => {
  return await client.post(routeApi.project.create, { ...payload, members_id: `[${payload.members_id.toString()}]` })
}

const get = async (permalink: string): Promise<IResponse<ProjectResponse>> => {
  return await client.get(routeApi.project.get.replace(':permalink', permalink))
}

export default {
  createProject,
  get
}
