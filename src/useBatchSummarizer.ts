// hooks/useBatchSummarizer.ts
import { useState } from "react"
import { useAiSummarizer } from "./useAISummarizer"

export const useBatchSummarizer = () => {
  const { summarizeComment } = useAiSummarizer()
  const [summaries, setSummaries] = useState<string[]>([])
  const [batchLoading, setBatchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSummarization = async (prComments: any[]) => {
    setBatchLoading(true)
    const results: string[] = []

    for (const item of prComments) {
      try {
        const prompt = `
Reviewer Comment:
${item.comment}

Code Diff:
${item.codeSnippet}

File Content (optional):
${item.fileContent || ''}

Summarize what the reviewer is asking and whether the code needs improvement.
        `.trim()

        const summary = await summarizeComment({ prompt })
        results.push(summary)
      } catch (err: any) {
        results.push("Failed to summarize this comment.")
        setError(err.message)
      }
    }

    setSummaries(results)
    setBatchLoading(false)
  }

  return { runSummarization, summaries, batchLoading, error }
}
