import './Sidebar.css'

function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>KPRCAS Admin</h2>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          📧 Messages
        </button>
        <button
          className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`nav-item ${activeTab === 'qa' ? 'active' : ''}`}
          onClick={() => setActiveTab('qa')}
        >
          ❓ Q&A Manager
        </button>
        <button
          className={`nav-item ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📝 Content
        </button>
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="sidebar-logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
