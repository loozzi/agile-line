import routeApi from '~/configs/route.api'
import client from './axios.service'
import { IssueCreatePayload, IssueResponse } from '~/models/issue'
import { IResponse } from '~/models/IResponse'

const create = async (payload: IssueCreatePayload): Promise<IResponse<IssueResponse>> => {
  return await client.post(routeApi.issue.create, payload)
}

export default {
  create
}
