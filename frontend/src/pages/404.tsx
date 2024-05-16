import { Button } from 'evergreen-ui'
import imgs from '~/assets/imgs'
import { history } from '~/configs/history'

const NotFound = () => {
  document.title = '404 - Page not found'
  const backToHome = () => {
    history.push('/')
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <img
        style={{
          position: 'absolute',
          opacity: 0.05,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        src={imgs.unplugged}
        alt='Unplugged'
      />
      <span
        style={{
          fontSize: '10rem',
          fontWeight: 'bold',
          color: '#0078f0',
          position: 'relative',
          textShadow: '5px 5px 0 #c1ddf8'
        }}
      >
        <span>4</span>
        <span
          style={{
            position: 'relative',
            top: '28px'
          }}
        >
          {'{}'}
        </span>
        <span>4</span>
      </span>
      <span
        style={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          lineHeight: '3.5'
        }}
      >
        OOPS! Page not found.
      </span>
      <Button appearance='primary' marginTop={16} paddingX={32} onClick={backToHome}>
        Back to Home
      </Button>
    </div>
  )
}

export default NotFound
