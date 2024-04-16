import { IResponse } from '~/models/IResponse'
import { ImgurResponse } from '~/models/imgur'
import client from './axios.service'

const uploadImage = async (image: File): Promise<IResponse<ImgurResponse>> => {
  const formData = new FormData()
  formData.append('image', image)

  const response = await client.post('/file/image', formData)

  return response
}

export default {
  uploadImage
}
