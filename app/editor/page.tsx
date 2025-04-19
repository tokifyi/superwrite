'use client'

import { useState, useEffect } from 'react'
import Tiptap from '../../components/Tiptap'

export default function Editor() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isFocusMode, setIsFocusMode] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle focus mode with Cmd/Ctrl + \
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        setIsFocusMode(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-[#191919] text-[#ededed]' : 'bg-[#fafafa] text-[#1a1a1a]'}`}>
      {/* Theme Toggle */}
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-4 transition-opacity duration-200 ${isFocusMode ? 'opacity-0 hover:opacity-100' : 'opacity-60 hover:opacity-100'}`}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full transition-all duration-200 ${
            isDarkMode 
              ? 'hover:bg-[#2a2a2a] text-[#999]' 
              : 'hover:bg-gray-100 text-[#999]'
          }`}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="pt-20">
        <main className={`max-w-3xl mx-auto px-6 transition-all duration-200 ${isFocusMode ? 'max-w-2xl' : ''}`}>
          <Tiptap isDarkMode={isDarkMode} isFocusMode={isFocusMode} />
        </main>
      </div>
    </div>
  )
} 