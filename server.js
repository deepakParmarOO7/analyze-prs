// server.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import OpenAI from 'openai'

dotenv.config()

const app = express()
const PORT = 3001

const openai = new OpenAI({
  apiKey: process.env.VITE_OPEN_API_KEY
})

app.use(cors())
app.use(bodyParser.json())

// Batch analyze multiple comments
app.post('/api/analyze-comments', async (req, res) => {
  try {
    const { comments } = req.body // expects an array

    if (!comments || !Array.isArray(comments)) {
      return res.status(400).json({ error: 'comments[] required' })
    }

    const results = await Promise.all(
      comments.map(async ({ comment, codeSnippet, file, line }) => {
        const prompt = `
You are a senior developer reviewing code. 
Given the following PR comment and code, respond in JSON with:
{
  "summary": "what the reviewer means",
  "validity": "valid | outdated | unclear",
  "improvements": "possible improvements for the code",
  "bestPractices": "related best practices"
}

Comment:
"${comment}"

Code Snippet:
${codeSnippet}

File: ${file}
Line: ${line}
        `

        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            response_format: { type: 'json_object' } // force JSON output
          })

          return {
            file,
            line,
            comment,
            ai: JSON.parse(response.choices[0].message.content)
          }
        } catch (err) {
          console.error('❌ OpenAI error on one comment:', err)
          return { file, line, comment, ai: { summary: '', validity: 'error', improvements: '', bestPractices: '' } }
        }
      })
    )

    res.json(results)
  } catch (err) {
    console.error('❌ OpenAI Error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
