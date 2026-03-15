/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

/**
 * User Login
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = (req.body ?? {}) as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ success: false, error: '请提供 email 和 password' })
    return
  }

  res.json({ success: true, message: 'register ok' })
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = (req.body ?? {}) as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ success: false, error: '请提供 email 和 password' })
    return
  }

  res.json({ success: true, message: 'login ok' })
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const { email } = (req.body ?? {}) as { email?: string }
  res.json({ success: true, message: 'logout ok', email: email || null })
})

export default router
