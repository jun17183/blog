'use client'
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';

export default function ToolbarSeparator() {
  const [isDarkMode] = useAtom(darkModeAtom);

  return (
    <div className={cn(
      'w-px h-6',
      {
        'bg-gray-600': isDarkMode,
        'bg-gray-300': !isDarkMode,
      }
    )} />
  );
}
