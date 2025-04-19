'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useEffect } from 'react'
import './Tiptap.css'

interface TiptapProps {
  isDarkMode?: boolean;
  isFocusMode?: boolean;
}

const Tiptap = ({ isDarkMode = false, isFocusMode = false }: TiptapProps) => {
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ editor }) => {
          const isEmpty = editor.state.doc.textContent.length === 0
          return isEmpty ? 'Start writing sth...' : ''
        },
        showOnlyWhenEditable: true,
      }),
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: `editor-content ${isDarkMode ? 'dark' : ''} ${isFocusMode ? 'focus-mode' : ''}`,
      },
    },
  })

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        const text = editor.getText()
        const words = text.trim().split(/\s+/).filter(word => word.length > 0)
        setWordCount(words.length)
      })
    }
  }, [editor])

  return (
    <div className="tiptap-container">
      <EditorContent editor={editor} />
      <div className="word-count-bottom">
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>
    </div>
  )
}

export default Tiptap 