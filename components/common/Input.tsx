import { cn } from '@/lib/utils';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: (e: React.CompositionEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isDarkMode?: boolean;
  className?: string;
  type?: 'text' | 'email' | 'password';
}

/**
 * 재사용 가능한 Input 컴포넌트
 * - 다크/라이트 모드 지원
 * - 한글 조합 이벤트 지원
 * - 커스터마이징 가능한 스타일링
 */
export default function Input({
  value,
  onChange,
  onCompositionStart,
  onCompositionEnd,
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
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
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

