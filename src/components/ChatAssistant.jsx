import { useState } from 'react'
import './ChatAssistant.css'

function ChatAssistant({ messages, onSendMessage, onEmailSubmit, showEmailPrompt, onClose, onAddMessage, userData }) {
  const [inputValue, setInputValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [step, setStep] = useState(1) // 1: name, 2: number, 3: email

  // Function to save message to database
  const saveChatbotMessage = async (message, messageType = 'user') => {
    try {
      await fetch('http://localhost:5000/api/messages/chatbot/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_email: userData?.email || 'guest',
          user_name: userData?.name || 'Guest',
          user_phone: userData?.number || 'N/A',
          message,
          message_type: messageType
        })
      })
    } catch (error) {
      console.error('Failed to save chatbot message:', error)
    }
  }

  const handleSendClick = () => {
    if (showEmailPrompt) {
      if (step === 1 && nameValue.trim()) {
        // Add name to chat
        onAddMessage(nameValue, 'user')
        onAddMessage(`Great! ${nameValue}. Now please enter your phone number.`, 'bot')
        setStep(2)
        setNameValue('')
      } else if (step === 2 && numberValue.trim()) {
        // Add phone to chat
        onAddMessage(numberValue, 'user')
        onAddMessage('Perfect! Now please share your email address.', 'bot')
        setStep(3)
        setNumberValue('')
      } else if (step === 3 && emailValue.trim()) {
        // Add email to chat
        onAddMessage(emailValue, 'user')
        onAddMessage('Excellent! All set! You can now chat with me. How can I help you today?', 'bot')
        onEmailSubmit({ name: nameValue, number: numberValue, email: emailValue })
        setEmailValue('')
        setNameValue('')
        setNumberValue('')
        setStep(1)
      }
    } else if (!showEmailPrompt && inputValue.trim()) {
      // Save user message
      saveChatbotMessage(inputValue, 'user')
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendClick()
    }
  }

  return (
    <div className="chat-assistant">
      <div className="chat-header">
        <div className="chat-header-content">
          <h3>Chat Assistant</h3>
          <p>Always here to help</p>
        </div>
        {onClose && (
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
            ✕
          </button>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        {showEmailPrompt ? (
          <>
            {step === 1 && (
              <>
                <p className="email-prompt">What's your name?</p>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your name..."
                    className="chat-input"
                  />
                  <button onClick={handleSendClick} className="send-btn">
                    ➤
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <p className="email-prompt">Please enter your phone number:</p>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    value={numberValue}
                    onChange={(e) => setNumberValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter phone number..."
                    className="chat-input"
                  />
                  <button onClick={handleSendClick} className="send-btn">
                    ➤
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <p className="email-prompt">Finally, what's your email address?</p>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your email..."
                    className="chat-input"
                  />
                  <button onClick={handleSendClick} className="send-btn">
                    ➤
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button onClick={handleSendClick} className="send-btn">
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatAssistant
