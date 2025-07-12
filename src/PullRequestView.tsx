import { useEffect, useState } from "react"
import { usePullRequest } from "./usePR"
import { useBatchSummarizer } from "./useBatchSummarizer"

const PullRequestView = () => {
    const { data } = usePullRequest()
    const [triggered, setTriggered] = useState(false)
    const { runSummarization, summaries, batchLoading, error } = useBatchSummarizer()
    useEffect(() => {
        if (data) {
            console.log(data);
            runSummarization(data)
            setTriggered(true)

        }

    }, [data, triggered])
   
  return (
    <div>
      <h2>PR Review Insights</h2>
      {batchLoading && <p>Summarizing comments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {summaries.map((summary, idx) => (
          <li key={idx} style={{ marginBottom: "1rem" }}>
            <strong>Summary {idx + 1}:</strong> {summary}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PullRequestView