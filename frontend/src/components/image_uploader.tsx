import { FileCard, FileUploader, Pane, PaneProps, toaster } from 'evergreen-ui'
import React from 'react'
import { IResponse } from '~/models/IResponse'
import { ImgurResponse } from '~/models/imgur'
import imgurService from '~/services/imgur.service'

interface ImageUploaderCompProps extends PaneProps {
  label?: string
  description?: string
  maxSizeInBytes?: number
  maxFiles?: number
  onChangeLogo?: (value: string | undefined) => void
}

export const ImageUploaderComp = (props: ImageUploaderCompProps) => {
  const { label, description, maxSizeInBytes, maxFiles, onChangeLogo, ...paneProps } = props
  const [files, setFiles] = React.useState([])
  const [fileRejections, setFileRejections] = React.useState([])
  const handleRejected = React.useCallback(
    (fileRejections: any[]) => setFileRejections([fileRejections[0] as never]),
    []
  )
  const handleRemove = React.useCallback(() => {
    setFiles([])
    setFileRejections([])
  }, [])
  const handleChange = React.useCallback((files: never[] | any[]) => {
    setFiles([files[0] as never])
    toaster.notify('Uploading image...', {
      id: 'upload-image'
    })
    imgurService.uploadImage(files[0]).then((data: IResponse<ImgurResponse>) => {
      if (data.status === 200) {
        onChangeLogo!(data.data!.link)
        toaster.success('Upload image successfully', {
          id: 'upload-image'
        })
      } else {
        toaster.danger('Upload image failed', {
          id: 'upload-image'
        })
        handleRemove()
      }
    })
  }, [])

  return (
    <Pane {...paneProps}>
      <FileUploader
        label={label ?? 'Upload File'}
        description={description ?? 'You can upload 1 file. File can be up to 50 MB.'}
        maxSizeInBytes={maxSizeInBytes ?? 50 * 1024 ** 2}
        maxFiles={maxFiles ?? 1}
        onChange={handleChange}
        onRejected={handleRejected}
        renderFile={(file) => {
          const { name, size, type } = file
          const fileRejection = fileRejections.find((fileRejection: any) => fileRejection.file === file)
          const { message }: any = fileRejection || {}
          return (
            <FileCard
              key={name}
              isInvalid={fileRejection != null}
              name={name}
              onRemove={handleRemove}
              sizeInBytes={size}
              type={type}
              validationMessage={message}
            />
          )
        }}
        values={files}
      />
    </Pane>
  )
}
