import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
  className,
  title,
  type = 'button',
}: ButtonProps) {

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
      className={cn(
        // Base classes
        'rounded-lg transition-colors focus:outline-none focus:ring-0',
        // Size classes
        {
          'px-3 py-2 text-sm': size === 'sm',
          'p-2': size === 'md',
          'px-6 py-2': size === 'lg',
        },
        // Variant classes
        {
          // Primary variant
          'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600': 
            variant === 'primary' && isDarkMode,
          'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300': 
            variant === 'primary' && !isDarkMode,
          // Secondary variant
          'border border-gray-600 text-gray-300 hover:bg-gray-800': 
            variant === 'secondary' && isDarkMode,
          'border border-gray-300 text-gray-700 hover:bg-gray-50': 
            variant === 'secondary' && !isDarkMode,
          // Ghost variant
          'text-gray-400 hover:text-white hover:bg-gray-800': 
            variant === 'ghost' && isDarkMode,
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100': 
            variant === 'ghost' && !isDarkMode,
        },
        className
      )}
    >
      {children}
    </button>
  );
}

