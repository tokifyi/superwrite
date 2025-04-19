'use client'

import { useState, useEffect } from 'react'
import { JSONContent } from '@tiptap/react'

interface Document {
  id: string
  title: string
  content: JSONContent
  lastModified: number
  created: number
}

export const useDocumentManager = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  
  // Load documents from localStorage on mount
  useEffect(() => {
    const storedDocs = localStorage.getItem('superwrite-documents')
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs))
    }
    
    // Create a default document if none exist
    if (!storedDocs || JSON.parse(storedDocs).length === 0) {
      const defaultDoc = {
        id: crypto.randomUUID(),
        title: 'Untitled Document',
        content: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [] }]
        },
        lastModified: Date.now(),
        created: Date.now()
      }
      setDocuments([defaultDoc])
      setCurrentDocument(defaultDoc)
      localStorage.setItem('superwrite-documents', JSON.stringify([defaultDoc]))
    } else {
      // Set the most recently modified document as current
      const docs = JSON.parse(storedDocs)
      const mostRecent = docs.sort((a: Document, b: Document) => 
        b.lastModified - a.lastModified
      )[0]
      setCurrentDocument(mostRecent)
    }
  }, [])
  
  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('superwrite-documents', JSON.stringify(documents))
    }
  }, [documents])
  
  // Create a new document
  const createDocument = () => {
    const newDoc = {
      id: crypto.randomUUID(),
      title: 'Untitled Document',
      content: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [] }]
      },
      lastModified: Date.now(),
      created: Date.now()
    }
    
    setDocuments([...documents, newDoc])
    setCurrentDocument(newDoc)
    return newDoc
  }
  
  // Update a document
  const updateDocument = (id: string, updates: Partial<Document>) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === id) {
        const updatedDoc = {
          ...doc,
          ...updates,
          lastModified: Date.now()
        }
        
        // Update current document if it's the one being edited
        if (currentDocument?.id === id) {
          setCurrentDocument(updatedDoc)
        }
        
        return updatedDoc
      }
      return doc
    })
    
    setDocuments(updatedDocs)
  }
  
  // Delete a document
  const deleteDocument = (id: string) => {
    const filteredDocs = documents.filter(doc => doc.id !== id)
    setDocuments(filteredDocs)
    
    // If the current document is deleted, switch to another one
    if (currentDocument?.id === id && filteredDocs.length > 0) {
      setCurrentDocument(filteredDocs[0])
    } else if (filteredDocs.length === 0) {
      // Create a new document if all are deleted
      createDocument()
    }
  }
  
  // Switch to a different document
  const switchDocument = (id: string) => {
    const doc = documents.find(doc => doc.id === id)
    if (doc) {
      setCurrentDocument(doc)
    }
  }
  
  return {
    documents,
    currentDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    switchDocument
  }
} 