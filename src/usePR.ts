import axios from "axios"
import { useEffect, useState } from "react"
import type { PullRequestReviewComment } from "./type"

const BASE_URL = "https://api.github.com/repos/CatalystOne/one-to-one-react/pulls/comments"

export const usePullRequest = () => {
  const [data, setData] = useState<any[]>([])

  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
    Accept: "application/vnd.github+json",
  }

  useEffect(() => {

    const fetchCommentsWithFileContext = async () => {

      let page = 1
      const allComments: PullRequestReviewComment[] = []
      const fileCache = new Map<string, string>() // cache for file contents

      try {
        // fetch all pages until no more comments
        while (page<=1) {
          const response = await axios.get(BASE_URL, {
            headers,
            params: {
              per_page: 10, // fetch more per request to reduce API calls
              page,
            },
          })

          const comments = response.data
          if (!comments || comments.length === 0) break

          allComments.push(...comments)
          page++
        }
        
        // enrich comments with file content (using cache)
        const enrichedComments = await Promise.all(
          allComments.map(async (comment) => {
            const { path, line, body, diff_hunk, commit_id, user, html_url } = comment

            let fileContent = ""
            const cacheKey = `${commit_id}:${path}`

            try {
              if (fileCache.has(cacheKey)) {
                fileContent = fileCache.get(cacheKey) || ""
              } else {
                const rawUrl = `https://raw.githubusercontent.com/CatalystOne/one-to-one-react/${commit_id}/${path}`
                const rawResponse = await axios.get(rawUrl)
                fileContent = rawResponse.data
                fileCache.set(cacheKey, fileContent) // save in cache
              }
            } catch (error) {
              console.warn(`Could not fetch content for ${path} at ${commit_id}`)
            }

            return {
              file: path,
              line,
              comment: body,
              commitId: commit_id,
              codeSnippet: diff_hunk,
              fileContent,
              prUrl: html_url,
              author: user?.login,
            }
          })
        )

        
        analyzeComments(enrichedComments).then((res) => {
        //setAnalyzed(res) // contains AI summaries per comment
        console.log(res);
        setData(res)
    })
      } catch (error) {
        console.error("Error fetching PR comments:", error)
      }
    }

    fetchCommentsWithFileContext()
    
  }, [])

  async function analyzeComments(comments: any[]) {
    const resp = await fetch('http://localhost:3001/api/analyze-comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments })
    })
    return await resp.json()
  }


  return { data }
}
