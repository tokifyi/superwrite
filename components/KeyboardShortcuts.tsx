'use client'

import { useEffect } from 'react'
import { Editor } from '@tiptap/react'

export const useKeyboardShortcuts = (
  editor: Editor | null,
  {
    toggleSidebar,
    toggleAiChat,
    toggleTheme,
  }: {
    toggleSidebar: () => void
    toggleAiChat: () => void
    toggleTheme: () => void
  }
) => {
  useEffect(() => {
    if (!editor) return
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for modifier keys
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const mod = isMac ? event.metaKey : event.ctrlKey
      
      // Ctrl/Cmd + / to toggle sidebar
      if (mod && event.key === '/') {
        event.preventDefault()
        toggleSidebar()
      }
      
      // Ctrl/Cmd + . to toggle AI chat
      if (mod && event.key === '.') {
        event.preventDefault()
        toggleAiChat()
      }
      
      // Ctrl/Cmd + Shift + L to toggle theme
      if (mod && event.shiftKey && event.key === 'L') {
        event.preventDefault()
        toggleTheme()
      }
      
      // Ctrl/Cmd + S to save
      if (mod && event.key === 's') {
        event.preventDefault()
        // Save document
        const content = editor.getJSON()
        localStorage.setItem('superwrite-content', JSON.stringify(content))
        console.log('Document saved')
      }
      
      // Ctrl/Cmd + Shift + F for focus mode
      if (mod && event.shiftKey && event.key === 'F') {
        event.preventDefault()
        document.documentElement.requestFullscreen()
      }
    }
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown)
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, toggleSidebar, toggleAiChat, toggleTheme])
  
  // Return keyboard shortcut information for help menu
  return {
    shortcuts: [
      { key: 'Ctrl/Cmd + /', description: 'Toggle sidebar' },
      { key: 'Ctrl/Cmd + .', description: 'Toggle AI chat' },
      { key: 'Ctrl/Cmd + Shift + L', description: 'Toggle theme' },
      { key: 'Ctrl/Cmd + S', description: 'Save document' },
      { key: 'Ctrl/Cmd + Shift + F', description: 'Enter focus mode' },
      { key: 'Ctrl/Cmd + B', description: 'Bold' },
      { key: 'Ctrl/Cmd + I', description: 'Italic' },
      { key: 'Ctrl/Cmd + U', description: 'Underline' },
      { key: 'Ctrl/Cmd + K', description: 'Add link' },
      { key: 'Ctrl/Cmd + Shift + C', description: 'Clear formatting' },
    ]
  }
} 