import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

function AuthContainer() {
  const [mode, setMode] = useState('login') // 'login' or 'signup'

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px'
      }}>
        {mode === 'login' ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <SignupForm onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  )
}

export default AuthContainer
