import React from 'react';

/**
 * Floating Action Button (FAB) Component
 * Mobile-friendly primary action button positioned at bottom-right
 */
interface FABProps {
  onClick: () => void;
  icon?: string;
  label?: string;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

function FloatingActionButton({ 
  onClick, 
  icon = '▶️', 
  label = 'Start',
  isActive = false,
  disabled = false,
  className = ''
}: FABProps) {
  
  const handleClick = () => {
    if (!disabled) {
      // Add haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`fab ${className}`}
      style={{
        position: 'fixed',
        bottom: 'var(--space-xl)',
        right: 'var(--space-xl)',
        width: 'var(--touch-lg)',
        height: 'var(--touch-lg)',
        borderRadius: 'var(--border-radius-full)',
        background: disabled 
          ? 'var(--neutral-400)'
          : isActive 
            ? 'var(--accent-color)'
            : 'var(--primary-dark)',
        color: 'white',
        border: 'none',
        boxShadow: disabled ? 'none' : 'var(--shadow-fab)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        transition: 'var(--transition-fast)',
        zIndex: 1000,
        fontFamily: 'var(--font-family-primary)',
        fontWeight: '600'
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 20px rgba(66, 165, 245, 0.3)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = 'var(--shadow-fab)';
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.target.style.transform = 'scale(0.95)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.target.style.transform = 'scale(1.1)';
        }
      }}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

/**
 * FAB with Extended Label (for desktop)
 */
interface ExtendedFABProps extends FABProps {
  showLabel?: boolean;
}

function ExtendedFAB({ 
  showLabel = false, 
  label = 'Start Workout',
  icon = '🚀',
  ...props 
}: ExtendedFABProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`fab extended ${props.className || ''}`}
      style={{
        position: 'fixed',
        bottom: 'var(--space-xl)',
        right: 'var(--space-xl)',
        height: 'var(--touch-lg)',
        borderRadius: 'var(--border-radius-full)',
        background: props.disabled 
          ? 'var(--neutral-400)'
          : props.isActive 
            ? 'var(--accent-color)'
            : 'var(--primary-dark)',
        color: 'white',
        border: 'none',
        boxShadow: props.disabled ? 'none' : 'var(--shadow-fab)',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabel ? 'var(--space-sm)' : '0',
        padding: showLabel ? '0 var(--space-lg)' : '0',
        minWidth: showLabel ? 'auto' : 'var(--touch-lg)',
        fontSize: '1.2rem',
        fontWeight: '600',
        fontFamily: 'var(--font-family-primary)',
        transition: 'var(--transition-fast)',
        zIndex: 1000
      }}
      onMouseOver={(e) => {
        if (!props.disabled) {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 12px 20px rgba(66, 165, 245, 0.3)';
        }
      }}
      onMouseOut={(e) => {
        if (!props.disabled) {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = 'var(--shadow-fab)';
        }
      }}
      aria-label={label}
      title={label}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      {showLabel && (
        <span style={{ 
          fontSize: 'var(--font-size-sm)',
          fontWeight: '600'
        }}>
          {label}
        </span>
      )}
    </button>
  );
}

export { FloatingActionButton, ExtendedFAB };
export default FloatingActionButton;
