import './FloatingChatButton.css'

function FloatingChatButton({ isOpen, onClick }) {
  return (
    <button 
      className={`floating-chat-btn ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      aria-label="Toggle chat assistant"
      title="Chat Assistant"
    >
      <span className="chat-icon">
        {isOpen ? '✕' : '💬'}
      </span>
    </button>
  )
}

export default FloatingChatButton
