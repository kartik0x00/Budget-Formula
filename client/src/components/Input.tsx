import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>}
        <input
          ref={ref}
          className={`input-base ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
          {...props}
        />
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        {helperText && !error && <p className="text-zinc-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
