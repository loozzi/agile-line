import { Pane, PaneProps } from 'evergreen-ui'

interface IssueActivityCompProps extends PaneProps {
  issue_id: number
}

export const IssueActivityComp = (props: IssueActivityCompProps) => {
  const { issue_id, ...rest } = props
  return <Pane {...rest}>IssueActivityComp</Pane>
}
