import { Pane, PaneProps, toaster } from 'evergreen-ui'
import { useCallback, useRef } from 'react'
import { IResponse } from '~/models/IResponse'
import { ImgurResponse } from '~/models/imgur'
import imgurService from '~/services/imgur.service'
import './image_picker.css'

interface ImagePickerCompProps extends PaneProps {
  src: string
  textOverlay?: string
  onChangeImage?: (value: string | undefined) => void
}

export const ImagePickerComp = (props: ImagePickerCompProps) => {
  const { onChangeImage, textOverlay, ...paneProps } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const onClick = () => {
    inputRef.current?.click()
  }

  const onChange = useCallback(() => {
    toaster.notify('Đang tải ảnh lên...', {
      id: 'upload-image'
    })
    imgurService.uploadImage(inputRef.current?.files![0] as File).then((data: IResponse<ImgurResponse>) => {
      if (data.status === 200) {
        onChangeImage!(data.data!.link)
        toaster.success('Tải ảnh lên thành công', {
          id: 'upload-image'
        })
      } else {
        toaster.danger('Tải ảnh lên thất bại', {
          id: 'upload-image'
        })
      }
    })
  }, [])

  return (
    <Pane
      className='image-picker'
      {...paneProps}
      style={{
        backgroundImage: `url(${paneProps.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      position='relative'
      onClick={onClick}
      overflow='hidden'
      border='1px solid #ccc'
    >
      <span className='image-picker--overlay'>{textOverlay ? textOverlay : 'Upload'}</span>
      <input type='file' hidden accept='image/png, image/jpeg' ref={inputRef} onChange={onChange} />
    </Pane>
  )
}
