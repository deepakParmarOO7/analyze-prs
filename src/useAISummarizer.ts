import { useState } from "react"

export const useAiSummarizer = () => {
    const [summary, setSummary] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const summarizeComment = async (context: any) => {
        setLoading(true)
        setError(null)
        setSummary(null)

        try {
            const response = await fetch('http://localhost:3001/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(context),
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Failed to summarize')
            setSummary(result.summary)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { summarizeComment, summary, loading, error }
}
