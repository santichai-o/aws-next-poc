import { ChangeEvent } from 'react'

interface InputProps {
  id?: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
  className?: string
  label?: string
  error?: string
}

export default function Input({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  label,
  error
}: InputProps) {
  const inputStyles = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${error ? '#e53e3e' : '#ddd'}`,
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: disabled ? '#f5f5f5' : 'white'
  }

  const labelStyles = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    fontSize: '14px',
    color: '#333'
  }

  const errorStyles = {
    color: '#e53e3e',
    fontSize: '12px',
    marginTop: '0.25rem'
  }

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} style={labelStyles}>
          {label} {required && <span style={{ color: '#e53e3e' }}>*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={inputStyles}
      />
      {error && <div style={errorStyles}>{error}</div>}
    </div>
  )
}
