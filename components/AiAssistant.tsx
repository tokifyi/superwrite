'use client'

import { useState } from 'react'
import { Editor } from '@tiptap/react'

interface AiAssistantProps {
  editor: Editor | null
}

export const AiAssistant = ({ editor }: AiAssistantProps) => {
  const [isLoading, setIsLoading] = useState(false)
  
  // AI writing suggestions
  const generateContinuation = async () => {
    if (!editor) return
    
    setIsLoading(true)
    
    try {
      // Get the current content
      const content = editor.getText()
      
      // In a real implementation, you would call your AI API here
      // This is a placeholder for demonstration
      const response = await fetch('/api/ai/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      
      const data = await response.json()
      
      // Insert the AI-generated text
      if (data.continuation) {
        editor.commands.insertContent(data.continuation)
      }
    } catch (error) {
      console.error('Error generating continuation:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // AI rewriting
  const rewriteSelection = async (style: string) => {
    if (!editor) return
    
    const { from, to } = editor.state.selection
    if (from === to) return // No selection
    
    setIsLoading(true)
    
    try {
      const selectedText = editor.state.doc.textBetween(from, to)
      
      // In a real implementation, you would call your AI API here
      const response = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: selectedText, style }),
      })
      
      const data = await response.json()
      
      // Replace the selected text with the rewritten version
      if (data.rewritten) {
        editor
          .chain()
          .focus()
          .deleteRange({ from, to })
          .insertContent(data.rewritten)
          .run()
      }
    } catch (error) {
      console.error('Error rewriting text:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // AI summarization
  const summarizeContent = async () => {
    if (!editor) return
    
    setIsLoading(true)
    
    try {
      const content = editor.getText()
      
      // In a real implementation, you would call your AI API here
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      
      const data = await response.json()
      
      // Return the summary to be displayed in the AI chat
      return data.summary
    } catch (error) {
      console.error('Error summarizing content:', error)
      return 'Failed to generate summary.'
    } finally {
      setIsLoading(false)
    }
  }
  
  return {
    generateContinuation,
    rewriteSelection,
    summarizeContent,
    isLoading
  }
} 