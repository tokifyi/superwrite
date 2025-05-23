'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useEffect, useState } from 'react'

interface TiptapProps {
  isDarkMode: boolean
  isFocusMode: boolean
}

export default function Tiptap({ isDarkMode, isFocusMode }: TiptapProps) {
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing something...',
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
    ],
    editorProps: {
      attributes: {
        class: `prose prose-lg mx-auto focus:outline-none ${
          isDarkMode ? 'prose-invert' : ''
        } ${
          isFocusMode ? 'opacity-70 hover:opacity-100 transition-opacity duration-200' : ''
        }`,
      },
    },
    content: '',
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      const words = text.split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
    },
  })

  useEffect(() => {
    if (editor) {
      editor.commands.focus('end')
    }
  }, [editor])

  return (
    <div className="relative">
      <style jsx global>{`
        .is-editor-empty:first-child::before {
          color: ${isDarkMode ? '#666' : '#aaa'};
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          position: absolute;
        }
        .ProseMirror {
          min-height: 100px;
          padding: 0.5rem 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: ${isDarkMode ? '#666' : '#aaa'};
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <EditorContent editor={editor} />
      
      {/* Word Count */}
      <div 
        className={`fixed bottom-6 right-6 text-sm transition-all duration-200 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        } ${
          isFocusMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'
        }`}
      >
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>
    </div>
  )
} 