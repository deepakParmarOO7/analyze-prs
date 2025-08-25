import { useEffect, useState } from "react"
import { usePullRequest } from "./usePR"

const PullRequestView = () => {

  const { data } = usePullRequest()
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (data) {
      console.log(data);
      // runSummarization(data)
      setTriggered(true)

    }

  }, [data, triggered])

  
  return (
    <div>
    </div>
  )
}

export default PullRequestView