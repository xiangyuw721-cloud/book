import express from 'express';
import { generateBookShare } from '../services/gemini.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { bookName, author, experience, mode } = req.body;
  console.log('[api] /api/generate hit', { hasBookName: Boolean(bookName), mode });

  if (!bookName) {
    return res.status(400).json({ error: '书名是必填项' });
  }

  if (!mode || (mode !== 'full' && mode !== 'partial')) {
     return res.status(400).json({ error: '无效的分享模式' });
  }

  try {
    const content = await generateBookShare({ bookName, author, experience, mode });
    res.json({ content });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: process.env.NODE_ENV === 'production' ? '生成失败，请稍后重试' : message,
    });
  }
});

export default router;
