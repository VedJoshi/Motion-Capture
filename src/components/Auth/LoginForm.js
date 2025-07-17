import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

function LoginForm({ onToggleMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      // Provide more specific error messages
      let errorMessage = 'An error occurred during sign in'
      
      if (signInError.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
      } else if (signInError.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.'
      } else if (signInError.message.includes('Too many requests')) {
        errorMessage = 'Too many sign in attempts. Please wait a moment and try again.'
      } else if (signInError.message.includes('User not found')) {
        errorMessage = 'No account found with this email address. Please check your email or create a new account.'
      } else if (signInError.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      } else {
        errorMessage = signInError.message
      }
      
      setError(errorMessage)
    }
    
    setIsLoading(false)
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'var(--surface-white)',
      borderRadius: 'var(--border-radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--neutral-200)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          margin: '0 0 0.5rem 0', 
          color: 'var(--neutral-700)',
          fontSize: '1.75rem',
          fontWeight: '600'
        }}>
          Welcome Back
        </h2>
        <p style={{ 
          margin: 0, 
          color: 'var(--neutral-600)',
          fontSize: '0.95rem'
        }}>
          Sign in to your fitness account
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: 'var(--neutral-700)',
            fontSize: '0.9rem'
          }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid var(--neutral-300)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              outline: 'none',
              opacity: isLoading ? 0.7 : 1
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: 'var(--neutral-700)',
            fontSize: '0.9rem'
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid var(--neutral-300)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              outline: 'none',
              opacity: isLoading ? 0.7 : 1
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
          />
        </div>

        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--border-radius-md)',
            color: '#dc2626',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span style={{ marginTop: '0.1rem' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.875rem',
            background: isLoading 
              ? 'var(--neutral-400)' 
              : 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isLoading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
              Signing in...
            </>
          ) : (
            '🔐 Sign In'
          )}
        </button>
      </form>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--neutral-200)'
      }}>
        <p style={{ 
          margin: 0, 
          color: 'var(--neutral-600)',
          fontSize: '0.9rem'
        }}>
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            Sign up here
          </button>
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoginForm