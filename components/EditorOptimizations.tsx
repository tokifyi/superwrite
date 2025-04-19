'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Editor } from '@tiptap/react'
import debounce from 'lodash/debounce'

export const useEditorOptimizations = (editor: Editor | null) => {
  // Reference to store the editor state
  const editorStateRef = useRef<any>(null)
  
  // Debounced content update function
  const debouncedUpdate = useCallback(
    debounce((content: any) => {
      // Save content to localStorage or call API
      localStorage.setItem('superwrite-content', JSON.stringify(content))
      console.log('Content saved (debounced)')
    }, 1000),
    []
  )
  
  // Optimize editor updates
  useEffect(() => {
    if (!editor) return
    
    const handleUpdate = ({ editor }: { editor: Editor }) => {
      const content = editor.getJSON()
      
      // Only update if content has actually changed
      if (JSON.stringify(content) !== JSON.stringify(editorStateRef.current)) {
        editorStateRef.current = content
        debouncedUpdate(content)
      }
    }
    
    editor.on('update', handleUpdate)
    
    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor, debouncedUpdate])
  
  // Lazy loading of heavy editor features
  useEffect(() => {
    if (!editor) return
    
    // Load additional extensions only when needed
    const loadExtensions = async () => {
      const { default: Collaboration } = await import('@tiptap/extension-collaboration')
      const { default: CollaborationCursor } = await import('@tiptap/extension-collaboration-cursor')
      
      // Add extensions to editor
      editor.registerExtension(
        Collaboration.configure({
          // configuration
        })
      )
      
      editor.registerExtension(
        CollaborationCursor.configure({
          // configuration
        })
      )
    }
    
    // Only load these extensions if collaboration is enabled
    if (localStorage.getItem('collaboration-enabled') === 'true') {
      loadExtensions()
    }
  }, [editor])
  
  return {
    // Additional optimization utilities could be exposed here
  }
} 