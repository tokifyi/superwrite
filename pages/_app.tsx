import { useEffect } from 'react'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove Next.js development indicator (the N button)
    if (process.env.NODE_ENV === 'development') {
      // Method 1: Use CSS
      const style = document.createElement('style')
      style.innerHTML = `
        [data-nextjs-root-dev-indicator],
        [data-nextjs-root-dev-indicator] button,
        [data-nextjs-root-dev-indicator] > div,
        .nextjs-root-dev-indicator,
        .nextjs-root-dev-indicator button,
        #__next-build-watcher {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `
      document.head.appendChild(style)
      
      // Method 2: Try to remove the element directly
      const removeDevIndicator = () => {
        const indicator = document.querySelector('[data-nextjs-root-dev-indicator]')
        if (indicator) {
          indicator.remove()
        }
        
        // Also try other possible selectors
        const altIndicator = document.querySelector('.nextjs-root-dev-indicator')
        if (altIndicator) {
          altIndicator.remove()
        }
      }
      
      // Try immediately
      removeDevIndicator()
      
      // And also after a short delay to ensure it's loaded
      setTimeout(removeDevIndicator, 100)
      setTimeout(removeDevIndicator, 1000)
      
      // Create a MutationObserver to remove it if it gets added later
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            removeDevIndicator()
          }
        }
      })
      
      observer.observe(document.body, { childList: true, subtree: true })
      
      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp 