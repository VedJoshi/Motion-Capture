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

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
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
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid var(--neutral-300)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              outline: 'none'
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
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid var(--neutral-300)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              outline: 'none'
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
            fontSize: '0.875rem'
          }}>
            {error}
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
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
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
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem'
            }}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
