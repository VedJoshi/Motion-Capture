import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

function SignupForm({ onToggleMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    // Validation
    if (!formData.email || !formData.password || !formData.firstName) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      full_name: `${formData.firstName} ${formData.lastName}`.trim()
    }

    const { error } = await signUp(formData.email, formData.password, userData)
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Account created successfully! Please check your email for verification.')
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
          Join FitTracker
        </h2>
        <p style={{ 
          margin: 0, 
          color: 'var(--neutral-600)',
          fontSize: '0.95rem'
        }}>
          Create your fitness account
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--neutral-700)',
              fontSize: '0.9rem'
            }}>
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
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
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--neutral-700)',
              fontSize: '0.9rem'
            }}>
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
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
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: 'var(--neutral-700)',
            fontSize: '0.9rem'
          }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
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
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
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

        {message && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--border-radius-md)',
            color: '#166534',
            fontSize: '0.875rem'
          }}>
            {message}
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
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
          Already have an account?{' '}
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
            Sign in here
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignupForm
