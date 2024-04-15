import { Pane, FileCard, FileUploader, PaneProps } from 'evergreen-ui'
import React from 'react'

interface ImageUploaderCompProps extends PaneProps {
  label?: string
  description?: string
  maxSizeInBytes?: number
  maxFiles?: number
}

export const ImageUploaderComp = (props: ImageUploaderCompProps) => {
  const [files, setFiles] = React.useState([])
  const [fileRejections, setFileRejections] = React.useState([])
  const handleChange = React.useCallback((files: any[]) => setFiles([files[0]]), [])
  const handleRejected = React.useCallback((fileRejections: any[]) => setFileRejections([fileRejections[0]]), [])
  const handleRemove = React.useCallback(() => {
    setFiles([])
    setFileRejections([])
  }, [])

  const { label, description, maxSizeInBytes, maxFiles, ...paneProps } = props

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
