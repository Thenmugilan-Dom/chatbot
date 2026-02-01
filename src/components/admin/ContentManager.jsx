import { useState, useEffect } from 'react'
import './ContentManager.css'

function ContentManager() {
  const [contentSections, setContentSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    additionalText: ''
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setContentSections(data)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('adminToken')
      const url = editingId 
        ? `http://localhost:5000/api/content/${editingId}`
        : 'http://localhost:5000/api/content'
      
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchContent()
        setFormData({ title: '', description: '', additionalText: '' })
        setEditingId(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to save content:', error)
    }
  }

  const handleEdit = (content) => {
    setFormData({
      title: content.title,
      description: content.description,
      additionalText: content.additionalText
    })
    setEditingId(content.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`http://localhost:5000/api/content/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          fetchContent()
        }
      } catch (error) {
        console.error('Failed to delete content:', error)
      }
    }
  }

  const handleCancel = () => {
    setFormData({ title: '', description: '', additionalText: '' })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="loading">Loading content...</div>
  }

  return (
    <div className="content-manager">
      <div className="content-header">
        <h2>Manage Content</h2>
        {!showForm && (
          <button 
            className="add-btn"
            onClick={() => setShowForm(true)}
          >
            + Add New Section
          </button>
        )}
      </div>

      {showForm && (
        <form className="content-form" onSubmit={handleSave}>
          <h3>{editingId ? 'Edit Section' : 'Add New Section'}</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalText">Additional Text</label>
            <textarea
              id="additionalText"
              name="additionalText"
              value={formData.additionalText}
              onChange={handleInputChange}
              rows="2"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="content-grid">
        {contentSections.map(section => (
          <div key={section.id} className="content-card">
            <h3>{section.title}</h3>
            <p className="description">{section.description}</p>
            <p className="additional">{section.additionalText}</p>
            <div className="card-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(section)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(section.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContentManager
