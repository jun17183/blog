'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';

export const UlComponent: Components['ul'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <ul className={`list-disc list-inside mb-4 space-y-1 ${
      isDarkMode ? 'text-gray-300' : 'text-gray-700'
    }`} {...props}>
      {children}
    </ul>
  );
}

export const OlComponent: Components['ol'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <ol className={`list-decimal list-inside mb-4 space-y-1 ${
      isDarkMode ? 'text-gray-300' : 'text-gray-700'
    }`} {...props}>
      {children}
    </ol>
  );
}

export const LiComponent: Components['li'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <li className={`${
      isDarkMode ? 'text-gray-300' : 'text-gray-700'
    }`} {...props}>
      {children}
    </li>
  );
}
