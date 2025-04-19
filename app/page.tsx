'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check system preference on mount
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(darkModePreference.matches)

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    darkModePreference.addEventListener('change', handler)
    return () => darkModePreference.removeEventListener('change', handler)
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you'll need to add the logic to save the email
    // For now, just showing success state
    setSubmitted(true)
  }

  return (
    <main className={`min-h-screen flex items-center justify-center relative transition-colors duration-200 ${
      isDark ? 'bg-[#1a1a1a] text-[#fafafa]' : 'bg-[#fafafa] text-[#1a1a1a]'
    } p-6`}>
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl font-bold mb-8">superwrite</h1>
        
        <p className="text-xl">
          a writing space for thoughts you don't need to keep.
        </p>

        <p>
          i made this because i kept dumping ideas into apple notes —<br />
          not to organize, just to think.
        </p>

        <p>
          superwrite is that, in your browser.<br />
          nothing saves. nothing syncs.
        </p>

        <p>
          just a clean page to write things out, then let them go.<br />
          word count only. no distractions.
        </p>

        <div className="mt-12">
          <Link 
            href="/editor" 
            className="text-xl hover:underline"
          >
            → open superwrite
          </Link>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            (your words disappear when you close the tab)
          </p>
        </div>

        <div className={`mt-16 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} flex flex-col gap-4`}>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {!submitted ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email for updates"
                  className={`bg-transparent border-b ${
                    isDark ? 'border-gray-700 focus:border-gray-500' : 'border-gray-300 focus:border-gray-500'
                  } outline-none px-1 py-0.5`}
                />
                <button 
                  type="submit" 
                  className="hover:underline px-2 py-1 ml-1 text-base"
                  aria-label="Submit email"
                >
                  →
                </button>
              </>
            ) : (
              <p>thanks! i'll keep you posted.</p>
            )}
            <span className="ml-4">
              · <a href="https://x.com/tokifyi" className="hover:underline ml-2">by toki</a>
            </span>
          </form>
        </div>
      </div>
    </main>
  )
}
