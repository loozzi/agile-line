import { IResponse } from '~/models/IResponse'
import { ImgurResponse } from '~/models/imgur'
import client from './axios.service'

const uploadImage = async (image: File): Promise<IResponse<ImgurResponse>> => {
  const formData = new FormData()
  formData.append('image', image)

  const response = await client.post('/file/image', formData)

  return response
}

const convertImageToBase64 = (imageFile: File) => {
  return new Promise((resolve, reject) => {
    if (imageFile) {
      const reader = new FileReader()

      reader.readAsDataURL(imageFile)

      reader.onload = () => {
        resolve(reader.result?.toString().split(',')[1])
      }
    } else {
      resolve(null)
    }
  })
}

export default {
  uploadImage,
  convertImageToBase64
}
