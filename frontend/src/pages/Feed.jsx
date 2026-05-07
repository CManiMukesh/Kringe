import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPosts, createPost } from '../api/client';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import FloatingButton from '../components/FloatingButton';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  const feedRef = useRef(null);
  const isLoadingRef = useRef(false);
  const lastPostTimestampRef = useRef(null);

  const showToast = (message, isError = true) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const loadInitialPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPosts(null, 10);
      setPosts(data.posts);
      setHasMore(data.hasMore);
      if (data.posts.length > 0) {
        lastPostTimestampRef.current = data.nextCursor;
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load the void. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOlderPosts = useCallback(async () => {
    if (loadingMore || !hasMore || isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoadingMore(true);
    
    try {
      const before = lastPostTimestampRef.current;
      if (!before) {
        setHasMore(false);
        return;
      }
      
      const data = await fetchPosts(before, 10);
      
      if (data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
        setHasMore(data.hasMore);
        lastPostTimestampRef.current = data.nextCursor;
      }
    } catch (err) {
      console.error('Failed to load more posts:', err);
      showToast('Failed to load more thoughts.');
    } finally {
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [loadingMore, hasMore]);

  const handlePostSubmit = async (content) => {
    try {
      const newPost = await createPost(content);
      setPosts(prev => [newPost, ...prev]);
      if (feedRef.current) {
        feedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      showToast('Thought released into the void!', false);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to post. Try again.';
      showToast(errorMsg);
    }
  };

  const handleScroll = useCallback(() => {
    if (!feedRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      loadOlderPosts();
    }
  }, [loadOlderPosts]);

  useEffect(() => {
    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
      return () => feedElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  return (
    <div className="feed-container">
      <div className="feed-header">
        <span className="feed-title">Kringe</span>
        <span className="feed-stats">{posts.length} thoughts</span>
      </div>
      
      <div className="feed-scroll" ref={feedRef}>
        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>summoning thoughts...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>⚠️ {error}</p>
            <button onClick={loadInitialPosts} className="retry-btn">
              retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>void is empty.</p>
            <p>be the first to scream.</p>
          </div>
        ) : (
          <>
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} />
            ))}
            {loadingMore && (
              <div className="loading-more">
                <div className="loader-small"></div>
                <span>dredging deeper...</span>
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <div className="end-message">
                <span>⚡ you've reached the forgotten depths ⚡</span>
              </div>
            )}
          </>
        )}
      </div>
      
      <FloatingButton onClick={() => setIsModalOpen(true)} />
      
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostSubmit}
      />
      
      {toast && (
        <div className={`toast ${toast.isError ? 'toast-error' : 'toast-success'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Feed;