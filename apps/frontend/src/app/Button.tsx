import React from 'react';

export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<unknown>) {
  return (
    <button
      className={`${className} disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ml-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-400 disabled:bg-gray-200`}
      {...props}
    >
      {children}
    </button>
  );
}
