import { cn } from '@/lib/utils';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDarkMode?: boolean;
  className?: string;
  type?: 'text' | 'email' | 'password';
}

export default function Input({
  value,
  onChange,
  placeholder,
  isDarkMode = false,
  className,
  type = 'text',
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        // Base classes
        'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        // Theme classes
        {
          'bg-gray-900 border-gray-600 text-white placeholder-gray-400': isDarkMode,
          'bg-white border-gray-300 text-gray-900 placeholder-gray-500': !isDarkMode,
        },
        className
      )}
    />
  );
}

