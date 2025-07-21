import React from 'react';

/**
 * Mobile Bottom Navigation Component
 * Thumb-friendly navigation bar for mobile devices
 */
interface MobileNavigationProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

function MobileNavigation({ currentView, onChangeView }: MobileNavigationProps) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: '🏠',
      description: 'Dashboard'
    },
    { 
      id: 'exercises', 
      label: 'Workout', 
      icon: '💪',
      description: 'Exercises'
    },
    { 
      id: 'reports', 
      label: 'History', 
      icon: '📊',
      description: 'Reports'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: '👤',
      description: 'Profile'
    }
  ];

  const handleNavClick = (viewName: string) => {
    onChangeView(viewName);
    
    // Trigger device vibration for tactile feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-items">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`bottom-nav-item ${currentView === item.id ? 'active' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              color: currentView === item.id ? 'var(--primary-color)' : 'var(--neutral-600)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 'var(--space-sm)',
              minHeight: 'var(--touch-md)',
              minWidth: 'var(--touch-md)',
              borderRadius: 'var(--border-radius-md)',
              position: 'relative'
            }}
          >
            <div className="bottom-nav-icon" style={{
              fontSize: '1.5rem',
              marginBottom: '2px',
              transition: 'var(--transition-fast)',
              transform: currentView === item.id ? 'scale(1.1)' : 'scale(1)'
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: currentView === item.id ? '600' : '500',
              fontFamily: 'var(--font-family-primary)'
            }}>
              {item.label}
            </span>
            {currentView === item.id && (
              <div style={{
                position: 'absolute',
                top: '4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '3px',
                background: 'var(--primary-color)',
                borderRadius: '3px'
              }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MobileNavigation;
