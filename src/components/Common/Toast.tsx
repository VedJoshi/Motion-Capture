import React, { useState, useEffect } from 'react';

/**
 * Toast Notification Component
 * Non-disruptive feedback messages with auto-dismiss
 */
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
}

interface ToastManagerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>;
  onDismiss: (id: string) => void;
}

function Toast({ message, type, duration = 2000, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: 'var(--space-xl)',
      left: '50%',
      background: 'var(--surface-white)',
      border: '1px solid var(--neutral-200)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--space-md) var(--space-lg)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 1001,
      maxWidth: '90vw',
      minWidth: '280px',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: '500',
      transition: 'var(--transition-fast)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible 
        ? 'translateX(-50%) translateY(0)' 
        : 'translateX(-50%) translateY(-20px)'
    };

    const typeStyles = {
      success: {
        borderLeft: '4px solid var(--success-color)',
        background: 'var(--secondary-ultralight)',
        color: 'var(--success-color)'
      },
      error: {
        borderLeft: '4px solid var(--accent-color)',
        background: 'var(--accent-light)',
        color: 'var(--accent-dark)'
      },
      warning: {
        borderLeft: '4px solid var(--warning-color)',
        background: '#fff7ed',
        color: '#c2410c'
      },
      info: {
        borderLeft: '4px solid var(--primary-color)',
        background: 'var(--secondary-ultralight)',
        color: 'var(--primary-dark)'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type];
  };

  return (
    <div style={getToastStyles()}>
      <span style={{ fontSize: '1.2rem' }}>{getIcon()}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => {
            if (onDismiss) onDismiss();
          }, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--neutral-500)',
          cursor: 'pointer',
          padding: 'var(--space-xs)',
          marginLeft: 'auto',
          fontSize: '1.2rem',
          lineHeight: 1,
          borderRadius: 'var(--border-radius-sm)',
          transition: 'var(--transition-fast)'
        }}
        onMouseOver={(e) => e.target.style.background = 'var(--neutral-100)'}
        onMouseOut={(e) => e.target.style.background = 'none'}
      >
        ×
      </button>
    </div>
  );
}

function ToastManager({ toasts, onDismiss }: ToastManagerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            top: `calc(var(--space-xl) + ${index * 80}px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1001 + index
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onDismiss={() => onDismiss(toast.id)}
          />
        </div>
      ))}
    </>
  );
}

export { Toast, ToastManager };
export default Toast;
