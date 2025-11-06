'use client'
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';

export const CodeComponent: Components['code'] = ({ className, children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  const match = /language-(\w+)/.exec(className || '');
  const isInline = !match;
  
  if (isInline) {
    return (
      <code className={cn(
        className,
        'px-1 py-0.5 rounded text-sm font-mono',
        {
          'bg-gray-800 text-gray-300': isDarkMode,
          'bg-gray-100 text-gray-800': !isDarkMode,
        }
      )} {...props}>
        {children}
      </code>
    );
  }

  return (
      <pre className={cn(
        className,
        'rounded-lg p-4 overflow-x-auto text-sm',
        {
          'bg-[#2d2d2d] text-gray-100 border border-gray-600': isDarkMode,
          'bg-[#1e1e1e] text-gray-100 border border-gray-700': !isDarkMode,
        }
      )} {...(props as Record<string, unknown>)}>
        <code className={className}>
          {children}
        </code>
      </pre>
  );
}
