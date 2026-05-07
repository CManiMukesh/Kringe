import { useState, useEffect, useRef } from 'react';
import './PostModal.css';

const PostModal = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const MAX_CHARS = 180;

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CHARS) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(trimmed);
      setContent('');
      setCharCount(0);
      onClose();
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">SCREAM INTO THE VOID</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <textarea
          ref={textareaRef}
          className="modal-textarea"
          placeholder="What's burning your mind?&#10;Drop your chaos.&#10;Say something unfiltered..."
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          maxLength={MAX_CHARS}
          autoFocus
          wrap="hard"
        />
        
        <div className="modal-footer">
          <span className={`char-counter ${charCount === MAX_CHARS ? 'char-warning' : ''}`}>
            {charCount}/{MAX_CHARS}
          </span>
          <button 
            className="modal-submit" 
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? '...' : 'POST'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;