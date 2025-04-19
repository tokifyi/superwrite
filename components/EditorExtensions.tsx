// Add advanced editor extensions
import { Extension } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

// Custom extension for auto-saving
const AutoSave = Extension.create({
  name: 'autoSave',
  addStorage() {
    return {
      saveTimeout: undefined,
    }
  },
  onUpdate({ editor }) {
    const { saveTimeout } = this.storage
    
    // Clear timeout if it exists
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    
    // Set new timeout
    this.storage.saveTimeout = setTimeout(() => {
      // Save content to localStorage or API
      const content = editor.getJSON()
      localStorage.setItem('superwrite-content', JSON.stringify(content))
      console.log('Content saved automatically')
    }, 1000)
  },
})

export const editorExtensions = [
  // Existing extensions
  StarterKit,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  Image.configure({
    allowBase64: true,
    inline: true,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  
  // New extensions
  Placeholder.configure({
    placeholder: 'Start writing...',
  }),
  Highlight,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableCell,
  TableHeader,
  AutoSave,
] 