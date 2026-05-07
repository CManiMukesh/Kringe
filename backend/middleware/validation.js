export const validatePostContent = (req, res, next) => {
  const { content } = req.body;
  
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Post content is required' });
  }
  
  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    return res.status(400).json({ error: 'Post cannot be empty' });
  }
  
  if (trimmedContent.length > 180) {
    return res.status(400).json({ error: 'Post must be 180 characters or less' });
  }
  
  req.body.content = trimmedContent;
  next();
};