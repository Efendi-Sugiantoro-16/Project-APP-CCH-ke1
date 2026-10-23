/**
 * Reusable Form Select Component
 * Dropdown select with validation feedback
 */
export function FormSelect({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  options = [],
  required = false,
  disabled = false,
  placeholder = '-- Pilih --',
  className = '',
}) {
  const selectId = `select-${name}`

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={selectId} className="form-label">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <select
        className={`form-control ${error ? 'is-invalid' : ''}`}
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="invalid-feedback" style={{ display: 'block' }}>
          {error}
        </div>
      )}
    </div>
  )
}
