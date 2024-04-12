import { Button, ChevronRightIcon, majorScale } from 'evergreen-ui'
import { useEffect } from 'react'
import { useAppSelector } from '~/app/hook'
import { HeaderComp } from '~/components/header/header'
import { history } from '~/configs/history'
import routes from '~/configs/routes'
import { selectIsAuthenticated } from '~/hooks/auth/auth.slice'

export const HomePage = () => {
  const isLogin = useAppSelector(selectIsAuthenticated)

  const handleRedirect = (path: string) => {
    history.push(path)
  }

  useEffect(() => {
    if (isLogin) {
      history.push(routes.workspace.root)
    }
  })

  return (
    <div>
      <HeaderComp />
      <center
        style={{
          margin: majorScale(2)
        }}
      >
        <h2
          style={{
            fontSize: majorScale(10)
          }}
        >
          AgileLine is a better way to build products
        </h2>
        <div
          style={{
            fontSize: majorScale(3),
            marginTop: majorScale(2)
          }}
        >
          <p>Meet the new standard for mdern software development.</p>
          <p>Streamline issues, sprints, and product roadmaps.</p>
        </div>
        <Button
          appearance='primary'
          iconAfter={<ChevronRightIcon />}
          onClick={() => handleRedirect(routes.auth.register)}
          height={majorScale(6)}
          borderRadius={majorScale(4)}
          marginY={majorScale(4)}
        >
          Get Started
        </Button>
      </center>
      <center
        style={{
          margin: majorScale(2)
        }}
      >
        <img
          src='https://hocvienagile.com/wp-content/uploads/2023/02/agile-xuat-phat-tu-nganh-cong-nghe-de-nhanh-chong-thich-ung-va-phan-hoi-voi-thay-doi.jpg'
          alt='homepage'
          style={{
            width: '90%',
            borderRadius: majorScale(2),
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
          }}
        />
        <div
          style={{
            fontSize: majorScale(3),
            marginTop: majorScale(4)
          }}
        >
          <p>Powering the world's best product teams</p>
          <p>From next-gen startups to established enterprises.</p>
        </div>
      </center>
      <center
        style={{
          margin: majorScale(2),
          marginTop: majorScale(8)
        }}
      >
        <h2
          style={{
            fontSize: majorScale(8)
          }}
        >
          Unlike any tool you've used before
        </h2>
        <div
          style={{
            fontSize: majorScale(3),
            marginTop: majorScale(2)
          }}
        >
          <p>Designed to the last pixel and engineered with unforgiving precision</p>
          <p>Linear combines UI elegance with world-class performance.</p>
        </div>
        <div
          style={{
            display: 'flex',
            width: '90%'
          }}
        >
          <img
            src='https://hocvienagile.com/wp-content/uploads/2023/02/agile-xuat-phat-tu-nganh-cong-nghe-de-nhanh-chong-thich-ung-va-phan-hoi-voi-thay-doi.jpg'
            alt=''
            style={{
              objectFit: 'contain',
              width: '50%',
              borderRadius: majorScale(2),
              boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
            }}
          />
          <img
            src='https://devops.vinahost.vn/Image/Agile.png'
            alt=''
            style={{
              objectFit: 'contain',
              width: '50%',
              borderRadius: majorScale(2),
              boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
            }}
          />
        </div>
      </center>
      <center
        style={{
          margin: majorScale(2),
          marginTop: majorScale(8)
        }}
      >
        <h2
          style={{
            fontSize: majorScale(8)
          }}
        >
          Issue tracking you'll enjoy using
        </h2>
        <img
          src='https://devops.vinahost.vn/Image/Agile.png'
          alt=''
          style={{
            width: '90%',
            borderRadius: majorScale(2)
          }}
        />
        <p
          style={{
            fontSize: majorScale(3),
            marginTop: majorScale(2)
          }}
        >
          Linear's issue tracking is flexible, intuitive, and lightning fast.
        </p>
      </center>
      {/* TODO: More content */}
    </div>
  )
}
