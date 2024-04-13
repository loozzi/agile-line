import { Link, Menu, Popover, Position, majorScale } from 'evergreen-ui'
import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { history } from '~/configs/history'
import { MenuItem } from '~/models/menu'
import './button.css'

interface HeaderButtonCompProps {
  item: MenuItem
  height: number
  floatLeft?: boolean
}

export const HeaderButtonComp = (props: HeaderButtonCompProps) => {
  const { item, height, floatLeft } = props
  const [isShown, setIsShown] = useState(false)
  const handleRedirect = (path: string) => {
    history.push(path)
  }

  const handleMouseEnter = () => {
    setIsShown(true)
  }

  const handleMouseLeave = () => {
    setIsShown(false)
  }

  const LinkComp = (item: MenuItem) => (
    <Link
      onClick={() => handleRedirect(item.path)}
      display='block'
      height={majorScale(height)}
      width={majorScale(floatLeft ? 32 : 16)}
      alignItems='center'
      backgroundColor='transparent'
      border='none'
      outline='none'
      boxShadow='none'
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: floatLeft ? 'start' : 'center',
          height: '100%',
          cursor: 'pointer',
          paddingLeft: floatLeft ? majorScale(4) : 0
        }}
        className='header-btn'
      >
        {item.label}
      </span>
    </Link>
  )

  return (
    <Fragment>
      {item.elements ? (
        <Popover
          position={Position.BOTTOM_LEFT}
          content={
            <div onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Menu>
                <Menu.Group>
                  {item.elements.map((element, index) => (
                    <HeaderButtonComp key={index} item={element} height={height} floatLeft={true} />
                  ))}
                </Menu.Group>
              </Menu>
            </div>
          }
          minWidth={majorScale(32)}
          isShown={isShown}
          onOpen={() => {}}
          onClose={() => {}}
        >
          <div onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {LinkComp(item)}
          </div>
        </Popover>
      ) : (
        LinkComp(item)
      )}
    </Fragment>
  )
}
