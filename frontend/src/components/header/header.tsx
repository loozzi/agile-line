import { Pane, majorScale } from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { HeaderButtonComp } from './button'
import menuItem from './menu'

export const HeaderComp = () => {
  const [headerHeight, setHeaderHeight] = useState(8)

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  useEffect(() => {
    setHeaderHeight(8)
  })

  return (
    <Pane height={majorScale(headerHeight)} display='flex' justifyContent='center' borderBottom='solid 1px #ccc'>
      {menuItem.map((item) =>
        isTabletOrMobile && item.minimize ? '' : <HeaderButtonComp item={item} height={headerHeight} key={item.label} />
      )}
    </Pane>
  )
}
