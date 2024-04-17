import { Pane, PaneProps, majorScale } from 'evergreen-ui'
import './navbar-btn.css'

interface NavbarButtonCompProps extends PaneProps {
  label: string
  maxLabelWidth?: number
  labelBold?: boolean
  afterIcon?: any
  beforeIcon?: any
  onClick: () => void
}

export const NavbarButtonComp = (props: NavbarButtonCompProps) => {
  const { label, maxLabelWidth, labelBold, afterIcon, beforeIcon, onClick, ...paneProps } = props

  return (
    <Pane
      display='flex'
      alignItems='center'
      padding={majorScale(1)}
      className='navbar--button'
      borderRadius={majorScale(1)}
      onClick={onClick}
      {...paneProps}
    >
      <span
        style={{
          minWidth: majorScale(4),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {beforeIcon}
      </span>
      <span
        style={{
          maxWidth: maxLabelWidth,
          margin: majorScale(1),
          marginTop: 0,
          marginBottom: 0,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          fontWeight: labelBold ? 600 : 400
        }}
      >
        {label}
      </span>
      {afterIcon}
    </Pane>
  )
}
