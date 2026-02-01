import { useState, useEffect } from 'react'
import './MessagesList.css'

function MessagesList() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to update message status:', error)
    }
  }

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          fetchMessages()
        }
      } catch (error) {
        console.error('Failed to delete message:', error)
      }
    }
  }

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => m.status === filter)

  if (loading) {
    return <div className="loading">Loading messages...</div>
  }

  return (
    <div className="messages-list">
      <div className="messages-header">
        <h2>Messages</h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({messages.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            New ({messages.filter(m => m.status === 'new').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({messages.filter(m => m.status === 'read').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved ({messages.filter(m => m.status === 'resolved').length})
          </button>
        </div>
      </div>

      <div className="messages-table">
        {filteredMessages.length === 0 ? (
          <div className="no-messages">No messages found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map(message => (
                <tr key={message.id}>
                  <td>{message.email}</td>
                  <td className="message-text">{message.message}</td>
                  <td>{new Date(message.timestamp).toLocaleDateString()}</td>
                  <td>
                    <select 
                      className={`status-select status-${message.status}`}
                      value={message.status}
                      onChange={(e) => handleStatusChange(message.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(message.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default MessagesList
