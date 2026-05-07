import Post from '../models/Post.js';
import { containsProfanity } from '../utils/profanity.js';
import { hashIP } from '../utils/ipHash.js';

export const checkSpamAndLimits = async (req, res, next) => {
  const { content } = req.body;
  
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const ipHash = hashIP(clientIP);
  
  if (containsProfanity(content)) {
    return res.status(400).json({ 
      error: 'Your post contains filtered language. Keep it chaotic but respectful.' 
    });
  }
  
  const twentySecondsAgo = new Date(Date.now() - 20 * 1000);
  const recentPost = await Post.findOne({
    ipHash: ipHash,
    createdAt: { $gte: twentySecondsAgo }
  });
  
  if (recentPost) {
    return res.status(429).json({ 
      error: 'Wait a moment before posting again. Let others speak.' 
    });
  }
  
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const duplicatePost = await Post.findOne({
    ipHash: ipHash,
    content: content,
    createdAt: { $gte: twoMinutesAgo }
  });
  
  if (duplicatePost) {
    return res.status(400).json({ 
      error: 'You already posted this thought. Say something new.' 
    });
  }
  
  req.ipHash = ipHash;
  next();
};