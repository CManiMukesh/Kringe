import './PostCard.css';

const formatRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'yesterday';
  return `${diffDay}d ago`;
};

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <div className="post-content">
        <p className="post-text">{post.content}</p>
      </div>
      <div className="post-footer">
        <span className="post-label">{post.anonymousLabel}</span>
        <span className="post-time">{formatRelativeTime(post.createdAt)}</span>
      </div>
    </div>
  );
};

export default PostCard;