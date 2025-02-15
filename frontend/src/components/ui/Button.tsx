import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  children, 
  className = '', 
  isLoading, 
  variant = 'primary',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`w-full py-3 px-4 bg-[#FAF1E3] text-memo-brown rounded-full 
        border border-memo-brown hover:bg-[#FAF1E3]/80 transition-colors duration-200 
        font-[700] text-[16px] font-inter disabled:opacity-50 
        disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
