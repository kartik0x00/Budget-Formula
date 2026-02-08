import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'font-medium rounded-lg transition-colors font-semibold inline-flex items-center justify-center gap-2';

    const variants = {
      primary: 'bg-white text-zinc-900 hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400',
      secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:bg-zinc-700 border border-zinc-700',
      danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        {...props}
      >
        {isLoading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
