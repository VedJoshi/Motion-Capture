/**
 * URL utilities for handling different environments
 */

// Get the current environment
const isDevelopment = process.env.NODE_ENV === 'development'
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

// Base URLs for different environments
const PRODUCTION_URL = 'https://fitformaitracker.netlify.app'
const DEVELOPMENT_URL = 'http://localhost:3000'

/**
 * Get the base URL for the current environment
 */
export const getBaseUrl = (): string => {
  // If we're in development or on localhost, use development URL
  if (isDevelopment || isLocalhost) {
    return DEVELOPMENT_URL
  }
  
  // Otherwise, use the current origin (for production)
  return window.location.origin || PRODUCTION_URL
}

/**
 * Get the full URL for auth redirects
 */
export const getAuthRedirectUrl = (): string => {
  return `${getBaseUrl()}/auth/callback`
}

/**
 * Get the site URL for email confirmations
 */
export const getSiteUrl = (): string => {
  return getBaseUrl()
}

/**
 * Build a full URL with the current base
 */
export const buildUrl = (path: string): string => {
  const base = getBaseUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}
