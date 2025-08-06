import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  className?: string
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseStyles = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    opacity: disabled ? 0.6 : 1
  }

  const variants = {
    primary: {
      backgroundColor: '#0070f3',
      color: 'white'
    },
    secondary: {
      backgroundColor: '#f4f4f4',
      color: '#333',
      border: '1px solid #ddd'
    },
    danger: {
      backgroundColor: '#e53e3e',
      color: 'white'
    }
  }

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant]
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyles}
      className={className}
    >
      {children}
    </button>
  )
}
