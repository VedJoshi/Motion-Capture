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

  const validateForm = () => {
    // Basic validation
    if (!formData.email || !formData.password || !formData.firstName) {
      setError('Please fill in all required fields')
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasNumbers = /\d/.test(formData.password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      return false
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      full_name: `${formData.firstName} ${formData.lastName}`.trim()
    }

    const { error: signUpError } = await signUp(formData.email, formData.password, userData)
    
    if (signUpError) {
      // Provide more specific error messages
      let errorMessage = 'An error occurred during account creation'
      
      if (signUpError.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead or use a different email.'
      } else if (signUpError.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address'
      } else if (signUpError.message.includes('Password should be at least 6 characters')) {
        errorMessage = 'Password must be at least 6 characters long'
      } else if (signUpError.message.includes('Unable to validate email address')) {
        errorMessage = 'Please enter a valid email address'
      } else if (signUpError.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      } else {
        errorMessage = signUpError.message
      }
      
      setError(errorMessage)
    } else {
      setMessage('🎉 Account created successfully! Please check your email for a verification link. You\'ll need to verify your email before signing in.')
      
      // Clear form after successful signup
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      })
    }
    
    setIsLoading(false)
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '#e5e7eb' }
    
    let strength = 0
    let requirements = []
    
    if (password.length >= 6) {
      strength += 1
      requirements.push('✓ At least 6 characters')
    } else {
      requirements.push('✗ At least 6 characters')
    }
    
    if (/[A-Z]/.test(password)) {
      strength += 1
      requirements.push('✓ Uppercase letter')
    } else {
      requirements.push('✗ Uppercase letter')
    }
    
    if (/[a-z]/.test(password)) {
      strength += 1
      requirements.push('✓ Lowercase letter')
    } else {
      requirements.push('✗ Lowercase letter')
    }
    
    if (/\d/.test(password)) {
      strength += 1
      requirements.push('✓ Number')
    } else {
      requirements.push('✗ Number')
    }
    
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e']
    const texts = ['Weak', 'Fair', 'Good', 'Strong']
    
    return {
      strength: strength,
      text: texts[strength - 1] || '',
      color: colors[strength - 1] || '#e5e7eb',
      requirements
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

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

        <div style={{ marginBottom: '1rem' }}>
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
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{
                height: '4px',
                background: '#e5e7eb',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  height: '100%',
                  background: passwordStrength.color,
                  width: `${(passwordStrength.strength / 4) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: passwordStrength.color,
                fontWeight: '500',
                marginBottom: '0.25rem'
              }}>
                {passwordStrength.text && `Password strength: ${passwordStrength.text}`}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--neutral-600)',
                lineHeight: '1.2'
              }}>
                {passwordStrength.requirements.map((req, index) => (
                  <div key={index} style={{
                    color: req.startsWith('✓') ? '#22c55e' : '#ef4444'
                  }}>
                    {req}
                  </div>
                ))}
              </div>
            </div>
          )}
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
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem',
              border: `1px solid ${formData.confirmPassword && formData.password !== formData.confirmPassword ? '#ef4444' : 'var(--neutral-300)'}`,
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              outline: 'none',
              opacity: isLoading ? 0.7 : 1
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = formData.confirmPassword && formData.password !== formData.confirmPassword ? '#ef4444' : 'var(--neutral-300)'}
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div style={{
              fontSize: '0.75rem',
              color: '#ef4444',
              marginTop: '0.25rem'
            }}>
              ✗ Passwords do not match
            </div>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <div style={{
              fontSize: '0.75rem',
              color: '#22c55e',
              marginTop: '0.25rem'
            }}>
              ✓ Passwords match
            </div>
          )}
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

        {message && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--border-radius-md)',
            color: '#166534',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span style={{ marginTop: '0.1rem' }}>✅</span>
            <span>{message}</span>
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
              Creating Account...
            </>
          ) : (
            '🚀 Create Account'
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
          Already have an account?{' '}
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
            Sign in here
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

export default SignupForm