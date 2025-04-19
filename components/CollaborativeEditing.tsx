'use client'

import { useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

interface CollaborationProps {
  editor: Editor | null
  documentId: string
  user: {
    id: string
    name: string
    color?: string
  }
}

export const useCollaboration = ({ editor, documentId, user }: CollaborationProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  
  useEffect(() => {
    if (!editor || !documentId) return
    
    // Initialize Yjs document
    const ydoc = new Y.Doc()
    
    // Set up WebSocket provider for real-time collaboration
    const provider = new WebsocketProvider(
      'wss://your-collaboration-server.com',
      `document-${documentId}`,
      ydoc
    )
    
    // Set up IndexedDB provider for offline persistence
    const indexeddbProvider = new IndexeddbPersistence(
      `document-${documentId}`,
      ydoc
    )
    
    // Set user information
    provider.awareness.setLocalStateField('user', {
      name: user.name,
      color: user.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      id: user.id,
    })
    
    // Track connection status
    provider.on('status', (event: { status: string }) => {
      setIsConnected(event.status === 'connected')
    })
    
    // Track active users
    provider.awareness.on('change', () => {
      const users: any[] = []
      provider.awareness.getStates().forEach((state: any, clientId: number) => {
        if (state.user) {
          users.push({
            clientId,
            ...state.user,
          })
        }
      })
      setActiveUsers(users)
    })
    
    // Clean up on unmount
    return () => {
      provider.disconnect()
      ydoc.destroy()
    }
  }, [editor, documentId, user])
  
  return {
    isConnected,
    activeUsers,
  }
} 