import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { dbHelpers } from '../../config/supabase'

function UserProfile() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    weight: '',
    fitness_level: 'beginner',
    goals: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await dbHelpers.getUserProfile(user.id)
      
      // Skip error if no user profile found
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      if (data) {
        setProfile({
          first_name: data.first_name || user.user_metadata?.first_name || '',
          last_name: data.last_name || user.user_metadata?.last_name || '',
          age: data.age || '',
          height: data.height || '',
          weight: data.weight || '',
          fitness_level: data.fitness_level || 'beginner',
          goals: data.goals || ''
        })
      } else {
        // New user, populate with auth metadata if available
        setProfile(prev => ({
          ...prev,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || ''
        }))
      }
    } catch (err) {
      setError('Failed to load profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const { error } = await dbHelpers.updateUserProfile(user.id, profile)
      if (error) throw error
      
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('Failed to update profile')
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut()
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.75rem',
          fontWeight: '600',
          color: 'var(--neutral-700)'
        }}>
          👤 Your Profile
        </h2>
        <button
          onClick={handleSignOut}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--warning-color)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          Sign Out
        </button>
      </div>

      <div style={{
        background: 'var(--surface-white)',
        borderRadius: 'var(--border-radius-xl)',
        border: '1px solid var(--neutral-200)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* User Info Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          borderRadius: 'var(--border-radius-lg)',
          color: 'white'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            👤
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>
              {profile.first_name || profile.last_name 
                ? `${profile.first_name} ${profile.last_name}`.trim()
                : 'Welcome!'
              }
            </h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
              {user.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--neutral-700)'
            }}>
              Personal Information
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: 'var(--neutral-700)',
                  fontSize: '0.9rem'
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
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
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: 'var(--neutral-700)',
                  fontSize: '0.9rem'
                }}>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  min="13"
                  max="120"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
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
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleInputChange}
                  min="100"
                  max="250"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
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
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={profile.weight}
                  onChange={handleInputChange}
                  min="30"
                  max="300"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Fitness Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--neutral-700)'
            }}>
              Fitness Information
            </h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--neutral-700)',
                fontSize: '0.9rem'
              }}>
                Fitness Level
              </label>
              <select
                name="fitness_level"
                value={profile.fitness_level}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--neutral-700)',
                fontSize: '0.9rem'
              }}>
                Fitness Goals
              </label>
              <textarea
                name="goals"
                value={profile.goals}
                onChange={handleInputChange}
                placeholder="What are your fitness goals? (e.g., lose weight, build muscle, improve endurance)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

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
            disabled={saving}
            style={{
              padding: '0.875rem 2rem',
              background: saving 
                ? 'var(--neutral-400)' 
                : 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserProfile
