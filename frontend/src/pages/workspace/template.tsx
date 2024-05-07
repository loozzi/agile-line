import { Pane, majorScale } from 'evergreen-ui'
import { Outlet } from 'react-router'
import { NavbarComp } from '~/components/navbar/navbar'
import { useMediaQuery } from 'react-responsive'

interface WorkspaceTemplateProps {
  children?: React.ReactNode
}

export const WorkspaceTemplate = (props: WorkspaceTemplateProps) => {
  const { children } = props

  const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })

  if (isBigScreen)
    return (
      <Pane display='flex' backgroundColor={'var(--background)'} minHeight={'100vh'} maxHeight={'100vh'}>
        <NavbarComp maxWidth={majorScale(32)} height='100%' width='100%' overflow='auto' position='fixed' />
        <Pane
          margin={majorScale(2)}
          padding={majorScale(2)}
          borderRadius={majorScale(1)}
          backgroundColor='#fff'
          flex={1}
          overflow='auto'
          marginLeft={majorScale(32)}
        >
          {!!children ? children : <Outlet />}
        </Pane>
      </Pane>
    )
  else
    return (
      <Pane display='flex' justifyContent='center' alignItems='center' minHeight='100vh' marginX={majorScale(2)}>
        Giao diện đang được hoàn thiện. Vui lòng truy cập bằng thiết bị có màn hình lớn hơn...
      </Pane>
    )
}
