import { useState, useEffect } from 'react'
import './ChatbotMessagesList.css'

const styles = {
  container: {
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '8px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    margin: 0,
    color: '#1f2937',
    fontSize: '24px'
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '8px 16px',
    border: '2px solid #e5e7eb',
    background: 'white',
    color: '#6b7280',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s ease'
  },
  filterBtnActive: {
    background: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },
  conversationCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '8px',
    overflow: 'hidden',
    background: 'white'
  },
  conversationHeader: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background 0.2s ease'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    margin: 0,
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 600
  },
  userEmail: {
    margin: '4px 0 0 0',
    color: '#6b7280',
    fontSize: '13px',
    fontWeight: 500
  },
  conversationStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'right'
  },
  messageCount: {
    display: 'inline-block',
    background: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600
  },
  conversationMessages: {
    background: '#f9fafb',
    padding: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  chatMessage: {
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '8px',
    borderLeft: '4px solid #e5e7eb'
  },
  chatMessageUser: {
    borderLeftColor: '#3b82f6',
    background: '#eff6ff'
  },
  chatMessageBot: {
    borderLeftColor: '#10b981',
    background: '#f0fdf4'
  },
  messageContent: {
    color: '#1f2937',
    fontSize: '14px',
    lineHeight: 1.5
  }
}

function ChatbotMessagesList() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchChatbotMessages()
  }, [])

  const fetchChatbotMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/messages/chatbot/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch chatbot messages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group messages by user
  const groupedMessages = messages.reduce((acc, msg) => {
    const email = msg.user_email
    if (!acc[email]) {
      acc[email] = []
    }
    acc[email].push(msg)
    return acc
  }, {})

  // Get unique users
  const users = Object.keys(groupedMessages).map(email => {
    const userMsgs = groupedMessages[email]
    return {
      email,
      name: userMsgs[0]?.user_name || 'Guest',
      phone: userMsgs[0]?.user_phone || 'N/A',
      messageCount: userMsgs.length,
      lastMessage: userMsgs[0]?.created_at,
      messages: userMsgs
    }
  })

  const filteredUsers = filter === 'all'
    ? users
    : users.filter(u => {
      if (filter === 'users') return u.email !== 'guest'
      if (filter === 'guests') return u.email === 'guest'
      return true
    })

  if (loading) {
    return <div className="loading">Loading chatbot messages...</div>
  }

  return (
    <div className="chatbot-messages-list" style={styles.container}>
      <div className="messages-header" style={styles.header}>
        <h2 style={styles.title}>Chatbot Conversations</h2>
        <div className="filter-buttons" style={styles.filterButtons}>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            style={{...styles.filterBtn, ...(filter === 'all' ? styles.filterBtnActive : {})}}
          >
            All ({users.length})
          </button>
          <button
            className={`filter-btn ${filter === 'users' ? 'active' : ''}`}
            onClick={() => setFilter('users')}
            style={{...styles.filterBtn, ...(filter === 'users' ? styles.filterBtnActive : {})}}
          >
            Registered Users ({users.filter(u => u.email !== 'guest').length})
          </button>
          <button
            className={`filter-btn ${filter === 'guests' ? 'active' : ''}`}
            onClick={() => setFilter('guests')}
            style={{...styles.filterBtn, ...(filter === 'guests' ? styles.filterBtnActive : {})}}
          >
            Guests ({users.filter(u => u.email === 'guest').length})
          </button>
        </div>
      </div>

      <div className="messages-table">
        {filteredUsers.length === 0 ? (
          <div className="no-messages">No chatbot conversations found</div>
        ) : (
          <div className="conversation-list">
            {filteredUsers.map(user => (
              <div key={user.email} className="conversation-card" style={styles.conversationCard}>
                <div
                  className="conversation-header"
                  onClick={() => setExpandedId(expandedId === user.email ? null : user.email)}
                  style={styles.conversationHeader}
                >
                  <div className="user-info" style={styles.userInfo}>
                    <h3 style={styles.userName}>{user.name}</h3>
                    <p className="user-email" style={styles.userEmail}>{user.email}</p>
                    <p className="user-phone" style={styles.userPhone}>{user.phone}</p>
                  </div>
                  <div className="conversation-stats" style={styles.conversationStats}>
                    <span className="message-count" style={styles.messageCount}>{user.messageCount} messages</span>
                    <span className="last-message">
                      {new Date(user.lastMessage).toLocaleDateString()}
                    </span>
                    <span className="expand-icon">
                      {expandedId === user.email ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {expandedId === user.email && (
                  <div className="conversation-messages" style={styles.conversationMessages}>
                    {user.messages.map((msg) => (
                      <div key={msg.id} className={`chat-message ${msg.message_type}`} style={{...styles.chatMessage, ...(msg.message_type === 'user' ? styles.chatMessageUser : styles.chatMessageBot)}}>
                        <div className="message-type">
                          {msg.message_type === 'user' ? '👤 User' : '🤖 Bot'}
                        </div>
                        <div className="message-content" style={styles.messageContent}>
                          {msg.message}
                        </div>
                        <div className="message-time">
                          {new Date(msg.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatbotMessagesList
