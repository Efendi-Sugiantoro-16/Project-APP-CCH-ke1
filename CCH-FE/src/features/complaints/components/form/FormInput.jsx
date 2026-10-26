/**
 * Reusable Form Input Component
 * Supports text, email, tel, number types with validation feedback
 */
export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  className = '',
}) {
  const inputId = `input-${name}`

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
      />
      {error && (
        <div className="invalid-feedback" style={{ display: 'block' }}>
          {error}
        </div>
      )}
      {maxLength && !error && (
        <small className="form-text text-muted">
          {value?.length || 0}/{maxLength} karakter
        </small>
      )}
    </div>
  )
}
