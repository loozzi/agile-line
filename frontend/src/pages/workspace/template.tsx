import { Pane, majorScale } from 'evergreen-ui'
import { Outlet } from 'react-router'
import { NavbarComp } from '~/components/navbar/navbar'

interface WorkspaceTemplateProps {
  children?: React.ReactNode
}

export const WorkspaceTemplate = (props: WorkspaceTemplateProps) => {
  const { children } = props
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
}
