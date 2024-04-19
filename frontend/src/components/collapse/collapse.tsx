import { ChevronDownIcon, ChevronRightIcon, Pane, PaneProps, majorScale } from 'evergreen-ui'
import { useState } from 'react'
import './collapse.css'

interface CollapseCompProps extends PaneProps {
  label: React.ReactNode
  children?: React.ReactNode
}

export const CollapseComp = (props: CollapseCompProps) => {
  const { label, children, ...paneProps } = props
  const [isCollapse, setIsCollapse] = useState<boolean>(true)

  const handleCollapse = () => {
    setIsCollapse(!isCollapse)
  }

  return (
    <Pane {...paneProps}>
      <span
        onClick={handleCollapse}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: majorScale(1),
          padding: majorScale(1),
          paddingLeft: majorScale(2)
        }}
        className='collapse--header'
      >
        {label}
        {isCollapse ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </span>
      {isCollapse && !!children && children}
    </Pane>
  )
}
