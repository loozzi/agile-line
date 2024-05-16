import { useEffect } from 'react'
import { useParams } from 'react-router'
import activityService from '~/services/activity.service'

export const ActivityPage = () => {
  const params = useParams()
  useEffect(() => {
    if (params.permalink)
      activityService.getNew(params.permalink).then((res) => {
        console.log(res)
      })
  }, [params])

  return <div>ActivityPage</div>
}
