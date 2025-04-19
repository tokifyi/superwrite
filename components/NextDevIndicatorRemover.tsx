'use client'

import { useEffect } from 'react'

export default function NextDevIndicatorRemover() {
  useEffect(() => {
    // Remove the Next.js dev indicator
    const style = document.createElement('style')
    style.innerHTML = `
      #__next-build-watcher { display: none !important; }
      #__next-build-watcher * { display: none !important; }
    `
    document.head.appendChild(style)
  }, [])

  return null
} 