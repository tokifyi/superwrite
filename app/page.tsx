'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [submitError, setSubmitError] = useState('')
  const [isSupabaseReady, setIsSupabaseReady] = useState(false)

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(darkModePreference.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    darkModePreference.addEventListener('change', handler)
    return () => darkModePreference.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    // Check if Supabase is ready
    const supabase = getSupabaseClient()
    setIsSupabaseReady(!!supabase)
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!email) {
      setSubmitError('Please enter an email')
      return
    }

    const supabase = getSupabaseClient()
    
    if (!supabase) {
      console.error('Supabase client not initialized')
      setSubmitError('Service temporarily unavailable')
      return
    }

    try {
      const { error } = await supabase
        .from('email_subscribers')
        .insert([
          { email: email.toLowerCase(), subscribed_at: new Date().toISOString() }
        ])

      if (error) {
        console.error('Supabase error:', error)
        if (error.code === '23505') {
          setSubmitError("You're already subscribed!")
        } else {
          setSubmitError('Something went wrong. Please try again.')
        }
        return
      }

      setSubmitted(true)
      setEmail('')
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  return (
    <main className={`min-h-screen flex items-center justify-center relative transition-colors duration-200 ${
      isDark ? 'bg-[#191919] text-[#ededed]' : 'bg-[#fafafa] text-[#1a1a1a]'
    } p-6`}>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4 transition-opacity duration-200 opacity-60 hover:opacity-100">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-all duration-200 ${
            isDark 
              ? 'hover:bg-[#2a2a2a] text-[#999]' 
              : 'hover:bg-gray-100 text-[#999]'
          }`}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

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
          <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
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
                  disabled={!isSupabaseReady}
                />
                <button 
                  type="submit" 
                  className={`hover:underline px-2 py-1 ml-1 text-base ${!isSupabaseReady ? 'opacity-50' : ''}`}
                  aria-label="Submit email"
                  disabled={!isSupabaseReady}
                >
                  →
                </button>
              </>
            ) : (
              <p>thanks! i'll keep you posted.</p>
            )}
            {submitError && (
              <p className={`absolute -bottom-6 left-0 text-sm ${isDark ? 'text-red-400' : 'text-red-500'}`}>
                {submitError}
              </p>
            )}
            <span className="ml-4">
              · <a href="https://x.com/tokifyi" target="_blank" rel="noopener noreferrer" className="hover:underline ml-2">by toki</a>
            </span>
          </form>
        </div>
      </div>
    </main>
  )
}
