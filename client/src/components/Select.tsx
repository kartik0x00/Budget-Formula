import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>}
        <select
          ref={ref}
          className={`input-base ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
