'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';

export const BlockquoteComponent: Components['blockquote'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <blockquote className={`border-l-4 pl-4 italic ${
      isDarkMode 
        ? 'border-gray-600 text-gray-400' 
        : 'border-gray-300 text-gray-600'
    }`} {...props}>
      {children}
    </blockquote>
  );
}

export const LinkComponent: Components['a'] = ({ children, href, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <a 
      href={href} 
      className={`underline hover:no-underline ${
        isDarkMode 
          ? 'text-blue-400 hover:text-blue-300' 
          : 'text-blue-600 hover:text-blue-800'
      }`}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}

export const ParagraphComponent: Components['p'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <p className={`mb-4 leading-relaxed ${
      isDarkMode ? 'text-gray-300' : 'text-gray-700'
    }`} {...props}>
      {children}
    </p>
  );
}

export const StrongComponent: Components['strong'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <strong className={`font-bold ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`} {...props}>
      {children}
    </strong>
  );
}

export const EmComponent: Components['em'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <em className={`italic ${
      isDarkMode ? 'text-gray-300' : 'text-gray-700'
    }`} {...props}>
      {children}
    </em>
  );
}

export const DelComponent: Components['del'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <del className={`line-through ${
      isDarkMode ? 'text-gray-400' : 'text-gray-500'
    }`} {...props}>
      {children}
    </del>
  );
}
