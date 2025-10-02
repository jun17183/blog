'use client'
import { DarkModeProvider, useDarkMode } from './components/DarkModeProvider';
import BlogHeader from './components/BlogHeader';
import { Provider } from 'jotai';

function ListLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <BlogHeader isDarkMode={isDarkMode} onDarkModeToggle={toggleDarkMode} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default function ListLayout({ 
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <DarkModeProvider>
      <Provider>
        <ListLayoutContent>
          {children}
        </ListLayoutContent>
      </Provider>
    </DarkModeProvider>
  );
}
