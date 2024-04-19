import { Pane, majorScale } from 'evergreen-ui'
import { Outlet } from 'react-router'
import { NavbarComp } from '~/components/navbar/navbar'

interface WorkspaceTemplateProps {
  children?: React.ReactNode
}

export const WorkspaceTemplate = (props: WorkspaceTemplateProps) => {
  const { children } = props
  return (
    <Pane display='flex' backgroundColor={'var(--background)'}>
      <NavbarComp
        maxWidth={majorScale(32)}
        minHeight={'100vh'}
        maxHeight={'100vh'}
        height='100%'
        width='100%'
        overflow='auto'
      />
      <Pane margin={majorScale(2)} borderRadius={majorScale(1)} backgroundColor='#fff' flex={1} overflow='auto'>
        {!!children ? children : <Outlet />}
      </Pane>
    </Pane>
  )
}
