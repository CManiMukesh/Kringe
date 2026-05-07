import express from 'express';
import Post from '../models/Post.js';
import { validatePostContent } from '../middleware/validation.js';
import { checkSpamAndLimits } from '../middleware/spamPrevention.js';
import { generateAnonymousLabel } from '../utils/generateLabel.js';
import { cleanText } from '../utils/profanity.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const before = req.query.before;
    
    let query = {};
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    const sanitizedPosts = posts.map(post => ({
      ...post,
      content: cleanText(post.content)
    }));
    
    res.json({
      posts: sanitizedPosts,
      hasMore: posts.length === limit,
      nextCursor: posts.length ? posts[posts.length - 1].createdAt : null
    });
  } catch (error) {
    console.error('GET /posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/', validatePostContent, checkSpamAndLimits, async (req, res) => {
  try {
    const { content } = req.body;
    const { ipHash } = req;
    
    const anonymousLabel = generateAnonymousLabel();
    
    const post = await Post.create({
      content: cleanText(content),
      anonymousLabel,
      ipHash,
      createdAt: new Date()
    });
    
    const { ipHash: _, ...safePost } = post.toObject();
    res.status(201).json(safePost);
  } catch (error) {
    console.error('POST /posts error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;