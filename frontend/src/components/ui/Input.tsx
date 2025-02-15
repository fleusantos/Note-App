import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className = '', error, ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-3 rounded-lg bg-[#FDF5E6] border border-memo-brown 
        focus:outline-none focus:border-memo-brown focus:ring-1 focus:ring-memo-brown 
        text-[#8B4513] placeholder-black disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
