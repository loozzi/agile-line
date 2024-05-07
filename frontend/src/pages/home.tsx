import { Button, ChevronRightIcon, Image, Label, Pane, majorScale } from 'evergreen-ui'
import { useEffect } from 'react'
import { useAppSelector } from '~/app/hook'
import imgs from '~/assets/imgs'
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
    <Pane>
      <HeaderComp />
      <Pane
        maxWidth={majorScale(180)}
        margin='auto'
        marginTop={majorScale(2)}
        paddingX={majorScale(2)}
        fontSize={majorScale(3)}
      >
        <Pane textAlign='center'>
          <Label fontSize={majorScale(8)} lineHeight={1}>
            AgileLine là một cách tốt hơn để xây dựng sản phẩm của bạn
          </Label>
          <Pane marginTop={majorScale(2)}>
            <p>Định tiêu chuẩn mới cho phát triển phần mềm hiện đại.</p>
            <p>Tiết kiệm thời gian với việc quản lý vấn đề, sprint và lộ trình sản phẩm.</p>
          </Pane>
          <Button
            appearance='primary'
            iconAfter={<ChevronRightIcon />}
            onClick={() => handleRedirect(routes.auth.register)}
            height={majorScale(6)}
            borderRadius={majorScale(4)}
            marginY={majorScale(4)}
            paddingX={majorScale(4)}
          >
            Bắt đầu
          </Button>
        </Pane>
        <Pane margin={majorScale(2)} textAlign='center'>
          <Image
            src={imgs.cover}
            alt='homepage'
            width='90%'
            borderRadius={majorScale(2)}
            boxShadow={'0 0 10px 0 rgba(0, 0, 0, 0.2)'}
          />
          <Pane marginTop={majorScale(2)}>
            <p>Đội sản phẩm tốt nhất trên thế giới</p>
            <p>Từ các startup thế hệ tiếp theo đến các doanh nghiệp đã thành lập.</p>
          </Pane>
        </Pane>
        <Pane textAlign='center' marginTop={majorScale(2)}>
          <Label fontSize={majorScale(8)} lineHeight={1}>
            Khác biệt so với bất kỳ công cụ nào bạn đã sử dụng trước đây
          </Label>
          <Pane marginTop={majorScale(2)}>
            <p>Thiết kế đến từng pixel và được thiết kế với độ chính xác không thể tha thứ</p>
            <p>Linear kết hợp sự thanh lịch của giao diện người dùng với hiệu suất hàng đầu thế giới.</p>
          </Pane>
          <Pane display='flex' justifyContent='space-evenly' margin='auto' marginTop={majorScale(2)} width='90%'>
            <Image
              src={imgs.character}
              alt=''
              width='45%'
              borderRadius={majorScale(2)}
              boxShadow='0 0 10px 0 rgba(0, 0, 0, 0.2)'
              style={{ objectFit: 'cover' }}
            />
            <Image
              src={imgs.femaleOperator}
              alt=''
              width='45%'
              borderRadius={majorScale(2)}
              boxShadow='0 0 10px 0 rgba(0, 0, 0, 0.2)'
              style={{ objectFit: 'cover' }}
            />
          </Pane>
        </Pane>
        <Pane textAlign='center' marginTop={majorScale(2)}>
          <Label fontSize={majorScale(8)} lineHeight={1}>
            Theo dõi vấn đề mà bạn sẽ thích sử dụng
          </Label>
          <img
            src={imgs.depositphotos}
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
            Theo dõi vấn đề của Linear linh hoạt, trực quan và nhanh chóng.
          </p>
        </Pane>
      </Pane>
      {/* TODO: More content */}
    </Pane>
  )
}
