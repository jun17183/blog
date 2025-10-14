'use client'
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/blogAtoms';
import { Components } from 'react-markdown';

export const TableComponent: Components['table'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full border-collapse border ${
        isDarkMode ? 'border-gray-600' : 'border-gray-300'
      }`} {...props}>
        {children}
      </table>
    </div>
  );
}

export const ThComponent: Components['th'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <th className={`border px-4 py-2 text-left font-semibold ${
      isDarkMode 
        ? 'border-gray-600 bg-gray-800 text-white' 
        : 'border-gray-300 bg-gray-100 text-gray-900'
    }`} {...props}>
      {children}
    </th>
  );
}

export const TdComponent: Components['td'] = ({ children, ...props }) => {
  const [isDarkMode] = useAtom(darkModeAtom);
  
  return (
    <td className={`border px-4 py-2 ${
      isDarkMode 
        ? 'border-gray-600 text-gray-300' 
        : 'border-gray-300 text-gray-700'
    }`} {...props}>
      {children}
    </td>
  );
}
