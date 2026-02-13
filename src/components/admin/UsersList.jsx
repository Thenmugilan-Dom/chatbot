import { useState, useEffect } from 'react'
import './UsersList.css'

function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        setError('')
      } else {
        setError('Failed to fetch users')
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchUsers()
        setError('')
      } else {
        setError('Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      setError('Error deleting user')
    }
  }

  const handleExportCSV = () => {
    if (users.length === 0) {
      alert('No users to export')
      return
    }

    let csv = 'Name,Email,Phone,Messages Count,Last Message\n'
    users.forEach(user => {
      const lastMessage = user.messages && user.messages.length > 0 
        ? user.messages[user.messages.length - 1].text.substring(0, 50)
        : 'N/A'
      csv += `"${user.name}","${user.email}","${user.phone}",${user.messages?.length || 0},"${lastMessage}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="users-loading">Loading users...</div>
  }

  const uniqueUsers = Array.from(new Map(users.map(u => [u.email, u])).values())

  return (
    <div className="users-list">
      <div className="users-header">
        <h2>Collected Users</h2>
        <div className="users-actions">
          <button onClick={fetchUsers} className="btn-refresh">
            Refresh
          </button>
          <button onClick={handleExportCSV} className="btn-export">
            Export CSV
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{uniqueUsers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Messages</div>
          <div className="stat-value">{users.length}</div>
        </div>
      </div>

      <div className="users-container">
        {uniqueUsers.length === 0 ? (
          <div className="no-users">
            <p>No users yet. Users will appear here when they interact with the chatbot.</p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Messages</th>
                  <th>Last Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uniqueUsers.map((user, index) => {
                  const userMessages = users.filter(u => u.email === user.email)
                  const lastMessage = userMessages.length > 0 
                    ? userMessages[userMessages.length - 1].createdAt 
                    : 'N/A'
                  
                  return (
                    <tr key={user.id} className="user-row">
                      <td className="user-name">{user.name || 'N/A'}</td>
                      <td className="user-email">{user.email}</td>
                      <td className="user-phone">{user.phone || 'N/A'}</td>
                      <td className="user-messages">
                        <span className="message-badge">{userMessages.length}</span>
                      </td>
                      <td className="user-last-message">
                        {lastMessage !== 'N/A' 
                          ? new Date(lastMessage).toLocaleString() 
                          : 'N/A'}
                      </td>
                      <td className="user-actions">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn-delete-user"
                          title="Delete user"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersList
