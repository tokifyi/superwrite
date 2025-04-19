'use client'

import { Editor } from '@tiptap/react'
import { useState } from 'react'

interface ExportOptionsProps {
  editor: Editor | null
}

export const ExportOptions = ({ editor }: ExportOptionsProps) => {
  const [isExporting, setIsExporting] = useState(false)
  
  // Export as Markdown
  const exportMarkdown = () => {
    if (!editor) return
    
    setIsExporting(true)
    
    try {
      // In a real implementation, you would use a proper HTML-to-Markdown converter
      // This is a simplified example
      const content = editor.getHTML()
      
      // Create a blob and download it
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'document.md'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting as Markdown:', error)
    } finally {
      setIsExporting(false)
    }
  }
  
  // Export as PDF
  const exportPDF = async () => {
    if (!editor) return
    
    setIsExporting(true)
    
    try {
      // In a real implementation, you would use a proper PDF generation library
      // This is a placeholder for demonstration
      const content = editor.getHTML()
      
      // Call an API to convert HTML to PDF
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      
      if (!response.ok) {
        throw new Error('PDF export failed')
      }
      
      // Get the PDF blob and download it
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'document.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting as PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }
  
  // Generate sharing link
  const generateSharingLink = async () => {
    if (!editor) return
    
    setIsExporting(true)
    
    try {
      const content = editor.getJSON()
      
      // In a real implementation, you would call your API to save the document
      // and generate a sharing link
      const response = await fetch('/api/documents/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate sharing link')
      }
      
      // Return the sharing link
      return data.sharingLink
    } catch (error) {
      console.error('Error generating sharing link:', error)
      return null
    } finally {
      setIsExporting(false)
    }
  }
  
  return {
    exportMarkdown,
    exportPDF,
    generateSharingLink,
    isExporting
  }
} 