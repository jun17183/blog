import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isDarkMode?: boolean;
  className?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  variant = 'ghost',
  size = 'md',
  isDarkMode = false,
  className = '',
  title,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'rounded-lg transition-colors focus:outline-none focus:ring-0';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'p-2',
    lg: 'px-6 py-2',
  };

  const variantClasses = {
    primary: isDarkMode 
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
    secondary: isDarkMode 
      ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' 
      : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: isDarkMode 
      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 클릭 후 focus 제거
    e.currentTarget.blur();
    onClick?.();
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      title={title}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

