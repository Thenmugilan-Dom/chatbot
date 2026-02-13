import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'
import Sidebar from '../components/admin/Sidebar'
import MessagesList from '../components/admin/MessagesList'
import ChatbotMessagesList from '../components/admin/ChatbotMessagesList'
import ContentManager from '../components/admin/ContentManager'
import QAManager from '../components/admin/QAManager'
import UsersList from '../components/admin/UsersList'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('messages')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        navigate('/admin/login')
        return
      }

      const response = await fetch('http://localhost:5000/api/messages/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        navigate('/admin/login')
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    navigate('/admin/login')
  }

  if (loading) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <div className="admin-dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <div className="admin-main">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-user">
            <span>{localStorage.getItem('adminEmail')}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        {stats && activeTab === 'messages' && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Messages</div>
            </div>
            <div className="stat-card new">
              <div className="stat-number">{stats.new}</div>
              <div className="stat-label">New</div>
            </div>
            <div className="stat-card read">
              <div className="stat-number">{stats.read}</div>
              <div className="stat-label">Read</div>
            </div>
            <div className="stat-card resolved">
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
        )}

        <div className="admin-content">
          {activeTab === 'messages' && <MessagesList />}
          {activeTab === 'chatbot' && <ChatbotMessagesList />}
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'qa' && <QAManager />}
          {activeTab === 'users' && <UsersList />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
