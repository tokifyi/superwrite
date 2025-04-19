'use client'

import { useState, useRef, useEffect } from 'react'
import './AiChat.css'

const AiChat = ({ isOpen, toggleAiChat, theme }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextInput, setContextInput] = useState('')
  const [context, setContext] = useState('')
  const [selectedModel, setSelectedModel] = useState('claude-3.7-sonnet')
  const [showModelSelector, setShowModelSelector] = useState(false)
  const messagesEndRef = useRef(null)
  
  const models = [
    { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet' },
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4', name: 'GPT-4' },
  ]
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = { 
        role: 'assistant', 
        content: `I'm responding to your message: "${input}" using ${selectedModel}. This is a simulated response.` 
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleAddContext = () => {
    if (contextInput.trim()) {
      setContext(contextInput)
      setShowContextMenu(false)
      setContextInput('')
    }
  }

  return (
    <div className={`ai-chat ${isOpen ? 'open' : ''}`}>
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <div className="model-selector" onClick={() => setShowModelSelector(!showModelSelector)}>
            <span className="model-name">{models.find(m => m.id === selectedModel)?.name || selectedModel}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {showModelSelector && (
            <div className="model-dropdown">
              {models.map(model => (
                <div 
                  key={model.id} 
                  className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedModel(model.id)
                    setShowModelSelector(false)
                  }}
                >
                  {model.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ai-chat-actions">
          <button className="new-chat-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New</span>
          </button>
          <button className="close-btn" onClick={toggleAiChat}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="ai-chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {isTyping && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="ai-chat-footer">
        <button 
          className="context-button"
          onClick={() => setShowContextMenu(!showContextMenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Add context...
        </button>
        
        {showContextMenu && (
          <div className="context-menu">
            <textarea
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder="Add additional context for the AI..."
              rows={4}
            ></textarea>
            <div className="context-menu-actions">
              <button onClick={() => setShowContextMenu(false)}>Cancel</button>
              <button onClick={handleAddContext} disabled={!contextInput.trim()}>Add</button>
            </div>
          </div>
        )}
        
        <div className="input-container">
          <form className="ai-chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask followup (⌘Y)..."
              aria-label="Chat message"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              aria-label="Send message"
              className="send-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AiChat 