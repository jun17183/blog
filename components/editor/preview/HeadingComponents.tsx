'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';

export const H1Component: Components['h1'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <h1 className={`text-3xl font-bold mb-4 mt-6 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`} {...props}>
      {children}
    </h1>
  );
}

export const H2Component: Components['h2'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <h2 className={`text-2xl font-bold mb-3 mt-5 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`} {...props}>
      {children}
    </h2>
  );
}

export const H3Component: Components['h3'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <h3 className={`text-xl font-bold mb-2 mt-4 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`} {...props}>
      {children}
    </h3>
  );
}

export const H4Component: Components['h4'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <h4 className={`text-lg font-bold mb-2 mt-3 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`} {...props}>
      {children}
    </h4>
  );
}

export const H5Component: Components['h5'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <h5 className={`text-base font-bold mb-2 mt-3 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`} {...props}>
      {children}
    </h5>
  );
}

export const H6Component: Components['h6'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <h6 className={`text-sm font-bold mb-2 mt-3 ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`} {...props}>
      {children}
    </h6>
  );
}
