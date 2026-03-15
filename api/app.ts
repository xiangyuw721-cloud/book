/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import authRoutes from './routes/auth.js'
import generateRoutes from './routes/generate.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

console.log('[env] GOOGLE_API_KEY present:', Boolean(process.env.GOOGLE_API_KEY))

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
if (proxyUrl) {
  setGlobalDispatcher(new ProxyAgent(proxyUrl))
  console.log('[env] HTTP proxy enabled:', proxyUrl)
}

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/generate', generateRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * API 404 handler
 */
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

/**
 * Serve static files from the React app
 */
app.use(express.static(path.join(__dirname, '../dist')))

/**
 * The "catchall" handler: for any request that doesn't
 * match one above, send back React's index.html file.
 */
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response) => {
  console.error(error)
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})


export default app
