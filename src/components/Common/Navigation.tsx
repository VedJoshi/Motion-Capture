import React from 'react';

/**
 * Navigation bar component with view switching functionality.
 * Renders buttons for Dashboard, Exercises, Reports, and Profile views.
 */
function Navigation({currentView, onChangeView}) {

    const handleNavClick = (viewName) => {
        onChangeView(viewName);
  };
  
  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'exercises', label: '💪 Exercises', icon: '💪' },
    { id: 'reports', label: '📈 Reports', icon: '📈' },
    { id: 'profile', label: '👤 Profile', icon: '👤' }
  ];
  
  return (
    <nav style={{
      background: 'var(--surface-white)',
      borderBottom: '1px solid var(--neutral-200)',
      padding: '0 2rem',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            style={{
              padding: '1rem 1.5rem',
              background: currentView === item.id 
                ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)'
                : 'transparent',
              color: currentView === item.id ? 'white' : 'var(--neutral-600)',
              border: 'none',
              borderRadius: currentView === item.id ? 'var(--border-radius-md)' : '0',
              fontSize: '0.95rem',
              fontWeight: currentView === item.id ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              if (currentView !== item.id) {
                e.target.style.background = 'var(--neutral-50)'
                e.target.style.color = 'var(--primary-color)'
              }
            }}
            onMouseOut={(e) => {
              if (currentView !== item.id) {
                e.target.style.background = 'transparent'
                e.target.style.color = 'var(--neutral-600)'
              }
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
            {item.label.replace(item.icon + ' ', '')}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
