// server.js (ESM-compatible)
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

app.post('/api/summarize', async (req, res) => {
  try {
    const { comment, codeSnippet, file, line } = req.body

    const prompt = `You are a senior developer reviewing code. Given the following PR comment and code, explain:

1. What the reviewer is trying to say

Comment:
"${comment}"

Code Snippet:
${codeSnippet}

File: ${file}
Line: ${line}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    })

    res.json({ summary: response.choices[0].message.content })
  } catch (err) {
    console.error('❌ OpenAI Error:', err)
    res.status(500).json({ error: err })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
