'use client'

import { useEffect } from 'react'

export default function NextDevIndicatorRemover() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Create style to hide both the button and its popup menu
      const style = document.createElement('style')
      style.innerHTML = `
        /* Hide the N button */
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
        
        /* Hide the popup menu */
        [data-nextjs-root-dev-indicator] + div,
        [data-nextjs-root-dev-indicator] ~ div,
        div[role="dialog"][aria-modal="true"],
        div[role="dialog"] div[role="menuitem"],
        div[data-testid="dev-indicator-menu"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        
        /* Target the specific menu shown in the screenshot */
        div[role="dialog"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        
        /* Hide any elements with "Route", "Static", "Turbopack", "Enabled", "Preferences" text */
        div:has(> span:contains("Route")),
        div:has(> span:contains("Static")),
        div:has(> span:contains("Turbopack")),
        div:has(> span:contains("Enabled")),
        div:has(> span:contains("Preferences")) {
          display: none !important;
        }
      `
      document.head.appendChild(style)
      
      // Function to remove both the button and menu
      const removeNextjsElements = () => {
        // Remove the N button
        const indicators = document.querySelectorAll('[data-nextjs-root-dev-indicator], .nextjs-root-dev-indicator')
        indicators.forEach(el => el.remove())
        
        // Remove any dialog/menu elements
        const dialogs = document.querySelectorAll('div[role="dialog"]')
        dialogs.forEach(el => el.remove())
        
        // Remove any elements that might be the menu
        const menus = document.querySelectorAll('div[data-testid="dev-indicator-menu"]')
        menus.forEach(el => el.remove())
        
        // Find and remove elements with specific text content
        document.querySelectorAll('div').forEach(div => {
          const text = div.textContent?.toLowerCase() || ''
          if (
            text.includes('route') && text.includes('static') ||
            text.includes('turbopack') && text.includes('enabled') ||
            text.includes('preferences')
          ) {
            // This is likely the menu we want to remove
            const parent = div.parentElement?.parentElement?.parentElement
            if (parent) parent.remove()
            else div.remove()
          }
        })
      }
      
      // Run immediately
      removeNextjsElements()
      
      // Run after a delay to catch elements that might be added later
      setTimeout(removeNextjsElements, 500)
      setTimeout(removeNextjsElements, 1000)
      setTimeout(removeNextjsElements, 2000)
      
      // Create a MutationObserver to remove elements if they get added later
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            removeNextjsElements()
          }
        }
      })
      
      observer.observe(document.body, { childList: true, subtree: true })
      
      // Also try to intercept and prevent the menu from opening
      const originalAddEventListener = EventTarget.prototype.addEventListener
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (
          this instanceof HTMLElement && 
          this.hasAttribute && 
          this.hasAttribute('data-nextjs-root-dev-indicator')
        ) {
          // Don't add event listeners to the Next.js dev indicator
          return
        }
        return originalAddEventListener.call(this, type, listener, options)
      }
      
      return () => {
        observer.disconnect()
        EventTarget.prototype.addEventListener = originalAddEventListener
      }
    }
  }, [])
  
  return null
} 