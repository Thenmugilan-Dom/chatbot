import { useState } from 'react'
import './ChatAssistant.css'

function ChatAssistant({ messages, onSendMessage, onEmailSubmit, showEmailPrompt, onClose }) {
  const [inputValue, setInputValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [step, setStep] = useState(1) // 1: number, 2: name, 3: email

  const handleSendClick = () => {
    if (showEmailPrompt) {
      if (step === 1 && numberValue.trim()) {
        setStep(2)
        setNumberValue('')
      } else if (step === 2 && nameValue.trim()) {
        setStep(3)
        setNameValue('')
      } else if (step === 3 && emailValue.trim()) {
        onEmailSubmit({ number: numberValue, name: nameValue, email: emailValue })
        setEmailValue('')
        setNameValue('')
        setNumberValue('')
        setStep(1)
      }
    } else if (!showEmailPrompt && inputValue.trim()) {
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
                <p className="email-prompt">Please enter your phone number to get started:</p>
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
            {step === 2 && (
              <>
                <p className="email-prompt">Great! What's your name?</p>
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
            {step === 3 && (
              <>
                <p className="email-prompt">Finally, could you share your email address?</p>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter email address..."
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
