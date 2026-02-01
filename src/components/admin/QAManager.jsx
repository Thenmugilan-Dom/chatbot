import { useState, useEffect } from 'react'
import './QAManager.css'

function QAManager() {
  const [qaList, setQaList] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQAList()
  }, [])

  const fetchQAList = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/qa')
      if (response.ok) {
        const data = await response.json()
        setQaList(data)
        setError('')
      } else {
        setError('Failed to fetch Q&A list')
      }
    } catch (error) {
      console.error('Failed to fetch Q&A:', error)
      setError('Failed to load Q&A pairs')
    } finally {
      setLoading(false)
    }
  }

  const handleAddQA = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setError('Please fill in both question and answer')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: newQuestion,
          answer: newAnswer
        })
      })

      if (response.ok) {
        setNewQuestion('')
        setNewAnswer('')
        fetchQAList()
        setError('')
      } else {
        setError('Failed to add Q&A')
      }
    } catch (error) {
      console.error('Failed to add Q&A:', error)
      setError('Error adding Q&A pair')
    }
  }

  const handleUpdateQA = async (id) => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setError('Please fill in both question and answer')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/qa/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: newQuestion,
          answer: newAnswer
        })
      })

      if (response.ok) {
        setNewQuestion('')
        setNewAnswer('')
        setEditingId(null)
        fetchQAList()
        setError('')
      } else {
        setError('Failed to update Q&A')
      }
    } catch (error) {
      console.error('Failed to update Q&A:', error)
      setError('Error updating Q&A pair')
    }
  }

  const handleDeleteQA = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Q&A pair?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/qa/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchQAList()
        setError('')
      } else {
        setError('Failed to delete Q&A')
      }
    } catch (error) {
      console.error('Failed to delete Q&A:', error)
      setError('Error deleting Q&A pair')
    }
  }

  const handleEditQA = (qa) => {
    setNewQuestion(qa.question)
    setNewAnswer(qa.answer)
    setEditingId(qa.id)
    setError('')
  }

  const handleCancel = () => {
    setNewQuestion('')
    setNewAnswer('')
    setEditingId(null)
    setError('')
  }

  if (loading) {
    return <div className="qa-manager-loading">Loading Q&A pairs...</div>
  }

  return (
    <div className="qa-manager">
      <div className="qa-container">
        <h2>Manage Q&A Pairs</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="qa-form">
          <h3>{editingId ? 'Edit Q&A Pair' : 'Add New Q&A Pair'}</h3>
          
          <div className="form-group">
            <label>Question:</label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter question"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Answer:</label>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Enter answer"
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-buttons">
            {editingId ? (
              <>
                <button onClick={() => handleUpdateQA(editingId)} className="btn btn-update">
                  Update
                </button>
                <button onClick={handleCancel} className="btn btn-cancel">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleAddQA} className="btn btn-add">
                Add Q&A
              </button>
            )}
          </div>
        </div>

        <div className="qa-list">
          <h3>Existing Q&A Pairs ({qaList.length})</h3>
          
          {qaList.length === 0 ? (
            <p className="no-data">No Q&A pairs yet. Add your first one!</p>
          ) : (
            <div className="qa-items">
              {qaList.map((qa) => (
                <div key={qa.id} className="qa-item">
                  <div className="qa-content">
                    <div className="qa-question">
                      <strong>Q:</strong> {qa.question}
                    </div>
                    <div className="qa-answer">
                      <strong>A:</strong> {qa.answer}
                    </div>
                  </div>
                  <div className="qa-actions">
                    <button 
                      onClick={() => handleEditQA(qa)} 
                      className="btn-small btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteQA(qa.id)} 
                      className="btn-small btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QAManager
