/**
 * Reusable Form Textarea Component
 * Multi-line text input with character counter
 */
export function FormTextarea({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className = '',
}) {
  const textareaId = `textarea-${name}`

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={textareaId} className="form-label">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <textarea
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
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
